import data from "../../../chinese-poetry-master/蒙学/shenglvqimeng.json";
import { createMdContent } from "../create-md";

export async function syncShenglvqimeng() {
  try {
    const { title, content, author } = data;

    await Promise.all(
      content[0]!.content
        .map((item) =>
          createMdContent({
            title: item.chapter,
            author,
            paragraphs: item.paragraphs,
            dynasty: "清",
            parent: [title, "上卷"],
          }),
        )
        .concat(
          content[1]!.content.map((item) =>
            createMdContent({
              title: item.chapter,
              author,
              paragraphs: item.paragraphs,
              dynasty: "清",
              parent: [title, "下卷"],
            }),
          ),
        ),
    );

    console.log(`声律启蒙同步完成: 1 篇文章已导入`);
  } catch (error) {
    console.error("声律启蒙同步失败:", error);
    throw error;
  }
}
