import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const Article = createTRPCRouter({
  // get all articles of the logg in user...

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const findUser = await ctx.prisma.user.findUnique({
      where: {
        // @ts-ignore
        email: ctx.session.user.email,
      },
    });

    const getArticle = await ctx.prisma.article.findMany();

    return getArticle;
  }),

  // create new article start...
  newArticle: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        title: z.string(),
        dec: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const createNew = await ctx.prisma.article.create({
          data: {
            title: input.title,
            content: input.dec,
            user: {
              connect: {
                // @ts-ignore
                email: ctx.session.user.email,
              },
            },
          },
        });
        if (createNew) {
          return {
            success: "article created successfully",
          };
        } else {
          return {
            error: "article not created",
          };
        }
      } catch (error) {
        throw new Error("error");
      }
    }),

  // ....create new article start

  // edit Article start...

  editArticle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        dec: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const findUser = await ctx.prisma.user.findUnique({
          where: {
            // @ts-ignore
            email: ctx.session.user.email,
          },
        });
        const findArticle = await ctx.prisma.article.findUnique({
          where: {
            id: input.id,
          },
        });

        if (findUser?.id === findArticle?.userId) {
          const editArticle = await ctx.prisma.article.update({
            data: {
              title: input.title,
              content: input.dec,
            },
            where: {
              id: input.id,
            },
          });
          if (editArticle) {
            return {
              success: "article edited successfully",
            };
          } else {
            return {
              error: "article not edited",
            };
          }
        } else {
          return {
            error: 'you can"t edit other articles!',
          };
        }
      } catch (err) {
        return {
          error: err,
        };
      }
    }),

  // .... edit Article start

  // .... delete a article start...

  deleteArticle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const findUser = await ctx.prisma.user.findUnique({
          where: {
            // @ts-ignore
            email: ctx.session.user.email,
          },
        });
        const findArticle = await ctx.prisma.article.findUnique({
          where: {
            id: input.id,
          },
        });
        if (findUser?.id === findArticle?.userId) {
          const findArticleAndDelete = await ctx.prisma.article.delete({
            where: {
              id: input.id,
            },
          });
          if (findArticleAndDelete) {
            return {
              success: "article deleted successfully",
            };
          } else {
            return {
              error: "article not deleted",
            };
          }
        } else {
          return {
            error: 'you can"t delete other articles!',
          };
        }
      } catch (error) {
        return {
          error,
        };
      }
    }),

  // .... delete a article end
});
