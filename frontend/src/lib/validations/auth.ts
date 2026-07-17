import { z } from "zod";

/**
 * Auth form schemas — the ONE source of truth for shape + client validation.
 * Reused by both the React Hook Form resolver AND the service layer, so a
 * shape drift crashes at type-check time, not at runtime.
 */

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(80),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a digit"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
export type ForgotInput = z.infer<typeof forgotSchema>;

/**
 * Email verify code — 6 digits, delivered by the transactional pipeline
 * (backend TODO). Client validates length + numeric.
 */
export const verifySchema = z.object({
  code: z
    .string()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d+$/, "Numbers only"),
});
export type VerifyInput = z.infer<typeof verifySchema>;
