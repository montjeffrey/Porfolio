"use client";

import { useRoiStore } from "@/lib/roi/store";
import {
  AUTOMATION_CAPTURE_RATE,
  IMPLEMENTATION_COST,
  REWORK_MINUTES_MULTIPLIER,
} from "@/lib/roi/types";

function fmt1(value: number): string {
  return value.toFixed(1);
}

export default function ShowTheMath() {
  const { inputs, outputs } = useRoiStore((state) => state);
  const {
    technicians,
    jobsPerTechPerDay,
    adminMinutesPerJob,
    doubleEntryRate,
    errorReworkRate,
    loadedHourlyCost,
    workingDaysPerYear,
  } = inputs;

  const doubleEntryHours = outputs.adminHoursPerYear * doubleEntryRate;
  const reworkHours =
    (technicians *
      jobsPerTechPerDay *
      workingDaysPerYear *
      errorReworkRate *
      (adminMinutesPerJob * REWORK_MINUTES_MULTIPLIER)) /
    60;

  const lines = [
    `admin hours = ${technicians} tech × ${jobsPerTechPerDay} jobs × ${adminMinutesPerJob} min / 60 × ${workingDaysPerYear} days = ${fmt1(outputs.adminHoursPerYear)} h`,
    `double-entry hours = ${fmt1(outputs.adminHoursPerYear)} h × ${doubleEntryRate} = ${fmt1(doubleEntryHours)} h`,
    `rework hours = ${technicians} tech × ${jobsPerTechPerDay} jobs × ${workingDaysPerYear} days × ${errorReworkRate} × (${adminMinutesPerJob} min × ${REWORK_MINUTES_MULTIPLIER}) / 60 = ${fmt1(reworkHours)} h`,
    `recoverable hours = (${fmt1(doubleEntryHours)} h + ${fmt1(reworkHours)} h) × ${AUTOMATION_CAPTURE_RATE} = ${fmt1(outputs.recoverableHoursPerYear)} h`,
    `gross savings = ${fmt1(outputs.recoverableHoursPerYear)} h × $${loadedHourlyCost} = $${fmt1(outputs.grossAnnualSavings)}`,
    `net savings = $${fmt1(outputs.grossAnnualSavings)} - $${IMPLEMENTATION_COST} = $${fmt1(outputs.netAnnualSavings)}`,
    `payback = $${IMPLEMENTATION_COST} / ($${fmt1(outputs.grossAnnualSavings)} / 12) = ${outputs.paybackMonths === Infinity ? "∞" : `${fmt1(outputs.paybackMonths)} mo`}`,
  ];

  return (
    <details className="mt-6">
      <summary className="cursor-pointer text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
        Show the math
      </summary>
      <pre className="font-mono text-sm text-[var(--text-primary)] whitespace-pre-wrap mt-3 leading-relaxed">
        {lines.join("\n")}
      </pre>
    </details>
  );
}
