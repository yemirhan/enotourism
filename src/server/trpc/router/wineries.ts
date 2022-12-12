import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const wineriesRouter = router({
  getWineries: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.winery.findMany({
        include: {
          address: {
            select: {
              country: true,
            }
          },
          photos: {
            select: {
              url: true,
            }
          }
        }
      });
    }),
  searchWineries: publicProcedure.input(z.object({
    name: z.string(),
    countryId: z.string().optional(),
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.winery.findMany({
      where: {
        AND: [
          {
            name: {
              contains: input.name,
            }
          },
          input.countryId ? {
            address: { country: { id: input.countryId } }
          }
            : {}

        ]

      },
      include: {
        address: {
          select: {
            country: {
              select: {
                name: true,
                image: true,
              }
            },
          }
        },
        photos: {
          select: {
            url: true,
          }
        }
      }
    });
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
          awards: true,
          email: true,
          history: true,
          language: true,
          _count: {
            select: {
              Wine: true,
            }
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone_number: true,
              about: true,
            }
          },
          address: {
            select: {
              address: true,
              country: {
                select: {
                  name: true,
                  image: true,
                  emoji: true,
                }
              },
            }
          },
          Wine: {
            select: {
              id: true,
              name: true,
              color: true,
              taste: true,
              brief_description: true,
              texture: true,
            },

          },
          photos: {
            select: {
              url: true,
            }
          }
        },

      })
    }),

});
