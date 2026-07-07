const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const requestLog = new Map<string, number[]>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  const timestamps = (requestLog.get(key) ?? []).filter((ts) => ts > cutoff);

  if (timestamps.length >= MAX_REQUESTS) {
    requestLog.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return true;
}
