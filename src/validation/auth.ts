import { WineNameList, WineTypes } from "@prisma/client";
import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const registerSchema = loginSchema.extend({
  name: z.string(),
  user_type: z.enum(["WINERY", "TASTER", "GUIDE"]),
});
const wines = z.object({
  name: z.string(),
  brief_description: z.string(),

  wine_type: z.object({
    color: z.string(),
    name: z.string(),
    type: z.nativeEnum(WineNameList),
    taste: z.string(),
    texture: z.nativeEnum(WineTypes),
  })
})
export const createWinerySchema = z.object({
  photos: z.array(z.string()),
  name: z.string(),
  countryId: z.string(),
  description: z.string(),
  email: z.string(),
  history: z.string(),
  awards: z.string(),
  wines: z.array(wines),
  address: z.object({
    countryId: z.string(),
    regionId: z.string(),
    city: z.string(),

    street: z.string(),
    flat: z.string(),
  }),
  workingHours: z.array(z.object({
    close: z.date(),
    day: z.date(),
    open: z.date()
  }))
})
export type ILogin = z.infer<typeof loginSchema>;
export type IRegister = z.infer<typeof registerSchema>;
export type ICreateWinery = z.infer<typeof createWinerySchema>;
export type IWine = z.infer<typeof wines>;

export type UserType = "WINERY" | "TASTER" | "GUIDE"
export type UserGender = "MALE" | "FEMALE" | "OTHER"