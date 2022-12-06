import { StatusType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";


export const statusRoutes = router({
  updateStatus: protectedProcedure.input(z.object({
    id: z.string(),
    status: z.nativeEnum(StatusType),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.session.user.user_type !== "GUIDE") {
      return new TRPCError({
        code: "FORBIDDEN",
        message: "You are not allowed to do this",
        cause: "You are not a taster",
      })
    }
    return await ctx.prisma.reservation.update({
      where: {
        id: input.id,
      },
      data: {
        status: {
          update: {
            status: input.status,
          }
        }
      }
    });
  })
})