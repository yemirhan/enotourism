import { z } from "zod";
import { protectedProcedure, router } from "../trpc";


const wineRouter = router({
  createWine: protectedProcedure.input(z.object({
    name: z.string(),
    description: z.string(),
    wineryId: z.string(),
  })).mutation(async ({ input, ctx }) => {
    const wine = await ctx.prisma.wine.create({
      data: {
        name: input.name,
        brief_description: input.description,
        wineryId: input.wineryId,
        wineTypeId: "1",
      }
    });
    return wine;
  })
})