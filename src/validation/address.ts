import z from "zod";
import { CountryListSchema } from "../../prisma/generated/schemas/enums/CountryList.schema";

export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  flat: z.string().optional().nullable(),
  address: z.string(),
  is_contact_address: z.boolean(),
  postcode: z.string().optional().nullable(),
  country: CountryListSchema.nullable(),
});



export type IAddress = z.infer<typeof addressSchema>;