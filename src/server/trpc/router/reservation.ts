
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import crypto from "crypto"
import { TRPCError } from "@trpc/server";
export const reservationRoutes = router({
  getReservationsOfUser: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.user_type === "TASTER") {
      const reservations = await ctx.prisma.reservation.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {

          offer: {
            include: {
              Tour: {
                select: {
                  name: true,
                  id: true,

                }
              },
              offer_types: true,
              OfferTimeSlot: {
                select: {
                  startDate: true,
                  endDate: true,
                  id: true,
                }
              },

            }
          },
          status: {
            select: {
              status: true,
            }
          },
        }
      });
      return reservations;
    }
    else {
      return new TRPCError({
        code: "FORBIDDEN",
        message: "You are not allowed to do this",
        cause: "You are not a taster",
      })
    }
  }),
  getReservationsOfTourGuide: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.user_type === "GUIDE") {
      const reservations = await ctx.prisma.reservation.findMany({
        where: {
          offer: {
            Tour: {
              some: {
                tourGuideId: ctx.session.user.id
              }
            }
          }
        },
        include: {
          user: {
            select: {
              name: true,
              id: true,
              photo: true,
              email: true
            }
          },
          offer: {
            include: {
              offer_types: true,
              Tour: {
                select: {
                  name: true
                }
              },
              OfferTimeSlot: {
                select: {
                  startDate: true,
                  endDate: true,
                  id: true,
                }
              },

            }
          },
          status: {
            select: {
              id: true,
              status: true,
            }
          },
        }
      });
      return reservations;
    }
  }),
  // getReservationsOfWinery: protectedProcedure.input(z.object({
  //   wineryIds: z.array(z.string())
  // })).query(async ({ctx, input}) => {
  //   return ctx.prisma.reservation.findMany({
  //     where: {
        
  //     }
  //   })
  // })

  reserve: protectedProcedure.input(z.object({
    tourId: z.string(),
    date: z.date(),
    offerId: z.string(),
    number_of_people: z.number(),
    number_of_kids: z.number(),
    from_time: z.number(),
    to_time: z.number(),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.session.user.user_type !== "TASTER") {
      return new TRPCError({
        code: "FORBIDDEN",
        message: "You are not allowed to do this",
        cause: "You are not a taster",
      })
    }
    return await ctx.prisma.reservation.create({
      data: {
        user: {
          connect: {
            id: ctx.session.user.id,
          }
        },
        offer: {
          connect: {
            id: input.offerId,
          }
        },
        slug: crypto.randomUUID(),
        number_of_kids: input.number_of_kids,
        date: input.date,
        status: {
          create: {
            status: "PENDING"
          }
        },
        from_time: input.from_time,
        to_time: input.to_time,

        number_of_people: input.number_of_people,
      }
    });

  })
})