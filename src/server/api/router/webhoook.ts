import { Octokit } from "@octokit/rest";
import type { PrismaClient } from "@prisma/client";
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

interface ProcessResult {
  total: number;
  success: number;
  failed: number;
  deleted?: number;
}

// 配置常量
const CONFIG = {
  BATCH_SIZE: 10,
  POEM_PATH_PREFIX: "poems/",
  GITHUB: {
    OWNER: "meetqy",
    REPO: "aspoem-backup",
    REF: "main",
  },
} as const;

// 创建 Octokit 实例
const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

// 工具函数：从文件路径提取 slug
function extractSlug(filePath: string): string {
  return filePath
    .replace(CONFIG.POEM_PATH_PREFIX, "")
    .replace(".md", "")
    .replace(/\//g, "-");
}

// 工具函数：过滤诗词文件
function filterPoemFiles(files: string[]): string[] {
  return files.filter((f) => f.startsWith(CONFIG.POEM_PATH_PREFIX));
}

// 处理删除的文件
async function handleDeletedFiles(
  files: string[],
  db: PrismaClient,
): Promise<number> {
  const poemFiles = filterPoemFiles(files);

  await Promise.all(
    poemFiles.map((filePath) =>
      db.poem.deleteMany({
        where: { slug: extractSlug(filePath) },
      }),
    ),
  );

  return poemFiles.length;
}

// 获取文件内容
async function fetchFileContent(filePath: string): Promise<string> {
  const { data } = await octokit.rest.repos.getContent({
    owner: CONFIG.GITHUB.OWNER,
    repo: CONFIG.GITHUB.REPO,
    path: filePath,
    ref: CONFIG.GITHUB.REF,
  });

  if (!("content" in data) || data.type !== "file") {
    throw new Error("Not a file or content not found");
  }

  return Buffer.from(data.content, "base64").toString("utf-8");
}

// 处理单个文件
async function processFile(filePath: string): Promise<void> {
  const markdownContent = await fetchFileContent(filePath);
  const poemData = await parseMarkdownToJson(markdownContent);
  await syncPoemToDatabase(poemData);
}

// 分批处理文件
async function processFilesInBatches(files: string[]): Promise<ProcessResult> {
  let success = 0;
  let failed = 0;

  // 分批处理
  for (let i = 0; i < files.length; i += CONFIG.BATCH_SIZE) {
    const batch = files.slice(i, i + CONFIG.BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map((filePath) => processFile(filePath)),
    );

    // 统计结果
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        success++;
      } else {
        failed++;
        console.error(`Failed to process file:`, result.reason);
      }
    });

    console.log(
      `Processed ${i + batch.length}/${files.length} (✓${success} ✗${failed})`,
    );
  }

  return {
    total: files.length,
    success,
    failed,
  };
}

export const webhookRouter = {
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

      // 处理删除
      const deletedCount =
        removed.length > 0 ? await handleDeletedFiles(removed, ctx.db) : 0;

      // 处理新增和修改
      const filesToProcess = filterPoemFiles([...added, ...modified]);

      if (filesToProcess.length === 0) {
        return {
          message: "No relevant markdown files to process.",
          deleted: deletedCount,
        };
      }

      // 分批处理文件
      const result = await processFilesInBatches(filesToProcess);

      return {
        message: "Processing completed.",
        ...result,
        deleted: deletedCount,
      };
    }),
} satisfies TRPCRouterRecord;
