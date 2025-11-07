import { authRouter } from "./router/auth";
import { dynastyRouter } from "./router/dynasty";
import { poemDiscoverRouter, poemRouter } from "./router/poem";
import { createCallerFactory, createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  poem: {
    ...poemDiscoverRouter,
    ...poemRouter,
  },
  dynasty: dynastyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
