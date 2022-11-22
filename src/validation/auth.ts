import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const registerSchema = loginSchema.extend({
  name: z.string(),
  user_type: z.enum(["WINERY", "TASTER", "GUIDE"]),
});

export const createWinerySchema = z.object({
  name: z.string(),
  description: z.string(),
  email: z.string(),
  history: z.string(),
  awards: z.string()
})
export type ILogin = z.infer<typeof loginSchema>;
export type IRegister = z.infer<typeof registerSchema>;
export type ICreateWinery = z.infer<typeof createWinerySchema>;

export type UserType = "WINERY" | "TASTER" | "GUIDE"
export type UserGender = "MALE" | "FEMALE" | "OTHER"