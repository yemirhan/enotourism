import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const wineriesRouter = router({
  getWineries: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.winery.findMany();
    }),
  getWineryById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.winery.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone_number: true,
              about: true,
            }
          }
        }
      })
    }),

});
