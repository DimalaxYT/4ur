import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const trackSchema = z.object({
  path: z.string().trim().min(1).max(200),
  referrer: z.string().trim().max(500).optional().or(z.literal("")),
  screenWidth: z.number().min(0).max(12000).optional(),
});

const BOT_PATTERN =
  /bot|crawler|spider|headless|4ur-monitor|curl|wget|lighthouse|slurp|mediapartners/i;

function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/chrome\/|crios\//i.test(ua) && !/edg\//i.test(ua)) return "Chrome";
  if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) return "Safari";
  return "Autre";
}

function parseDevice(ua: string, screenWidth?: number): string {
  if (screenWidth && screenWidth > 0) {
    if (screenWidth < 768) return "mobile";
    if (screenWidth < 1024) return "tablet";
  }
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

function normalizeReferrer(raw?: string, hostHeader?: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const refHost = url.hostname.replace(/^www\./i, "").toLowerCase();
    const ownHost = (hostHeader ?? "").split(":")[0]?.replace(/^www\./i, "").toLowerCase();
    if (!refHost || (ownHost && refHost === ownHost)) return null;
    return refHost.slice(0, 120);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const limit = checkLimit(request, "analytics");
  if (!limit.ok) {
    return NextResponse.json({ ok: true });
  }

  try {
    const ua = request.headers.get("user-agent") ?? "";
    if (!ua || BOT_PATTERN.test(ua)) {
      return NextResponse.json({ ok: true });
    }

    const body = await request.json().catch(() => null);
    const parsed = trackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: true });
    }

    const cleanPath = parsed.data.path.split("?")[0]?.split("#")[0] || "/";
    if (
      !cleanPath.startsWith("/") ||
      cleanPath.startsWith("/dashboard") ||
      cleanPath.startsWith("/api") ||
      cleanPath.startsWith("/_next")
    ) {
      return NextResponse.json({ ok: true });
    }

    const daySalt = new Date().toISOString().slice(0, 10);
    const ip = clientIp(request) ?? "anon";
    const lang = request.headers.get("accept-language")?.slice(0, 32) ?? "";
    const visitorHash = createHash("sha256")
      .update(`${daySalt}|${ip}|${ua}|${lang}`)
      .digest("hex")
      .slice(0, 20);

    await db.pageView.create({
      data: {
        path: cleanPath,
        referrer: normalizeReferrer(parsed.data.referrer, request.headers.get("host")),
        device: parseDevice(ua, parsed.data.screenWidth),
        browser: parseBrowser(ua),
        visitorHash,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
