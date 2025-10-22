import dataQianjiashi from "../../../chinese-poetry-master/蒙学/qianjiashi.json";
import { createAuthor, createCategory, createPoem } from "../utils";

export const syncQianjiashi = async () => {
  try {
    // 创建千家诗主分类
    const mainCategoryId = await createCategory("千家诗");

    // 创建子分类映射
    const typeMap = new Map<string, string>();
    for (const section of dataQianjiashi.content) {
      if (!typeMap.has(section.type)) {
        const subCategoryId = await createCategory(section.type, mainCategoryId);
        typeMap.set(section.type, subCategoryId);
      }
    }

    let totalCreated = 0;

    // 遍历每个 section 中的 content（诗词）
    for (const section of dataQianjiashi.content) {
      for (const poem of section.content) {
        // 解析作者信息，处理括号格式：（唐）令狐楚
        let dynasty = "未知";
        let authorName = poem.author;

        // 如果作者信息包含括号格式的朝代信息
        const match = /^（(.+?)）(.+)$/.exec(poem.author);
        if (match) {
          dynasty = match[1]!.trim();
          authorName = match[2]!.trim();
        }

        // 创建作者
        const authorId = await createAuthor(authorName, dynasty);

        // 获取对应的子分类ID
        const categoryId = typeMap.get(section.type);

        // 检查是否包含 subchapter 结构
        if (Array.isArray(poem.paragraphs) && poem.paragraphs.length > 0 && typeof poem.paragraphs[0] === "object" && "subchapter" in poem.paragraphs[0]) {
          // 如果是包含 subchapter 的结构，为每个 subchapter 创建单独的诗词
          for (const subSection of poem.paragraphs) {
            if (typeof subSection === "object" && subSection.subchapter && subSection.paragraphs) {
              await createPoem({
                title: `${poem.chapter}（${subSection.subchapter}）`,
                paragraphs: subSection.paragraphs,
                authorId,
                categoryId,
              });
              totalCreated++;
            }
          }
        } else {
          // 如果是普通的字符串数组，创建单一诗词
          await createPoem({
            title: poem.chapter,
            paragraphs: poem.paragraphs as string[],
            authorId,
            categoryId,
          });
          totalCreated++;
        }
      }
    }

    console.log(`千家诗同步完成: ${totalCreated} 首诗词已导入`);
    console.log(`创建了 ${typeMap.size} 个子分类`);
  } catch (error) {
    console.error("千家诗同步失败:", error);
    throw error;
  }
};
