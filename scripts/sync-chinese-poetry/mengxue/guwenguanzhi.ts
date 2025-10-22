import dataGuwenguanzhi from "../../../chinese-poetry-master/蒙学/guwenguanzhi.json";
import { createAuthor, createCategory, createPoem } from "../utils";

export const syncGuwenguanzhi = async () => {
  try {
    // 创建古文观止主分类
    const mainCategoryId = await createCategory("古文观止");

    // 创建子分类并处理诗词
    for (const section of dataGuwenguanzhi.content) {
      // 创建子分类
      const subCategoryId = await createCategory(section.title, mainCategoryId);

      // 处理该分类下的所有章节
      await Promise.all(
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

          // 创建作者
          const authorId = await createAuthor(authorName, dynasty);

          // 创建诗词
          return createPoem({
            title: chapter.chapter,
            paragraphs: chapter.paragraphs,
            authorId,
            categoryId: subCategoryId,
            source: chapter.source,
          });
        }),
      );
    }

    const totalChapters = dataGuwenguanzhi.content.reduce((sum, section) => sum + section.content.length, 0);

    console.log(`古文观止同步完成: ${totalChapters} 篇文章已导入`);
    console.log(`创建了 ${dataGuwenguanzhi.content.length} 个子分类`);
    console.log("数据源: chinese-poetry-master/蒙学/guwenguanzhi.json");
  } catch (error) {
    console.error("古文观止同步失败:", error);
    throw error;
  }
};
