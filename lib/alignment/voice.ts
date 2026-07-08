export type Voice = "operator" | "boardroom" | "studio";

export const VOICE_COPY: Record<string, Record<Voice, string>> = {
  "hero.headline": {
    operator: "I build the systems your spreadsheets are pretending to be.",
    boardroom: "Operational software that returns hours to the P&L.",
    studio: "Precision-built platforms, finished like products.",
  },
  "hero.sub": {
    operator:
      "Custom CRM fabrics, automation pipelines, and operational dashboards — engineered, not assembled.",
    boardroom:
      "Purpose-built systems that eliminate double entry and reclaim payroll hours.",
    studio:
      "Software with the fit and finish of a shipped product — because it is one.",
  },
  "cta.bottom": {
    operator: "Bring me the bottleneck. I'll bring back the hours.",
    boardroom: "Book a systems consultation.",
    studio: "Let's build the version you actually wanted.",
  },
};

export function getCopy(key: string, voice: Voice): string {
  const entry = VOICE_COPY[key];
  if (!entry) return key;
  return entry[voice] ?? entry.operator ?? key;
}
