import { z } from 'zod';
import { router, publicProcedure } from './../trpc';


export const tourRouter = router({
  getTours: publicProcedure.query(async ({ ctx }) => {
    const tours = await ctx.prisma.tour.findMany({
      include: {
        Winery: {
          include: {
            country: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });
    return tours;
  }),
  searchTours: publicProcedure.input(z.object({
    name: z.string(),
    countryId: z.array(z.string()),
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.tour.findMany({
      where: {
        AND: [
          {
            name: {
              contains: input.name,
            }
          },
          input.countryId.length > 0 ? {
            Winery: {
              countryId: {
                in: input.countryId
              }
            }
          } : {}
        ]
      },
      include: {
        Winery: {
          include: {
            country: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });
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
})