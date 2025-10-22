import { Dynasty } from "@/types";

import dataDizigui from "../../../chinese-poetry-master/蒙学/dizigui.json";
import { createAuthor, createCategory, createPoem } from "../utils";

export const syncDizigui = async () => {
  try {
    const categoryId = await createCategory("蒙学");
    const _author = {
      name: "李毓秀",
      dynasty: Dynasty.清,
    };

    const authorId = await createAuthor(_author.name, _author.dynasty);

    // 遍历弟子规的各个章节
    await Promise.all(
      dataDizigui.content.map(async (chapter) => {
        return createPoem({
          title: chapter.chapter,
          paragraphs: chapter.paragraphs,
          authorId,
          categoryId,
          section: chapter.chapter, // chapter 对应 poem 中的 section
        });
      }),
    );

    console.log(`弟子规同步完成: ${dataDizigui.content.length} 个章节已导入`);
  } catch (error) {
    console.error("弟子规同步失败:", error);
    throw error;
  }
};
