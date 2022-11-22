import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const wineriesRouter = router({
  getWineries: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.winery.findMany();
    })
});
