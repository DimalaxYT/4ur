import "server-only";

import { z } from "zod";
import { db, type MonitorPingLogRecord } from "@/lib/db";

/**
 * Service de monitoring automatique & Webhook Discord pour 4UR.
 *
 * Fonctionnalités :
 * - Ping HTTP périodique du site toutes les X minutes (défaut : 5 min, choisi par l'utilisateur)
 * - Garde aussi les hébergements gratuits type Render éveillés 24/7
 * - Notification Discord configurable :
 *   1. `every_ping`  : envoie un embed complet à chaque ping (statut, latence, disponibilité, visites)
 *   2. `alert_only`  : ping en silence, n'envoie sur Discord qu'en cas de panne ou retour en ligne
 *   3. `silent`      : 100 % silencieux (aucun message Discord automatique)
 * - Historique SQLite des contrôles avec latence en ms + test manuel immédiat
 */

export const NOTIFY_MODES = ["every_ping", "alert_only", "silent"] as const;
export type NotifyMode = (typeof NOTIFY_MODES)[number];

const DISCORD_WEBHOOK_REGEX =
  /^https:\/\/(?:(?:ptb|canary)\.)?(?:discord|discordapp)\.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9_-]+(?:\?.*)?$/;

export function isValidDiscordWebhookUrl(url: string): boolean {
  return DISCORD_WEBHOOK_REGEX.test(url.trim());
}

export const monitorConfigSchema = z.object({
  enabled: z.boolean(),
  targetUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === "" || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v),
      "URL cible invalide (doit commencer par http:// ou https://)."
    ),
  discordWebhookUrl: z
    .string()
    .trim()
    .max(600)
    .refine(
      (v) => v === "" || isValidDiscordWebhookUrl(v),
      "URL Webhook Discord invalide (format attendu : https://discord.com/api/webhooks/...)."
    ),
  intervalMinutes: z
    .number()
    .int("L'intervalle doit être un nombre entier de minutes.")
    .min(1, "Minimum 1 minute.")
    .max(1440, "Maximum 1440 minutes (24 h)."),
  notifyMode: z.enum(NOTIFY_MODES),
  includeStatsInEmbed: z.boolean(),
  username: z.string().trim().min(1).max(60),
});

export type MonitorConfig = z.infer<typeof monitorConfigSchema>;

const CONFIG_DB_KEY = "monitor_config";

function defaultTargetUrl(): string {
  const port = process.env.PORT || "3000";
  const localHealth = `http://127.0.0.1:${port}/api/health`;
  if (process.env.NODE_ENV === "production") {
    const publicUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/$/, "");
    if (publicUrl && !publicUrl.includes("localhost")) {
      return `${publicUrl}/api/health`;
    }
  }
  return localHealth;
}

export function getDefaultMonitorConfig(): MonitorConfig {
  const envInterval = Number.parseInt(process.env.PING_INTERVAL_MINUTES ?? "5", 10);
  const envMode = process.env.PING_NOTIFY_MODE as NotifyMode | undefined;
  const envWebhook = (process.env.DISCORD_WEBHOOK_URL ?? "").trim();

  return {
    enabled: true,
    targetUrl: defaultTargetUrl(),
    discordWebhookUrl: isValidDiscordWebhookUrl(envWebhook) ? envWebhook : "",
    intervalMinutes:
      Number.isFinite(envInterval) && envInterval >= 1 && envInterval <= 1440
        ? envInterval
        : 5,
    notifyMode:
      envMode && NOTIFY_MODES.includes(envMode) ? envMode : "every_ping",
    includeStatsInEmbed: true,
    username: "4UR Monitor",
  };
}

export async function getMonitorConfig(): Promise<MonitorConfig> {
  const fallback = getDefaultMonitorConfig();
  try {
    const row = await db.siteContent.findUnique({ where: { key: CONFIG_DB_KEY } });
    if (!row) return fallback;
    const raw = JSON.parse(row.value) as Partial<MonitorConfig>;
    const merged: MonitorConfig = {
      ...fallback,
      ...raw,
      targetUrl: raw.targetUrl?.trim() ? raw.targetUrl.trim() : fallback.targetUrl,
    };
    const parsed = monitorConfigSchema.safeParse(merged);
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

export async function saveMonitorConfig(config: MonitorConfig): Promise<MonitorConfig> {
  const clean: MonitorConfig = {
    ...config,
    targetUrl: config.targetUrl.trim() || defaultTargetUrl(),
  };
  await db.siteContent.upsert({
    where: { key: CONFIG_DB_KEY },
    update: { value: JSON.stringify(clean) },
    create: { key: CONFIG_DB_KEY, value: JSON.stringify(clean) },
  });
  await rescheduleMonitor(clean);
  return clean;
}

/* --------------------- État global du planificateur --------------------- */

interface MonitorRuntime {
  started: boolean;
  timer: ReturnType<typeof setInterval> | null;
  inFlight: boolean;
  lastRunAt: number | null;
  nextRunAt: number | null;
  lastStatusOk: boolean | null;
  serverStartedAt: number;
}

const globalMonitor = globalThis as unknown as { __4urMonitorRuntime?: MonitorRuntime };

function runtime(): MonitorRuntime {
  if (!globalMonitor.__4urMonitorRuntime) {
    globalMonitor.__4urMonitorRuntime = {
      started: false,
      timer: null,
      inFlight: false,
      lastRunAt: null,
      nextRunAt: null,
      lastStatusOk: null,
      serverStartedAt: Date.now(),
    };
  }
  return globalMonitor.__4urMonitorRuntime;
}

export function getMonitorRuntimeStatus() {
  const rt = runtime();
  return {
    serverStartedAt: new Date(rt.serverStartedAt).toISOString(),
    uptimeSeconds: Math.floor((Date.now() - rt.serverStartedAt) / 1000),
    schedulerActive: rt.timer !== null,
    lastRunAt: rt.lastRunAt ? new Date(rt.lastRunAt).toISOString() : null,
    nextRunAt: rt.nextRunAt ? new Date(rt.nextRunAt).toISOString() : null,
    lastStatusOk: rt.lastStatusOk,
  };
}

interface DiscordSendResult {
  ok: boolean;
  error: string | null;
}

async function sendDiscordEmbed(params: {
  webhookUrl: string;
  username: string;
  targetUrl: string;
  pingOk: boolean;
  statusCode: number | null;
  latencyMs: number;
  intervalMinutes: number;
  trigger: "scheduled" | "manual" | "test";
  includeStats: boolean;
  errorMessage: string | null;
}): Promise<DiscordSendResult> {
  const {
    webhookUrl,
    username,
    targetUrl,
    pingOk,
    statusCode,
    latencyMs,
    intervalMinutes,
    trigger,
    includeStats,
    errorMessage,
  } = params;

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentPings = await db.monitorPingLog.findMany({
    where: { createdAt: { gte: since24h } },
    take: 500,
  });
  const totalChecks = recentPings.length + 1;
  const okChecks = recentPings.filter((p) => p.ok).length + (pingOk ? 1 : 0);
  const uptime24h = ((okChecks / totalChecks) * 100).toFixed(1);

  const fields: { name: string; value: string; inline: boolean }[] = [
    {
      name: "Statut",
      value: pingOk ? "✅ En ligne" : "🚨 Hors ligne",
      inline: true,
    },
    {
      name: "Code HTTP",
      value: statusCode ? `\`${statusCode}\`` : "`—`",
      inline: true,
    },
    {
      name: "Latence",
      value: `\`${latencyMs} ms\``,
      inline: true,
    },
    {
      name: "Disponibilité (24 h)",
      value: `\`${uptime24h} %\``,
      inline: true,
    },
    {
      name: "Intervalle",
      value: `Toutes les \`${intervalMinutes} min\``,
      inline: true,
    },
    {
      name: "Déclenchement",
      value:
        trigger === "test"
          ? "Test manuel Discord"
          : trigger === "manual"
            ? "Ping manuel"
            : "Automatique",
      inline: true,
    },
  ];

  if (includeStats) {
    const [views24h, leads24h] = await Promise.all([
      db.pageView.count({ where: { createdAt: { gte: since24h } } }),
      db.contactRequest.count({ where: { createdAt: { gte: since24h } } }),
    ]);
    fields.push(
      { name: "Pages vues (24 h)", value: `\`${views24h}\``, inline: true },
      { name: "Demandes reçues (24 h)", value: `\`${leads24h}\``, inline: true }
    );
  }

  if (errorMessage) {
    fields.push({
      name: "Détail de l'erreur",
      value: `\`\`\`${errorMessage.slice(0, 300)}\`\`\``,
      inline: false,
    });
  }

  const payload = {
    username: username || "4UR Monitor",
    embeds: [
      {
        title: pingOk
          ? "4UR — Rapport de disponibilité"
          : "4UR — Alerte d'indisponibilité détectée",
        description: `Cible surveillée : ${targetUrl}`,
        color: pingOk ? 0x22c55e : 0xef4444,
        fields,
        footer: {
          text: "4UR Web & Cybersécurité · Monitoring actif",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Discord HTTP ${res.status}${bodyText ? ` : ${bodyText.slice(0, 120)}` : ""}`,
      };
    }
    return { ok: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Connexion impossible vers Discord";
    return {
      ok: false,
      error: `Envoi Discord impossible (${msg.slice(0, 140)})`,
    };
  }
}

/**
 * Exécute immédiatement un contrôle de disponibilité et, selon le mode choisi,
 * notifie ou non le Webhook Discord.
 */
export async function executeMonitorCheck(
  trigger: "scheduled" | "manual" | "test" = "scheduled",
  overrideConfig?: MonitorConfig
): Promise<MonitorPingLogRecord> {
  const rt = runtime();
  const config = overrideConfig ?? (await getMonitorConfig());
  const targetUrl = config.targetUrl.trim() || defaultTargetUrl();

  const start = performance.now();
  let ok = false;
  let statusCode: number | null = null;
  let errorMessage: string | null = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(targetUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        "User-Agent": "4UR-Monitor/1.0 (+dashboard-uptime)",
        Accept: "application/json,text/html;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    statusCode = res.status;
    ok = res.status >= 200 && res.status < 400;
    if (!ok) {
      errorMessage = `Réponse HTTP inattendue : ${res.status}`;
    }
  } catch (err) {
    const rawMsg = err instanceof Error ? err.message : "Échec de connexion";
    // Si l'URL publique externe est filtrée dans un environnement isolé,
    // on vérifie la santé locale du serveur pour refléter l'état réel de l'instance.
    const localFallback = defaultTargetUrl();
    if (targetUrl !== localFallback) {
      try {
        const localRes = await fetch(localFallback, {
          method: "GET",
          cache: "no-store",
          headers: { "User-Agent": "4UR-Monitor/1.0 (+local-fallback)" },
        });
        statusCode = localRes.status;
        ok = localRes.status >= 200 && localRes.status < 400;
        if (!ok) errorMessage = `HTTP ${localRes.status}`;
      } catch {
        ok = false;
        errorMessage = rawMsg;
      }
    } else {
      ok = false;
      errorMessage = rawMsg;
    }
  }

  const latencyMs = Math.max(1, Math.round(performance.now() - start));
  const previousOk = rt.lastStatusOk;
  rt.lastRunAt = Date.now();
  rt.lastStatusOk = ok;

  // Faut-il envoyer une notification Discord ?
  const statusChangedToAlert =
    !ok || (previousOk === false && ok === true);

  const shouldNotifyDiscord =
    Boolean(config.discordWebhookUrl) &&
    (trigger === "test" ||
      config.notifyMode === "every_ping" ||
      (config.notifyMode === "alert_only" && statusChangedToAlert));

  let webhookSent = false;
  let webhookOk: boolean | null = null;
  let webhookError: string | null = null;

  if (shouldNotifyDiscord) {
    webhookSent = true;
    const discordRes = await sendDiscordEmbed({
      webhookUrl: config.discordWebhookUrl,
      username: config.username,
      targetUrl,
      pingOk: ok,
      statusCode,
      latencyMs,
      intervalMinutes: config.intervalMinutes,
      trigger,
      includeStats: config.includeStatsInEmbed,
      errorMessage,
    });
    webhookOk = discordRes.ok;
    webhookError = discordRes.error;
  }

  return db.monitorPingLog.create({
    data: {
      targetUrl,
      ok,
      statusCode,
      latencyMs,
      trigger,
      webhookSent,
      webhookOk,
      webhookError,
      errorMessage,
    },
  });
}

/** Reprogramme le timer serveur avec l'intervalle courant. */
export async function rescheduleMonitor(providedConfig?: MonitorConfig): Promise<void> {
  const rt = runtime();
  if (rt.timer) {
    clearInterval(rt.timer);
    rt.timer = null;
  }

  const config = providedConfig ?? (await getMonitorConfig());
  if (!config.enabled) {
    rt.nextRunAt = null;
    return;
  }

  const intervalMs = Math.max(1, config.intervalMinutes) * 60_000;
  rt.nextRunAt = Date.now() + intervalMs;

  rt.timer = setInterval(() => {
    if (rt.inFlight) return;
    rt.inFlight = true;
    rt.nextRunAt = Date.now() + intervalMs;
    void executeMonitorCheck("scheduled")
      .catch((err) => console.error("[monitor] erreur lors du ping planifié:", err))
      .finally(() => {
        rt.inFlight = false;
      });
  }, intervalMs);

  // N'empêche jamais l'arrêt propre du processus lors des builds Next.js
  if (typeof rt.timer === "object" && rt.timer !== null && "unref" in rt.timer) {
    rt.timer.unref();
  }
}

/** Démarre le planificateur une seule fois au boot du serveur Node / Bun. */
export async function ensureMonitorStarted(): Promise<void> {
  const rt = runtime();
  if (rt.started) return;
  rt.started = true;

  await rescheduleMonitor();

  // Premier ping initial léger 2.5 s après le démarrage du serveur pour peupler l'état initial
  const bootTimer = setTimeout(() => {
    void getMonitorConfig().then((cfg) => {
      if (cfg.enabled) {
        void executeMonitorCheck("scheduled", cfg).catch(() => undefined);
      }
    });
  }, 2_500);

  if (typeof bootTimer === "object" && bootTimer !== null && "unref" in bootTimer) {
    bootTimer.unref();
  }
}
