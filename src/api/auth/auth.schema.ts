import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "First name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password is required"),
  }),
});

export default { registerSchema, loginSchema };
