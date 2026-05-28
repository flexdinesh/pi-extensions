import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const GRACE_PERIOD_MS = 10000; // 10 seconds
const SECOND_MS = 1000;

export default function sessionTimerExtension(pi: ExtensionAPI): void {
  let elapsedMs = 0;
  let activeStartAt: number | undefined;
  let updateInterval: ReturnType<typeof setInterval> | undefined;
  let idleTimeout: ReturnType<typeof setTimeout> | undefined;
  let uiRef: ExtensionContext["ui"] | undefined;

  function getElapsed(now = Date.now()): number {
    return elapsedMs + (activeStartAt ? Math.max(0, now - activeStartAt) : 0);
  }

  function formatElapsed(ms: number): string {
    const totalSeconds = Math.floor(Math.max(0, ms) / SECOND_MS);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");

    return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  function resume(now = Date.now()): void {
    if (idleTimeout) {
      clearTimeout(idleTimeout);
      idleTimeout = undefined;
    }
    if (!activeStartAt) {
      activeStartAt = now;
    }
  }

  function pause(now = Date.now()): void {
    if (activeStartAt) {
      elapsedMs += Math.max(0, now - activeStartAt);
      activeStartAt = undefined;
    }
  }

  function startIdleTimer(): void {
    if (idleTimeout) {
      clearTimeout(idleTimeout);
    }
    idleTimeout = setTimeout(() => {
      pause();
      updateDisplay();
    }, GRACE_PERIOD_MS);
  }

  function updateDisplay(): void {
    if (!uiRef) return;
    const now = Date.now();
    const elapsed = getElapsed(now);
    const formatted = formatElapsed(elapsed);
    const isRunning = activeStartAt !== undefined;
    const theme = uiRef.theme;
    const color = isRunning
      ? theme.fg("accent", formatted)
      : theme.fg("dim", formatted);
    uiRef.setStatus("session-timer", color);
  }

  function clearAll(): void {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = undefined;
    }
    if (idleTimeout) {
      clearTimeout(idleTimeout);
      idleTimeout = undefined;
    }
    pause();
    uiRef = undefined;
    elapsedMs = 0;
    activeStartAt = undefined;
  }

  pi.on("session_start", async (_event, ctx) => {
    clearAll();
    uiRef = ctx.ui;
    activeStartAt = Date.now();
    updateInterval = setInterval(() => updateDisplay(), SECOND_MS);
    updateDisplay();
  });

  pi.on("agent_start", async () => resume());
  pi.on("input", async () => resume());
  pi.on("user_bash", async () => resume());

  pi.on("agent_end", async () => {
    if (activeStartAt) startIdleTimer();
  });

  pi.on("session_shutdown", async () => {
    clearAll();
  });
}
