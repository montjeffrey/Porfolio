import { describe, expect, it } from "vitest";
import { scoreLead } from "./score";
import type { LeadInput } from "./schema";

describe("scoreLead", () => {
  it("scores a minimal lead as 20", () => {
    const input: LeadInput = {
      name: "Jo Smith",
      email: "jo@example.com",
      message: "Short message",
      preferredContact: "Email",
    };
    expect(scoreLead(input)).toBe(20);
  });

  it("scores a fully-loaded lead as 100", () => {
    const input: LeadInput = {
      name: "Jo Smith",
      email: "jo@example.com",
      company: "Acme Corp",
      projectType: "Consulting",
      message: "x".repeat(200),
      preferredContact: "Email",
      roiSnapshot: { outputs: { netAnnualSavings: 25000 } },
    };
    expect(scoreLead(input)).toBe(100);
  });

  it("scores a lead with a 100-char message and company as 50", () => {
    const input: LeadInput = {
      name: "Jo Smith",
      email: "jo@example.com",
      company: "Acme Corp",
      message: "x".repeat(100),
      preferredContact: "Email",
    };
    expect(scoreLead(input)).toBe(50);
  });
});
