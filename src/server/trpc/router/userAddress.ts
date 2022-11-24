import { addressSchema } from './../../../validation/address';
import { protectedProcedure, router } from "../trpc";

export const addressRoutes = router({
  createOrUpdateAddress: protectedProcedure.input(addressSchema).mutation(async ({ input, ctx }) => {
    const address = await ctx.prisma.address.upsert({
      where: {
        user_id: ctx.session.user.id,
      },
      update: {
        ...input
      },
      create: {
        ...input,
        user_id: ctx.session.user.id,
      }
    });
    return address;
  }),
  getAddress: protectedProcedure.query(async ({ ctx }) => {
    const address = await ctx.prisma.address.findFirst({
      where: {
        user_id: ctx.session.user.id,
      },
      select: {
        street: true,
        city: true,
        flat: true,
        address: true,
        is_contact_address: true,
        postcode: true,
        country: true,
      }
    });
    return address;
  })

})