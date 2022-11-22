import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const guideRouter = router({
    getGuides: publicProcedure
        .query(async ({ ctx }) => {
            const guides = await ctx.prisma.user.findMany({
                where: {
                    user_type: "GUIDE",
                }
            });
            return guides;
        })
});
