import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(254),
  company: z.string().max(200).optional(),
  projectType: z
    .enum(["Web Development", "Cloud Solutions", "Data Analytics", "Consulting", "Other"])
    .optional(),
  message: z.string().trim().min(10).max(4000),
  preferredContact: z.enum(["Email", "Phone", "LinkedIn"]).default("Email"),
  roiSnapshot: z.unknown().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
