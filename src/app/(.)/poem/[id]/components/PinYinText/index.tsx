import { cn } from "~/utils";

import "./index.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface Props {
  text: string;
  pinyin?: string;
  type?: "h1" | "p";
  align?: "center" | "left";
  retract?: boolean;
  annotation?: { [key in string]: string };
  className?: string;
}

/**
 * 拼音不需要显示的字符
 */
const _pinyinNoShowChar = ["."];

function _getText(text: string, annotation: string[]) {
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

const PinYinText = (props: Props) => {
  const TagName = props.type ?? "p";
  const pinyinArray = props.pinyin?.split(" ") ?? [];

  const annotationKeys = Object.keys(props.annotation ?? {});

  const text = _getText(props.text, annotationKeys);

  const PinYin = ({ children }: { children: React.ReactNode }) => {
    return (
      <span
        data-pinyin=""
        className="hidden !font-normal text-muted-foreground md:inline"
      >
        {children}
      </span>
    );
  };

  const Content = () => {
    let pinyinIndex = 0;

    const render = (text: string[]) => {
      return text.map((item, i) => {
        const py = pinyinArray[pinyinIndex] ?? "";

        if (item.length > 1) {
          const chlild = item.split("");
          return (
            <Popover key={i}>
              <PopoverTrigger>
                <b className="char_annotation underline-animation">
                  {render(chlild)}
                </b>
              </PopoverTrigger>
              <PopoverContent>
                {props.annotation?.[item] ?? "暂无注释"}
              </PopoverContent>
            </Popover>
          );
        }

        pinyinIndex++;

        if (annotationKeys.includes(item)) {
          return (
            <Popover key={i}>
              <PopoverTrigger>
                <span
                  data-text=""
                  key={i}
                  className={cn(
                    /，|。|？|·/.test(item) && "md:-px-1.5 md:-mx-2",
                    annotationKeys.includes(item) &&
                      "char_annotation underline-animation",
                  )}
                >
                  <b>{item}</b>
                  {!_pinyinNoShowChar.includes(py) && <PinYin>{py}</PinYin>}
                </span>
              </PopoverTrigger>
              <PopoverContent>
                {props.annotation?.[item] ?? "暂无注释"}
              </PopoverContent>
            </Popover>
          );
        }

        return (
          <span
            data-text=""
            key={i}
            className={cn(
              /，|。|？|·/.test(item) && "md:-px-1.5 md:-mx-2",
              annotationKeys.includes(item) &&
                "char_annotation underline-animation",
            )}
          >
            {item}
            {!_pinyinNoShowChar.includes(py) && <PinYin>{py}</PinYin>}
          </span>
        );
      });
    };

    return render(text);
  };

  return (
    <TagName
      {...{
        "prose-h1": TagName === "h1" ? "" : undefined,
        "prose-p": TagName === "p" ? "" : undefined,
        className: cn(
          "pinyin",
          `pinyin_${TagName}`,
          props.align === "left" ? "text-left" : "text-center",
          props.retract && "pinyin_retract",
          props.pinyin && "pinyin_show",
          props.className,
        ),
      }}
    >
      {TagName === "p" && props.retract && (
        <>
          <span data-text className="opacity-0">
            空
          </span>
          <span data-text className="opacity-0">
            空
          </span>
        </>
      )}

      <Content />
    </TagName>
  );
};

export default PinYinText;
