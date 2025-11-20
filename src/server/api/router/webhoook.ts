import { Octokit } from "@octokit/rest";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { env } from "@/env";
import { parseMarkdownToJson } from "@/lib/ast-markdown";
import { syncPoemToDatabase } from "@/lib/sync-poem-to-db";
import { publicProcedure } from "../trpc";

type HeadCommit = {
  added: string[];
  removed: string[];
  modified: string[];
};

// 创建 Octokit 实例
const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

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
    .mutation(async ({ input, ctx }) => {
      const { head_commit } = JSON.parse(input.payload) as {
        head_commit: HeadCommit;
      };

      const { added, modified, removed } = head_commit;
      if (removed.length > 0) {
        // 删除对应的数据库记录
        for (const filePath of removed) {
          if (filePath.startsWith("poems/")) {
            const slug = filePath
              .replace("poems/", "")
              .replace(".md", "")
              .replace(/\//g, "-");

            ctx.db.poem
              .deleteMany({
                where: { slug },
              })
              .then();
          }
        }

        return {
          message: "Processed removed files.",
        };
      } else {
        const markdownFiles = [...added, ...modified].filter((filePath) =>
          filePath.startsWith("poems/"),
        );

        if (markdownFiles.length === 0) {
          return { message: "No relevant markdown files to process." };
        }

        return await processFilesAndTrack(markdownFiles);
      }
    }),
} satisfies TRPCRouterRecord;

async function processFilesAndTrack(markdownFiles: string[]) {
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;

  const promises = markdownFiles.map(async (filePath) => {
    try {
      // 使用 Octokit 获取文件内容
      const { data } = await octokit.rest.repos.getContent({
        owner: "meetqy",
        repo: "aspoem-backup",
        path: filePath,
        ref: "main",
      });

      // 检查是否为文件（不是目录）
      if ("content" in data && data.type === "file") {
        // GitHub API 返回的内容是 base64 编码的
        const markdownContent = Buffer.from(data.content, "base64").toString(
          "utf-8",
        );
        const poemData = await parseMarkdownToJson(markdownContent);
        const result = await syncPoemToDatabase(poemData);

        processedCount++;
        successCount++;

        return { filePath, success: true, result };
      } else {
        throw new Error("Not a file or content not found");
      }
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
