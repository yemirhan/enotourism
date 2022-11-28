import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const guideRouter = router({
    getGuides: publicProcedure
        .query(async ({ ctx }) => {
            const guides = await ctx.prisma.user.findMany({
                where: {
                    user_type: "GUIDE",
                },
                select: {
                    id: true,
                    about: true,
                    email: true,
                    name: true,
                    user_type: true,
                    surname: true,
                    photo: true,
                    address: {
                        select: {
                            address: true,
                            city: true,
                            country: true,
                            street: true,

                        }
                    }
                },

            });
            return guides;
        }),
    getTourGuideById: publicProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        const guide = await ctx.prisma.user.findUnique({
            where: {
                id: input.id
            },
            select: {
                id: true,
                about: true,
                email: true,
                name: true,
                user_type: true,
                surname: true,
                photo: true,
                address: {
                    select: {
                        address: true,
                        city: true,
                        country: true,
                        street: true,

                    }
                },
                Tour: {
                    select: {
                        description: true,
                        name: true,
                        number_of_people: true,
                        id: true,
                    }
                }
            },

        });
        return guide;
    }),
});
