import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { CreatePostSchema } from "@aspoem/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  hello: publicProcedure.query(() => {
    return "world";
  }),
} satisfies TRPCRouterRecord;
