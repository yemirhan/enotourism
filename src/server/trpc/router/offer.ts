import { OfferTypeEnum } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
const createOfferInputs = z.object({
  adult_price: z.number(),
  description: z.string(),
  duration: z.number(),
  kid_price: z.number(),
  name: z.string(),
  price: z.number(),
  max_number_of_people: z.number(),
  wineryId: z.string(),
  offerTypes: z.array(z.nativeEnum(OfferTypeEnum)),
  startDate: z.date(),
  endDate: z.date(),
})
export type CreateOfferInputs = z.infer<typeof createOfferInputs>;
export const offerRoutes = router({
  createOffer: protectedProcedure.input(createOfferInputs).mutation(async ({ input, ctx }) => {

    const offer = await ctx.prisma.offer.create({
      data: {
        adult_price: input.adult_price,
        description: input.description,
        duration: input.duration,
        kid_price: input.kid_price,
        name: input.name,
        price: input.price,
        max_number_of_people: input.max_number_of_people,
        offer_types: {
          createMany: {
            data: input.offerTypes.map((type) => ({
              name: type,
            })),
          }
        },
        OfferTimeSlot: {
          create: {
            startDate: input.startDate,
            endDate: input.endDate,
          }
        },
        winery: {
          connect: {
            id: input.wineryId,
          }
        }
      },
    });

    return offer;
  }),
  getWineryOffers: protectedProcedure.input(z.object({
    wineryId: z.string(),
  })).query(async ({ input, ctx }) => {
    const offers = await ctx.prisma.offer.findMany({
      where: {
        wineryId: input.wineryId,
      },
      include: {
        OfferTimeSlot: true,
        offer_types: true,
      },
    });

    return offers;
  }),

})