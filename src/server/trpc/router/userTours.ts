import { OfferTypeEnum } from "@prisma/client";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const createTourInput = z.object({
  name: z.string(),
  description: z.string(),
  number_of_people: z.number(),
  offerTypes: z.array(z.nativeEnum(OfferTypeEnum)),
  wineryId: z.string(),
  price: z.number(),
  adult_price: z.number(),
  offer_description: z.string(),
  duration: z.number(),
  kid_price: z.number(),
  offer_name: z.string(),
  max_number_of_people: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  start_hour: z.number(),
  end_hour: z.number(),

})
export type CreateTourInput = z.infer<typeof createTourInput>

export const userToursRoutes = router({
  getToursOfUser: protectedProcedure
    .query(async ({ ctx }) => {
      const wineries = await ctx.prisma.winery.findMany({
        where: {
          owner: {
            id: {
              equals: ctx.session.user.id,
            }
          }
        },
        select: {
          id: true,
        }
      });
      const tours = await ctx.prisma.tour.findMany({
        where: {
          wineryId: {
            in: wineries.map(winery => winery.id)
          }
        }
      });
      return tours;
    }),
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
        number_of_people: input.number_of_people,
        offer: {
          create: {
            offer_types: {
              createMany: {
                data: [...input.offerTypes].map(offerType => ({
                  name: offerType
                }))
              },
            },
            OfferTimeSlot: {
              create: {
                startDate: input.startDate,
                endDate: input.endDate,
                
              }
            },
            price: input.price,
            adult_price: input.adult_price,
            description: input.offer_description,
            duration: input.duration,
            kid_price: input.kid_price,
            name: input.offer_name,
            max_number_of_people: input.max_number_of_people,
            winery: {
              connect: {
                id: input.wineryId,
              }
            }
          },
        },

        Winery: {
          connect: {
            id: input.wineryId,
          }
        }
      },

    });
    return tour;
  })
});
