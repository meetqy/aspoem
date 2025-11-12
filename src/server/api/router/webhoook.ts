import type { TRPCRouterRecord } from "@trpc/server";
import axios from "axios";
import { z } from "zod";
import { parseMarkdownToJson } from "@/lib/ast-markdown";
import { syncPoemToDatabase } from "@/lib/sync-poem-to-db";
import { publicProcedure } from "../trpc";

type HeadCommit = {
  added: string[];
  removed: string[];
  modified: string[];
};

export const webhookRouter = {
  // 处理 webhook 事件
  handleWebhook: publicProcedure
    .input(
      z.object({
        payload: z.string(),
        id: z.string(),
        event: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { head_commit } = JSON.parse(input.payload) as {
        head_commit: HeadCommit;
      };

      const { added, modified } = head_commit;
      const markdownFiles = [...added, ...modified].filter((filePath) =>
        filePath.startsWith("poems/"),
      );

      if (markdownFiles.length === 0) {
        return {
          success: true,
          message: "没有需要处理的诗词文件",
          processedFiles: 0,
        };
      }

      return await processFilesAndTrack(markdownFiles);
    }),
} satisfies TRPCRouterRecord;

async function processFilesAndTrack(markdownFiles: string[]) {
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;

  const promises = markdownFiles.map(async (filePath) => {
    try {
      const response = await axios(
        `https://raw.githubusercontent.com/meetqy/aspoem-backup/refs/heads/main/${filePath}`,
      );
      const markdownContent = response.data;
      const data = await parseMarkdownToJson(markdownContent);
      const result = await syncPoemToDatabase(data);

      processedCount++;
      successCount++;

      return { filePath, success: true, result };
    } catch (error) {
      processedCount++;
      errorCount++;

      return { filePath, success: false, error };
    }
  });

  // 等待所有文件处理完成
  await Promise.allSettled(promises);

  // 处理完成后的统计
  const finalStats = {
    total: markdownFiles.length,
    processed: processedCount,
    success: successCount,
    error: errorCount,
    completed: true,
    timestamp: new Date().toISOString(),
  };

  return finalStats;
}
