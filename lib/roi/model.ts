import {
  AUTOMATION_CAPTURE_RATE,
  IMPLEMENTATION_COST,
  REWORK_MINUTES_MULTIPLIER,
  type RoiInputs,
  type RoiOutputs,
} from "./types";

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function computeRoi(inputs: RoiInputs): RoiOutputs {
  const {
    technicians,
    jobsPerTechPerDay,
    adminMinutesPerJob,
    doubleEntryRate,
    errorReworkRate,
    loadedHourlyCost,
    workingDaysPerYear,
  } = inputs;

  const adminHoursPerYear =
    (technicians * jobsPerTechPerDay * adminMinutesPerJob) / 60 * workingDaysPerYear;

  const doubleEntryHours = adminHoursPerYear * doubleEntryRate;

  const reworkHours =
    (technicians *
      jobsPerTechPerDay *
      workingDaysPerYear *
      errorReworkRate *
      (adminMinutesPerJob * REWORK_MINUTES_MULTIPLIER)) /
    60;

  const recoverableHours = (doubleEntryHours + reworkHours) * AUTOMATION_CAPTURE_RATE;
  const grossAnnualSavings = recoverableHours * loadedHourlyCost;
  const netAnnualSavings = grossAnnualSavings - IMPLEMENTATION_COST;
  const paybackMonths =
    grossAnnualSavings <= 0 ? Infinity : IMPLEMENTATION_COST / (grossAnnualSavings / 12);

  return {
    adminHoursPerYear: round1(adminHoursPerYear),
    recoverableHoursPerYear: round1(recoverableHours),
    grossAnnualSavings: round1(grossAnnualSavings),
    netAnnualSavings: round1(netAnnualSavings),
    paybackMonths: paybackMonths === Infinity ? Infinity : round1(paybackMonths),
  };
}
