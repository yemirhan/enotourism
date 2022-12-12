import { OfferTypeEnum } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
const createOfferInputs = z.object({
  name: z.string(),
  date: z.date(),
  startsAt: z.date(),
  duration: z.number(),
  adult_price: z.number(),
  kid_price: z.number(),
  kids_allowed: z.boolean(),
  max_number_of_people: z.number(),
  wineryId: z.string(),
  description: z.string(),
  photos: z.array(z.string()),
  offerType: z.nativeEnum(OfferTypeEnum),
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
        price: 0,
        max_number_of_people: input.max_number_of_people,
        offer_types: {
          create: {
            name: input.offerType,
          }
        },
        photos: {
          createMany: {
            data: [...input.photos].map(photo => ({
              url: photo
            }))
          }
        },
        OfferTimeSlot: {
          create: {
            startTime: input.startsAt,
            endTime: new Date(),
            startDate: input.date,
            endDate: new Date(),
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