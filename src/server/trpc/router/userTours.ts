import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

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
        userId: ctx.session.user.id,
      }
    });
    return tours;
  }),
  createTour: protectedProcedure.input(z.object({
    name: z.string(),
    description: z.string(),
    number_of_people: z.number(),
  })).mutation(async ({ input, ctx }) => {
    const tour = await ctx.prisma.tour.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      }
    });
    return tour;
  })
});
