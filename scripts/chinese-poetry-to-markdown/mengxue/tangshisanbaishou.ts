import data from "../../../chinese-poetry-master/蒙学/tangshisanbaishou.json";
import { createMdContent } from "../create-md";

export async function syncTangshisanbaishou() {
  try {
    const arr: any[] = [];

    data.content.forEach((item) => {
      item.content.forEach((poem) => {
        arr.push(
          createMdContent({
            title: poem.chapter,
            author: poem.author,
            dynasty: "唐",
            paragraphs: poem.paragraphs,
            tags: ["蒙学", "唐詩三百首", item.type],
          }),
        );
      });
    });

    await Promise.all(arr);

    console.log(`唐诗三百首同步完成: ${arr.length} 篇文章已导入`);
  } catch (error) {
    console.error("唐诗三百首同步失败:", error);
    throw error;
  }
}
