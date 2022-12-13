import { OfferTypeEnum } from "@prisma/client";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const createTourInput = z.object({
  description: z.string(),
  name: z.string(),
  number_of_people: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.date(),
  selected_all_price: z.number(),
  adult_price: z.number(),
  kid_price: z.number(),
  photos: z.array(z.string()),
  wineryIds: z.array(z.string()),
  activities: z.array(z.nativeEnum(OfferTypeEnum)),
  address: z.object({
    city: z.string(),
    countryId: z.string(),
    street: z.string(),
    flat: z.string(),
  })
})
export type CreateTourInput = z.infer<typeof createTourInput>

export const userToursRoutes = router({

  getToursOfTourGuide: protectedProcedure.query(async ({ ctx }) => {
    const tours = await ctx.prisma.tour.findMany({
      where: {
        tourGuideId: ctx.session.user.id,
      }
    });
    return tours;
  }),
  createTour: protectedProcedure.input(createTourInput).mutation(async ({ input, ctx }) => {
    const tour = await ctx.prisma.tour.create({
      data: {
        tour_guide: {
          connect: {
            id: ctx.session.user.id,
          }
        },

        description: input.description,
        name: input.name,
        max_number_of_people: input.number_of_people,
        startDate: input.startDate,
        endDate: input.endDate,
        startTime: input.startTime,
        if_selected_all: input.selected_all_price,
        price_per_adult: input.adult_price,
        price_per_kid: input.kid_price,
        TourActivities: {
          createMany: {
            data: input.activities.map(activity => ({

              activity: activity
            }))
          }
        },
        address: {
          create: {
            address: "",
            city: input.address.city,
            country: {
              connect: {
                id: input.address.countryId
              }
            },
            street: input.address.street,
            flat: input.address.flat,
          }
        },
        photos: {
          createMany: {
            data: input.photos.map(photo => ({
              url: photo
            }))
          }
        },
        Winery: {
          connect: [
            ...input.wineryIds.map(wineryId => ({
              id: wineryId
            }))
          ]
        }
      },

    });
    return tour;
  })
});
