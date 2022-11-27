import { createWinerySchema } from "@/validation/auth";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const userWineryRoutes = router({
  getWineriesOfUser: protectedProcedure
    .query(async ({ ctx }) => {
      const wineries = await ctx.prisma.winery.findMany({
        where: {
          owner: {
            id: {
              equals: ctx.session.user.id,
            }
          }
        }
      });
      return wineries;
    }),
  createWinery: protectedProcedure.input(createWinerySchema).mutation(async ({ input, ctx }) => {
    const winery = await ctx.prisma.winery.create({
      data: {
        awards: input.awards,
        description: input.description,
        userId: ctx.session.user.id,
        email: input.email,
        history: input.history,
        name: input.name,
        Wine: {
          createMany: {
            data: input.wines.map(wine => ({
              name: wine.name,
              brief_description: wine.brief_description,
              color: wine.wine_type.color,
              grapes: wine.wine_type.grapes,
              taste: wine.wine_type.taste,
              texture: wine.wine_type.texture,
            })),
          }
        }
      }
    });

    return winery;
  })
});
