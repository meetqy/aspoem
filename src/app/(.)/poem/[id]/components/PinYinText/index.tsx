import { cn } from "~/utils";
import "./index.css";

interface Props {
  text: string;
  pinyin?: string;
  type?: "h1" | "p";
  align?: "center" | "left";
}

const noShowChar = ["."];

export default function PinYinText(props: Props) {
  const TagName = props.type ?? "p";
  const pinyinArray = props.pinyin?.split(" ") ?? [];
  const text = props.text.split("");

  const PinYin = ({ children }: { children: React.ReactNode }) => {
    return (
      <span data-pinyin="" className="!font-normal text-muted-foreground">
        {children}
      </span>
    );
  };

  return (
    <TagName
      {...{
        "prose-h1": props.type === "h1" ? "" : undefined,
        "prose-p": props.type === "p" ? "" : undefined,
        className: cn(
          "pinyin",
          `pinyin_${TagName}`,
          props.align === "left" && "pinyin_p--left",
          props.align === "center" && "pinyin_p--center",
          props.pinyin && "pinyin_show",
        ),
      }}
    >
      {TagName === "p" && props.align === "left" && (
        <>
          <span data-text className="opacity-0">
            空
          </span>
          <span data-text className="opacity-0">
            空
          </span>
        </>
      )}
      {text.map((item, i) => (
        <span
          data-text=""
          key={i}
          className={cn(/，|。|？|·/.test(item) ? "!-px-1.5 !-mx-2" : "")}
        >
          {item}
          {!noShowChar.includes(pinyinArray[i] ?? "") && (
            <PinYin>{pinyinArray[i]}</PinYin>
          )}
        </span>
      ))}
    </TagName>
  );
}

PinYinText.defaultProps = {
  align: "center",
} as Partial<Props>;
