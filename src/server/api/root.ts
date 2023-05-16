import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { registerRouter } from "./routers/register";
import { Article } from "./routers/Article";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  registerUser: registerRouter,
  newArticle: Article,
});

// export type definition of API
export type AppRouter = typeof appRouter;
