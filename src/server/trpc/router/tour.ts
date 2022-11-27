import { z } from 'zod';
import { router, publicProcedure } from './../trpc';


export const tourRouter = router({
  getTours: publicProcedure.query(async ({ ctx }) => {
    const tours = await ctx.prisma.tour.findMany({});
    return tours;
  }),
  getTourById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const tour = await ctx.prisma.tour.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          number_of_people: true,
          tour_guide: {
            select: {
              id: true,
              name: true,
              email: true,
              phone_number: true,
              about: true,
              gender: true,
              Tour: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  number_of_people: true,
                  Winery: {
                    select: {
                      id: true,
                      name: true,
                      Wine: {
                        select: {
                          id: true,
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
      return tour;
    }),
  searchTours: publicProcedure
    .input(z.object({
      name: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const tours = await ctx.prisma.tour.findMany({
        where: {
          name: {
            contains: input.name,
          }
        }
      });
      return tours;
    }),



})