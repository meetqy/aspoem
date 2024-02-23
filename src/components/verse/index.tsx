import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { type ReactNode } from "react";
import { cn } from "~/utils";

import "./index.css";

const cn_symbol = "，。！？；：、·";
const en_symbol = ",.!?;:,·";

function getContent(text: string, annotation: string[]) {
  const newAnnotation: string[] = [];

  annotation.forEach((item) => {
    if (text.includes(item)) {
      newAnnotation.push(item);
    }

    text = text.replace(item, "$");
  });

  const result = text.split("");

  let i = 0;

  return result.map((item) => {
    if (item === "$") {
      i++;
      return newAnnotation[i - 1] || "";
    }

    return item;
  });
}

/**
 * 诗的段落布局
 * @param props
 * @returns
 */
export const Verse = (props: {
  content: string;
  py?: string;
  annotation?: { [key in string]: string };
  variant?: "shi" | "title";
  className?: string;
}) => {
  const { annotation } = props;

  const text = getContent(props.content, Object.keys(annotation ?? {}));
  const pinyinArray = props.py ? props.py.split(" ") : [];

  // 注解的所有 KEY
  const annotationKeys = Object.keys(annotation ?? {});

  const Content = () => {
    let pinyinIndex = 0;

    const render = (text: string[]) => {
      return text.map((item, i) => {
        const py = pinyinArray[pinyinIndex] ?? "";

        if (item.length > 1) {
          const chlild = item.split("");
          return (
            <Annotation key={i} tigger={<b>{render(chlild)}</b>}>
              {props.annotation?.[item] ?? "暂无注释"}
            </Annotation>
          );
        }

        pinyinIndex++;

        // 匹配成功
        if (annotationKeys.includes(item)) {
          return (
            <Annotation
              key={i}
              tigger={
                <b>
                  <Char
                    char={item}
                    key={i}
                    pinyin={en_symbol.includes(py) ? undefined : py}
                  />
                </b>
              }
            >
              {props.annotation?.[item] ?? "暂无注释"}
            </Annotation>
          );
        }

        return (
          <Char
            char={item}
            key={i}
            pinyin={en_symbol.includes(py) ? undefined : py}
          />
        );
      });
    };

    return render(text);
  };

  return (
    <p
      className={cn(
        "verse",
        pinyinArray.length === 0 && "no-py",
        props.variant ?? "normal",
        props.className,
      )}
    >
      <Content />
    </p>
  );
};

const Annotation = (props: { tigger: ReactNode; children: ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{props.tigger}</PopoverTrigger>
      <PopoverContent>{props.children}</PopoverContent>
    </Popover>
  );
};

const Char = (props: {
  char: string;
  annotation?: boolean;
  // 当前字符的拼音
  pinyin?: string;
}) => {
  return (
    <>
      <ruby className={cn("char", cn_symbol.includes(props.char) && "symbol")}>
        {props.char}

        {props.pinyin && (
          <>
            <rp>(</rp>
            <rt>{props.pinyin}</rt>
            <rp>)</rp>
          </>
        )}
      </ruby>
      {cn_symbol.includes(props.char) && <span className="br"></span>}
    </>
  );
};
