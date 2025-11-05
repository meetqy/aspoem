import dataGuwenguanzhi from "../../../chinese-poetry-master/蒙学/guwenguanzhi.json";
import { createMdContent } from "../create-md";

export async function syncGuwenguanzhi() {
  try {
    // 遍历每个分类下的所有章节
    await Promise.all(
      dataGuwenguanzhi.content.flatMap((section) =>
        section.content.map(async (chapter) => {
          // 解析作者信息 "先秦：左丘明" -> 朝代: "先秦", 姓名: "左丘明"
          const authorInfo = chapter.author.trim();
          let dynasty = "未知";
          let authorName = authorInfo;

          if (authorInfo.includes("：")) {
            const parts = authorInfo.split("：");
            dynasty = parts[0]!.trim();
            authorName = parts[1]!.trim();
          } else if (authorInfo.includes(":")) {
            const parts = authorInfo.split(":");
            dynasty = parts[0]!.trim();
            authorName = parts[1]!.trim();
          }

          // 创建 MD 文件
          return createMdContent({
            title: chapter.chapter,
            paragraphs: chapter.paragraphs,
            author: authorName,
            dynasty,
            tags: [section.title, "古文观止", "蒙学"], // 将分类作为标签
          });
        }),
      ),
    );

    const totalChapters = dataGuwenguanzhi.content.reduce(
      (sum, section) => sum + section.content.length,
      0,
    );

    console.log(`古文观止同步完成: ${totalChapters} 篇文章已导入`);
  } catch (error) {
    console.error("古文观止同步失败:", error);
    throw error;
  }
}
