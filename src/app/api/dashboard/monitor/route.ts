import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthorized } from "@/lib/dev-auth";
import {
  ensureMonitorStarted,
  executeMonitorCheck,
  getMonitorConfig,
  getMonitorRuntimeStatus,
  isValidDiscordWebhookUrl,
  monitorConfigSchema,
  saveMonitorConfig,
} from "@/lib/monitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    await ensureMonitorStarted();
    const [config, logs] = await Promise.all([
      getMonitorConfig(),
      db.monitorPingLog.findMany({ orderBy: { createdAt: "desc" }, take: 40 }),
    ]);

    return NextResponse.json(
      {
        ok: true,
        config,
        runtime: getMonitorRuntimeStatus(),
        logs,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[/api/dashboard/monitor GET]", err);
    return NextResponse.json(
      { ok: false, error: "Impossible de lire la configuration du monitoring." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const body = await request.json().catch(() => null);
    const parsed = monitorConfigSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstIssue?.message ?? "Configuration invalide." },
        { status: 400 }
      );
    }

    const saved = await saveMonitorConfig(parsed.data);
    return NextResponse.json({
      ok: true,
      config: saved,
      runtime: getMonitorRuntimeStatus(),
    });
  } catch (err) {
    console.error("[/api/dashboard/monitor PUT]", err);
    return NextResponse.json(
      { ok: false, error: "Enregistrement impossible." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const body = (await request.json().catch(() => ({}))) as {
      action?: "ping" | "test_discord";
      discordWebhookUrl?: string;
    };

    const currentConfig = await getMonitorConfig();

    if (body.action === "test_discord") {
      const candidateUrl = (body.discordWebhookUrl ?? currentConfig.discordWebhookUrl).trim();
      if (!candidateUrl || !isValidDiscordWebhookUrl(candidateUrl)) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Saisissez d'abord une URL de Webhook Discord valide (https://discord.com/api/webhooks/...).",
          },
          { status: 400 }
        );
      }

      const log = await executeMonitorCheck("test", {
        ...currentConfig,
        discordWebhookUrl: candidateUrl,
      });

      return NextResponse.json({
        ok: true,
        log,
        runtime: getMonitorRuntimeStatus(),
      });
    }

    const log = await executeMonitorCheck("manual", currentConfig);
    return NextResponse.json({
      ok: true,
      log,
      runtime: getMonitorRuntimeStatus(),
    });
  } catch (err) {
    console.error("[/api/dashboard/monitor POST]", err);
    return NextResponse.json(
      { ok: false, error: "Exécution du ping impossible." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    await db.monitorPingLog.deleteMany();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/dashboard/monitor DELETE]", err);
    return NextResponse.json(
      { ok: false, error: "Purge de l'historique impossible." },
      { status: 500 }
    );
  }
}
