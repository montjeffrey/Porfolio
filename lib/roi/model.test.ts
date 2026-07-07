import { describe, expect, it } from "vitest";
import { computeRoi } from "./model";
import { ROI_BOUNDS, ROI_DEFAULTS, type RoiInputs } from "./types";

describe("computeRoi", () => {
  it("computes default scenario with adminHoursPerYear 1500 and positive net savings", () => {
    const outputs = computeRoi(ROI_DEFAULTS);
    expect(outputs.adminHoursPerYear).toBe(1500);
    expect(outputs.netAnnualSavings).toBeGreaterThan(0);
  });

  it("produces negative net savings at minimum bounds", () => {
    const minInputs: RoiInputs = {
      technicians: ROI_BOUNDS.technicians.min,
      jobsPerTechPerDay: ROI_BOUNDS.jobsPerTechPerDay.min,
      adminMinutesPerJob: ROI_BOUNDS.adminMinutesPerJob.min,
      doubleEntryRate: ROI_BOUNDS.doubleEntryRate.min,
      errorReworkRate: ROI_BOUNDS.errorReworkRate.min,
      loadedHourlyCost: ROI_BOUNDS.loadedHourlyCost.min,
      workingDaysPerYear: ROI_BOUNDS.workingDaysPerYear.min,
    };
    const outputs = computeRoi(minInputs);
    expect(outputs.netAnnualSavings).toBeLessThan(0);
  });

  it("yields zero gross savings and infinite payback when rates are zero", () => {
    const outputs = computeRoi({ ...ROI_DEFAULTS, doubleEntryRate: 0, errorReworkRate: 0 });
    expect(outputs.grossAnnualSavings).toBe(0);
    expect(outputs.paybackMonths).toBe(Infinity);
  });
});
