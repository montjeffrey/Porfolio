type TelemetryComponent = "visualizer" | "roi_calculator" | "alignment_toggle";
type TelemetryEvent = "open" | "interact" | "complete";

const SESSION_STORAGE_KEY = "mj.telemetry.session";
const DEBOUNCE_MS = 500;

let cachedSessionHash: string | null = null;
const lastSentAt = new Map<string, number>();

function getSessionHash(): string {
  if (cachedSessionHash) return cachedSessionHash;

  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      cachedSessionHash = existing;
      return existing;
    }
    const fresh = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
    cachedSessionHash = fresh;
    return fresh;
  } catch {
    cachedSessionHash = crypto.randomUUID();
    return cachedSessionHash;
  }
}

export function track(component: TelemetryComponent, event: TelemetryEvent): void {
  if (typeof window === "undefined") return;

  try {
    const dedupeKey = `${component}:${event}`;
    const now = Date.now();
    const last = lastSentAt.get(dedupeKey);
    if (last !== undefined && now - last < DEBOUNCE_MS) return;
    lastSentAt.set(dedupeKey, now);

    const sessionHash = getSessionHash();
    const payload = JSON.stringify({ component, event, sessionHash });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/telemetry", blob);
      if (sent) return;
    }

    fetch("/api/telemetry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Telemetry must never throw.
  }
}
