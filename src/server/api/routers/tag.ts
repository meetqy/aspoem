import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  find: publicProcedure.query(({ ctx }) => ctx.db.tag.findMany({})),
});
