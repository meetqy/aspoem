import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { db } from "@/server/db";
import { parseMarkdownToJson } from "./ast-markdown";

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

        // 解析 markdown 文件
        const poemData = await parseMarkdownToJson(filePath);

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

// 同步诗词数据到数据库
async function syncPoemToDatabase(poemData: any) {
  // 1. 创建或查找朝代
  let dynasty = await db.dynasty.findUnique({
    where: { slug: poemData.dynastySlug },
  });

  if (!dynasty) {
    dynasty = await db.dynasty.create({
      data: {
        name: poemData.dynasty,
        pinyin: poemData.dynastyPinyin,
        slug: poemData.dynastySlug,
      },
    });
  }

  // 2. 创建或查找作者
  let author = await db.author.findUnique({
    where: { slug: poemData.authorSlug },
  });

  if (!author) {
    author = await db.author.create({
      data: {
        name: poemData.author,
        pinyin: poemData.authorPinyin,
        slug: poemData.authorSlug,
        dynastyId: dynasty.id,
      },
    });
  }

  // 3. 处理标签
  const tagConnections = [];
  for (const tagName of poemData.tags) {
    if (!tagName) continue;

    let tag = await db.tag.findUnique({
      where: { slug: tagName.toLowerCase().replace(/\s+/g, "-") },
    });

    if (!tag) {
      tag = await db.tag.create({
        data: {
          name: tagName,
          slug: tagName.toLowerCase().replace(/\s+/g, "-"),
        },
      });
    }

    tagConnections.push({ id: tag.id });
  }

  // 4. 检查诗词是否已存在
  const existingPoem = await db.poem.findUnique({
    where: { titleSlug: poemData.titleSlug },
  });

  if (existingPoem) {
    // 更新现有诗词
    await db.poem.update({
      where: { id: existingPoem.id },
      data: {
        title: poemData.title,
        titlePinyin: poemData.titlePinyin,
        paragraphs: poemData.paragraphs,
        paragraphsPinyin: poemData.paragraphsPinyin,
        annotation: poemData.annotation || undefined,
        authorId: author.id,
        tag: {
          set: tagConnections,
        },
      },
    });
  } else {
    // 创建新诗词
    await db.poem.create({
      data: {
        title: poemData.title,
        titleSlug: poemData.titleSlug,
        titlePinyin: poemData.titlePinyin,
        paragraphs: poemData.paragraphs,
        paragraphsPinyin: poemData.paragraphsPinyin,
        annotation: poemData.annotation || undefined,
        authorId: author.id,
        tag: {
          connect: tagConnections,
        },
      },
    });
  }
}

initMarkdownToDatabase();
