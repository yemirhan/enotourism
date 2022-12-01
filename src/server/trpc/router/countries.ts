import { publicProcedure, router } from "../trpc";

export const countryRouter = router({
  getCountries: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.country.findMany({});
  })
})