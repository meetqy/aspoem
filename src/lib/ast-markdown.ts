import type { Poem } from "@prisma/client";
import matter from "gray-matter";
import { convert } from "pinyin-pro";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { formatPinyin } from "./utils";

let hasProcessedList = false;

export interface PoemData {
  // Frontmatter 字段
  id: string;
  title: string;
  titlePinyin: string;
  titleSlug: string;
  author: string;
  authorPinyin: string;
  authorSlug: string;
  dynasty: string;
  dynastyPinyin: string;
  dynastySlug: string;
  tags: string[];

  // 内容字段
  paragraphs: string[];
  paragraphsPinyin: string[];
  annotation?: Poem["annotation"];
  translation?: string;
  appreciation?: string;
}

const convertPinyin = (pinyin?: string) => convert(formatPinyin(pinyin || ""));

export async function parseMarkdownToJson(
  markdownContent: string,
): Promise<PoemData> {
  // 使用 gray-matter 解析 frontmatter
  const { data: frontmatter, content } = matter(markdownContent);

  // 创建一个 unified 处理器
  const processor = unified()
    .use(remarkParse) // 解析 Markdown
    .use(remarkGfm); // 支持 GitHub Flavored Markdown

  // 解析 Markdown 为 AST
  const tree = processor.parse(content);

  // 初始化结果对象，先从 frontmatter 中获取基础数据
  const result: PoemData = {
    id: frontmatter.id || "",
    title: frontmatter.title || "",
    titlePinyin: convertPinyin(frontmatter.titlePinyin),
    titleSlug: frontmatter.titleSlug || "",
    author: frontmatter.author || "",
    authorPinyin: convertPinyin(frontmatter.authorPinyin),
    authorSlug: frontmatter.authorSlug || "",
    dynasty: frontmatter.dynasty || "",
    dynastyPinyin: convertPinyin(frontmatter.dynastyPinyin),
    dynastySlug: frontmatter.dynastySlug || "",
    tags: Array.isArray(frontmatter.tags)
      ? frontmatter.tags
      : frontmatter.tags?.split(",").map((tag: string) => tag.trim()) || [],
    paragraphs: [],
    paragraphsPinyin: [],
    annotation: "",
    translation: "",
    appreciation: "",
  };

  let currentSection = "";
  let currentContent: string[] = [];

  // 遍历 AST，提取信息
  // 遍历 AST，提取信息
  visit(tree, (node) => {
    switch (node.type) {
      case "heading": {
        // 保存上一个 section 的内容
        if (currentSection && currentContent.length > 0) {
          saveSection(result, currentSection, currentContent);
          currentContent = [];
        }

        // 获取标题文本
        const headingText = extractTextFromNode(node);
        currentSection = headingText;
        hasProcessedList = false; // 重置标志
        break;
      }

      case "list":
        // 只有在有 section 的情况下才处理列表
        if (currentSection && node.children) {
          const listItems = node.children
            .map((listItem) => {
              if (listItem.type === "listItem" && listItem.children) {
                return extractTextFromNode(listItem);
              }
              return "";
            })
            .filter(Boolean);
          currentContent.push(...listItems);
          hasProcessedList = true; // 标记已处理过列表
        }
        break;

      case "paragraph": {
        // 只有在有 section 且没有处理过 list 的情况下才处理段落
        if (currentSection && !hasProcessedList) {
          const paragraphText = extractTextFromNode(node);
          if (paragraphText.trim()) {
            currentContent.push(paragraphText.trim());
          }
        }
        break;
      }
    }
  });

  // 保存最后一个 section
  if (currentSection && currentContent.length > 0) {
    saveSection(result, currentSection, currentContent);
  }

  return result;
}

// 从节点中提取文本内容
function extractTextFromNode(node: any): string {
  if (node.type === "text") {
    return node.value;
  }

  if (node.children) {
    return node.children.map(extractTextFromNode).join("");
  }

  return "";
}

// 根据 section 名称保存内容
function saveSection(result: PoemData, sectionName: string, content: string[]) {
  switch (sectionName) {
    case "正文":
      result.paragraphs = content;
      break;
    case "拼音":
      result.paragraphsPinyin = content.map((e) => convert(e));
      break;
    case "注释": {
      const json: Record<string, string> = {};
      content.forEach((line) => {
        const [k, v] = line.split("：");
        if (k && v) {
          json[k.trim()] = v.trim();
        }
      });
      result.annotation = json;
      break;
    }
    case "译文":
      result.translation = content.join("\n");
      break;
    case "赏析":
      result.appreciation = content.join("\n");
      break;
  }
}
