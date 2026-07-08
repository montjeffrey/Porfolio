export interface RoiInputs {
  technicians: number; jobsPerTechPerDay: number; adminMinutesPerJob: number;
  doubleEntryRate: number; errorReworkRate: number; loadedHourlyCost: number;
  workingDaysPerYear: number;
}
export interface RoiOutputs {
  adminHoursPerYear: number; recoverableHoursPerYear: number;
  grossAnnualSavings: number; netAnnualSavings: number; paybackMonths: number;
}
export const ROI_DEFAULTS: RoiInputs = { technicians: 6, jobsPerTechPerDay: 5, adminMinutesPerJob: 12, doubleEntryRate: 0.35, errorReworkRate: 0.06, loadedHourlyCost: 42, workingDaysPerYear: 250 };
export const ROI_BOUNDS = {
  technicians: { min: 1, max: 200, step: 1 },
  jobsPerTechPerDay: { min: 1, max: 30, step: 1 },
  adminMinutesPerJob: { min: 2, max: 60, step: 1 },
  doubleEntryRate: { min: 0, max: 1, step: 0.05 },
  errorReworkRate: { min: 0, max: 0.5, step: 0.01 },
  loadedHourlyCost: { min: 15, max: 150, step: 1 },
  workingDaysPerYear: { min: 200, max: 260, step: 5 },
} as const;
export const AUTOMATION_CAPTURE_RATE = 0.8;
export const REWORK_MINUTES_MULTIPLIER = 2.5;
export const IMPLEMENTATION_COST = 12000;
