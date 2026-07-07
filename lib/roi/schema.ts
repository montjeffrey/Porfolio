import { z } from "zod";
import { ROI_BOUNDS } from "./types";

export const roiInputsSchema = z.object({
  technicians: z
    .number()
    .int()
    .min(ROI_BOUNDS.technicians.min)
    .max(ROI_BOUNDS.technicians.max),
  jobsPerTechPerDay: z
    .number()
    .int()
    .min(ROI_BOUNDS.jobsPerTechPerDay.min)
    .max(ROI_BOUNDS.jobsPerTechPerDay.max),
  adminMinutesPerJob: z
    .number()
    .int()
    .min(ROI_BOUNDS.adminMinutesPerJob.min)
    .max(ROI_BOUNDS.adminMinutesPerJob.max),
  doubleEntryRate: z
    .number()
    .min(ROI_BOUNDS.doubleEntryRate.min)
    .max(ROI_BOUNDS.doubleEntryRate.max),
  errorReworkRate: z
    .number()
    .min(ROI_BOUNDS.errorReworkRate.min)
    .max(ROI_BOUNDS.errorReworkRate.max),
  loadedHourlyCost: z
    .number()
    .min(ROI_BOUNDS.loadedHourlyCost.min)
    .max(ROI_BOUNDS.loadedHourlyCost.max),
  workingDaysPerYear: z
    .number()
    .int()
    .min(ROI_BOUNDS.workingDaysPerYear.min)
    .max(ROI_BOUNDS.workingDaysPerYear.max),
});
