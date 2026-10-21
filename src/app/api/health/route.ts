import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureMonitorStarted } from "@/lib/monitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    void ensureMonitorStarted();
    const dbCheck = db.$ping();
    return NextResponse.json(
      {
        ok: dbCheck.ok,
        status: dbCheck.ok ? "healthy" : "degraded",
        dbLatencyMs: dbCheck.latencyMs,
        uptimeSec: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      {
        status: dbCheck.ok ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        status: "unhealthy",
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
