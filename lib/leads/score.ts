import type { LeadInput } from "./schema";

function hasHighRoiSnapshot(roiSnapshot: unknown): boolean {
  if (typeof roiSnapshot !== "object" || roiSnapshot === null) return false;
  const outputs = (roiSnapshot as Record<string, unknown>).outputs;
  if (typeof outputs !== "object" || outputs === null) return false;
  const netAnnualSavings = (outputs as Record<string, unknown>).netAnnualSavings;
  return typeof netAnnualSavings === "number" && netAnnualSavings > 10000;
}

export function scoreLead(input: LeadInput): number {
  let score = 20;

  if (input.company && input.company.trim().length > 0) {
    score += 20;
  }

  if (input.message.length >= 200) {
    score += 20;
  } else if (input.message.length >= 80) {
    score += 10;
  }

  if (input.projectType === "Cloud Solutions" || input.projectType === "Consulting") {
    score += 20;
  }

  if (hasHighRoiSnapshot(input.roiSnapshot)) {
    score += 20;
  }

  return Math.min(score, 100);
}
