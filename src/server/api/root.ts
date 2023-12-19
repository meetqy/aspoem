import { createTRPCRouter } from "~/server/api/trpc";
import { promptRouter } from "./routers/prompt";
import { tagRouter } from "./routers/tag";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  prompt: promptRouter,
  tag: tagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
