import { authRouter } from "./router/auth";
import { authorRouter } from "./router/author";
import { dynastyRouter } from "./router/dynasty";
import { poemDiscoverRouter, poemRouter } from "./router/poem";
import { protectedDynastyRouter } from "./router/protected/dynasty";
import { protectedPoemRouter } from "./router/protected/poem";
import { webhookRouter } from "./router/webhoook";
import { createCallerFactory, createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  poem: {
    ...poemDiscoverRouter,
    ...poemRouter,
  },
  dynasty: dynastyRouter,
  author: authorRouter,
  webhook: webhookRouter,
  protectedPoem: protectedPoemRouter,
  protectedDynasty: protectedDynastyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
