import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseMarkdownToJson } from "@/lib/ast-markdown";
import { syncPoemToDatabase } from "@/lib/sync-poem-to-db";
import { db } from "@/server/db";

async function initMarkdownToDatabase() {
  try {
    const poemsDir = join(process.cwd(), "../aspoem-backup");

    let totalFiles = 0;
    let successCount = 0;
    let errorCount = 0;

    console.log("开始同步 poems 目录到数据库...");

    // 递归读取所有 markdown 文件
    const markdownFiles = getAllMarkdownFiles(poemsDir);
    totalFiles = markdownFiles.length;

    console.log(`找到 ${totalFiles} 个 markdown 文件`);

    for (let i = 0; i < markdownFiles.length; i++) {
      const filePath = markdownFiles[i]!;

      try {
        console.log(`[${i + 1}/${totalFiles}] 处理文件: ${filePath}`);

        const markdownContent = readFileSync(filePath, "utf-8");
        // 解析 markdown 文件
        const poemData = await parseMarkdownToJson(markdownContent);

        // 同步到数据库
        await syncPoemToDatabase(poemData);

        successCount++;
        console.log(`✓ 成功处理: ${poemData.title}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ 处理文件失败: ${filePath}`, error);
      }
    }

    console.log(`\n${"=".repeat(50)}`);
    console.log("同步完成！");
    console.log(`总文件数: ${totalFiles}`);
    console.log(`成功: ${successCount}`);
    console.log(`失败: ${errorCount}`);
    console.log("=".repeat(50));
  } catch (error) {
    console.error("同步过程中发生错误:", error);
  } finally {
    await db.$disconnect();
  }
}

// 递归获取所有 markdown 文件
function getAllMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // 递归处理子目录
        files.push(...getAllMarkdownFiles(fullPath));
      } else if (entry.endsWith(".md")) {
        // 添加 markdown 文件
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`读取目录失败: ${dir}`, error);
  }

  return files;
}

initMarkdownToDatabase();
