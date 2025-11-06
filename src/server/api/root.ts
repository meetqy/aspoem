import { authRouter } from "./router/auth";
import { poemDiscoverRouter, poemRouter } from "./router/poem";
import { createCallerFactory, createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  poem: {
    ...poemDiscoverRouter,
    ...poemRouter,
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
