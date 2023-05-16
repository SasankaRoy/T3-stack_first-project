import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const registerRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const ifUserExists = await ctx.prisma.user.findUnique({
          where: { email: input.email },
        });
        if (ifUserExists) {
          return {
            error: "User already exists",
          };
        } else {
          const data = await ctx.prisma.user.create({
            data: {
              name: input.name,
              email: input.email,
              password: input.password,
            },
          });
          return {
            user: data,
          };
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }),
});
