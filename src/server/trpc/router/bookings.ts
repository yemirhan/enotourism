import { protectedProcedure } from './../trpc';
import { router } from "../trpc";
import { z } from 'zod';


export const bookingRoutes = router({
  getBookingsOfUser: protectedProcedure
    .query(async ({ ctx }) => {
      const bookings = await ctx.prisma.reservation.findMany({
        where: {
          userId: ctx.session.user.id,
        }
      });
      return bookings;
    }
    ),
  getBookingsOfTourGuide: protectedProcedure
    .query(async ({ ctx }) => {
      const bookings = await ctx.prisma.reservation.findMany({
        where: {

        }
      });
      return bookings;
    }),

  createBooking: protectedProcedure
    .input(z.object({
      tourId: z.string(),
      date: z.string(),
      from_time: z.number(),
      to_time: z.number(),
      number_of_people: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const booking = await ctx.prisma.reservation.create({
        data: {
          date: input.date,
          from_time: input.from_time,
          number_of_people: input.number_of_people,

          number_of_kids: 0,
          to_time: input.to_time,
          slug: "test",
          statusId: "1",
          userId: ctx.session.user.id,
        }
      });
      return booking;
    })
})