import { cn } from "~/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import "./index.css";

interface Props {
  text: string;
  pinyin?: string;
  type?: "h1" | "p";
  align?: "center" | "left";
  retract?: boolean;
  annotation?: { [key in string]: string };
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
      <span data-pinyin="" className="!font-normal text-muted-foreground">
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
            <HoverCard key={i} openDelay={400}>
              <HoverCardTrigger>
                <b className="char_annotation underline-animation !from-blue-900 !to-blue-50">
                  {render(chlild)}
                </b>
              </HoverCardTrigger>
              <HoverCardContent>
                {props.annotation?.[item] ?? "暂无注释"}
              </HoverCardContent>
            </HoverCard>
          );
        }

        pinyinIndex++;

        if (annotationKeys.includes(item)) {
          return (
            <HoverCard key={i} openDelay={400}>
              <HoverCardTrigger>
                <span
                  data-text=""
                  key={i}
                  className={cn(
                    /，|。|？|·/.test(item) && "!-px-1.5 !-mx-2",
                    annotationKeys.includes(item) &&
                      "underline-animation char_annotation",
                  )}
                >
                  <b>{item}</b>
                  {!_pinyinNoShowChar.includes(py) && <PinYin>{py}</PinYin>}
                </span>
              </HoverCardTrigger>
              <HoverCardContent>
                {props.annotation?.[item] ?? "暂无注释"}
              </HoverCardContent>
            </HoverCard>
          );
        }

        return (
          <span
            data-text=""
            key={i}
            className={cn(
              /，|。|？|·/.test(item) && "!-px-1.5 !-mx-2",
              annotationKeys.includes(item) &&
                "underline-animation char_annotation",
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
        "prose-h1": props.type === "h1" ? "" : undefined,
        "prose-p": props.type === "p" ? "" : undefined,
        className: cn(
          "pinyin",
          `pinyin_${TagName}`,
          props.align === "left" ? "text-left" : "text-center",
          props.retract && "pinyin_retract",
          props.pinyin && "pinyin_show",
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

export const defaultProps = {
  align: "center",
} satisfies Partial<Props>;

export default PinYinText;
