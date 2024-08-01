import { z } from "zod";

const reqStr = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: reqStr.email("Invalid email Address"),
  username: reqStr.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters , Numbers , - and _ are alloweded",
  ),
  password: reqStr.min(8, "Must be atleast 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: reqStr,
  password: reqStr,
});

export type LoginValues = z.infer<typeof loginSchema>;
