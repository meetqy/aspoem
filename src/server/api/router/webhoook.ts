import { Webhooks } from "@octokit/webhooks";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { env } from "@/env";
import { publicProcedure } from "../trpc";

const webhooks = new Webhooks({
  secret: env.GITHUB_WEBHOOK_SECRET,
});

export const webhookRouter = {
  // 处理 webhook 事件
  handleWebhook: publicProcedure
    .input(
      z.object({
        signature: z.string(),
        payload: z.string(),
        event: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        console.log({
          id: input.id,
          name: input.event,
          signature: input.signature,
        });

        // 验证并处理 webhook
        webhooks
          .verifyAndReceive({
            id: input.id,
            name: input.event,
            payload: input.payload,
            signature: input.signature,
          })
          .catch((error) => {
            console.error(error);
          });

        return {
          success: true,
          event: input.event,
          message: "Webhook 处理成功",
        };
      } catch (error) {
        console.error("Webhook 处理失败:", error);
        return {
          success: false,
          event: input.event,
          message: error instanceof Error ? error.message : "处理失败",
        };
      }
    }),
} satisfies TRPCRouterRecord;
