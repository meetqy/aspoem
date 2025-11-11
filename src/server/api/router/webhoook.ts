import { Webhooks } from "@octokit/webhooks";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { env } from "@/env";
import { publicProcedure } from "../trpc";

// 创建 webhooks 实例
const createWebhookInstance = () => {
  const secret = env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("GITHUB_WEBHOOK_SECRET is required");
  }
  return new Webhooks({ secret });
};

export const webhookRouter = {
  // 处理 webhook 事件
  handleWebhook: publicProcedure
    .input(
      z.object({
        signature: z.string(),
        payload: z.string(),
        event: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const webhooks = createWebhookInstance();
        console.log(input.signature, "==signature==");

        // GitHub 签名格式是 "sha256=hash"，需要提取 hash 部分
        const signature = input.signature.startsWith("sha256=")
          ? input.signature
          : `sha256=${input.signature}`;

        // 验证并处理 webhook
        await webhooks.verifyAndReceive({
          id: `webhook-${Date.now()}`,
          name: input.event,
          signature: signature,
          payload: input.payload,
        });

        console.log(`收到 GitHub webhook 事件: ${input.event}`);

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
