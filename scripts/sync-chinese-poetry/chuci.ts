import { db } from "@/server/db";

import data from "../../chinese-poetry-master/楚辞/chuci.json";

import { createAuthor } from "./utils";

const _authors = [
  { name: "屈原", dynasty: "楚" },
  { name: "宋玉", dynasty: "楚" },
  { name: "景差", dynasty: "楚" },
  { name: "贾谊", dynasty: "西汉" },
  { name: "淮南小山", dynasty: "西汉" },
  { name: "东方朔", dynasty: "西汉" },
  { name: "庄忌", dynasty: "西汉" },
  { name: "王褒", dynasty: "西汉" },
  { name: "刘向", dynasty: "西汉" },
  { name: "王逸", dynasty: "东汉" },
];

export const syncChuci = async () => {
  try {
    // 创建楚辞主分类
    const mainCategory = await db.category.create({
      data: {
        name: "楚辞",
        description:
          "《楚辞》是中国战国时期楚国诗人屈原创作的诗歌总集，后人辑录而成。其内容主要反映了战国时期楚国的社会生活和人民的思想感情，具有浓厚的地方特色和浪漫主义色彩。",
      },
    });

    // 创建作者映射表
    const authorMap = new Map<string, string>();
    for (const author of _authors) {
      const authorId = await createAuthor(author.name, author.dynasty);
      authorMap.set(author.name, authorId);
    }

    // 收集所有的 section 并创建子分类
    const sections = [...new Set(data.map((poem) => poem.section))];
    const sectionCategoryMap = new Map<string, string>();

    for (const section of sections) {
      const sectionCategory = await db.category.create({
        data: {
          name: section,
          parentId: mainCategory.id,
        },
      });
      sectionCategoryMap.set(section, sectionCategory.id);
    }

    // 创建诗词
    await Promise.all(
      data.map(async (poem) => {
        // 根据诗歌内容或标题匹配作者，默认为屈原
        let authorId = authorMap.get(poem.author);

        // 尝试从作者映射中找到匹配的作者
        for (const [name, id] of authorMap.entries()) {
          if (poem.title.includes(name) || poem.content.some((line) => line.includes(name))) {
            authorId = id;
            break;
          }
        }

        // 获取对应的 section 分类 ID
        const categoryId = sectionCategoryMap.get(poem.section);

        return db.poem.create({
          data: {
            title: poem.title,
            paragraphs: poem.content.join("\n"),
            authorId: authorId!,
            categoryId: categoryId,
          },
        });
      }),
    );

    console.log(`楚辞同步完成: ${data.length} 首诗词已导入`);
    console.log(`创建了 ${sections.length} 个子分类: ${sections.join(", ")}`);
    console.log("数据源: chinese-poetry-master/楚辞/chuci.json");
  } catch (error) {
    console.error("楚辞同步失败:", error);
    throw error;
  }
};
