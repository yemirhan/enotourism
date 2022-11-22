import { UpdateProfile } from './../../../pages/dashboard/profile';
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from 'zod';
import { Gender } from '@prisma/client';

export const profileRouter = router({
  // getSession: publicProcedure.query(({ ctx }) => {
  //   return ctx.session;
  // }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      },
      select: {
        name: true,
        surname: true,
        address: true,
        about: true,
        gender: true,
        user_type: true,
        photo: true,
        id: true,
        email: true,
        phone_number: true,
      }
    })
  }),
  updateProfile: protectedProcedure.input(z.object({
    name: z.string(),
    surname: z.string().optional(),
    gender: z.nativeEnum(Gender),
    phone_number: z.string().optional(),
    photo: z.string().optional(),
    about: z.string().optional()
  })).mutation(async ({ input, ctx }) => {
    const updatedProfile = await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id
      },
      data: {
        ...input
      },
      select: {
        name: true,
        surname: true,
        address: true,
        about: true,
        gender: true,
        user_type: true,
        photo: true,
        id: true,
        email: true,
      }
    })
    return updatedProfile
  })

});
