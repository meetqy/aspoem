import { cn } from "~/utils";
import { AnnotationModal } from "./annotation-modal";
import "./index.css";

interface Props {
  paragraphs: string[];
  py_paragraphs: string[];
  annotation: Record<string, string>;
}

export const TypographyArticle = ({
  paragraphs,
  py_paragraphs,
  annotation,
}: Props) => {
  return (
    <div id="main-body" className="relative px-4">
      <Paragraph
        paragraphs={paragraphs}
        py_paragraphs={py_paragraphs || []}
        annotation={annotation || {}}
      />

      <AnnotationModal annotation={annotation} />
    </div>
  );
};

/**
 * 段落
 */
const Paragraph = ({
  paragraphs,
  py_paragraphs,
  annotation,
}: {
  paragraphs: string[];
  py_paragraphs: string[];
  annotation: Record<string, string>;
}) => {
  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p
          className={cn("py-line", {
            "no-py": py_paragraphs.length === 0,
          })}
          key={i}
          dangerouslySetInnerHTML={{
            __html: Annotation({
              paragraph,
              annotation: annotation,
              py_paragraph: py_paragraphs[i],
            }),
          }}
        ></p>
      ))}
    </>
  );
};

const Annotation = ({
  paragraph,
  py_paragraph,
  annotation = {},
}: {
  paragraph: string;
  py_paragraph?: string;
  annotation: Record<string, string>;
}) => {
  const origin = paragraph;
  const py = py_paragraph?.split(" ");
  // 正则汉字
  const re = /[\u4e00-\u9fa5]/g;
  const cn_symbol = /，|。|；|？|！|“|”|‘|’|（|）|《|》|【|】|、/g;

  // 中文分号替换为句号
  // 分号无法触发谷歌的首字符号优化
  paragraph = paragraph.replace(
    cn_symbol,
    (val) =>
      `<span class="py-non-chinese-item">${val.replace("；", "。")}</span>`,
  );

  for (const key in annotation) {
    paragraph = paragraph.replace(
      new RegExp(key, "g"),
      (val) => `<b>${val}</b>`,
    );
  }

  if (!py) return paragraph;

  paragraph = paragraph.replace(re, (val) => {
    const index = origin.indexOf(val);
    const rt = py[index];

    return `<span class="py-result-item"><ruby><span class="py-chinese-item">${val}</span><rp>(</rp><rt>${rt}</rt><rp>)</rp></ruby></span>`;
  });

  return paragraph;
};
