import { WineTypes } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";


export const wineRouter = router({
  createWine: protectedProcedure.input(z.object({
    name: z.string(),
    brief_description: z.string(),
    wine_type: z.object({
      color: z.string(),
      grapes: z.string(),
      name: z.string(),
      taste: z.string(),
      texture: z.nativeEnum(WineTypes),
    })
  })).mutation(async ({ input, ctx }) => {
    const wine = await ctx.prisma.wine.create({
      data: {
        name: input.name,
        brief_description: input.brief_description,
        wineryId: undefined,
        color: input.wine_type.color,
        taste: input.wine_type.taste,
        texture: input.wine_type.texture,


      },

    });
    return wine;
  }),
  getWines: protectedProcedure.query(async ({ ctx }) => {
    const wines = await ctx.prisma.wine.findMany({
      where: {
        
      }
    });
    return wines;
  }),

})