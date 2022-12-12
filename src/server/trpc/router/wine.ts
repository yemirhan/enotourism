import { WineTypes } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";


export const wineRouter = router({

  getWines: protectedProcedure.query(async ({ ctx }) => {
    const wines = await ctx.prisma.wine.findMany({
      where: {
        Winery: {
          owner: {
            id: ctx.session.user.id
          }
        }
      },
      
    });
    return wines;
  }),

})