import { createWinerySchema } from "@/validation/auth";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

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
});
