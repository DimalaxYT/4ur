export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { ensureMonitorStarted } = await import("@/lib/monitor");
    await ensureMonitorStarted();
  }
}
