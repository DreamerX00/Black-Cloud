import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Give your project a name")
    .max(80, "Keep it under 80 characters"),
  description: z.string().max(280, "Keep it under 280 characters").optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const renameProjectSchema = z.object({
  name: z.string().min(1).max(80),
});
export type RenameProjectInput = z.infer<typeof renameProjectSchema>;
