import { cn } from "~/utils";
import "./index.css";

interface Props {
  text: string;
  pinyin?: string;
  type?: "h1" | "p";
  outline?: boolean;
  showPinYin?: boolean;
  className?: string;
}

const noShowChar = ["."];

export default function PinYinText(props: Props) {
  const TagName = props.type ?? "p";
  const pinyin = props.pinyin?.split(" ") ?? [];
  const text = props.text.split("");

  return (
    <TagName
      {...{
        "prose-h1": props.type === "h1" ? "" : undefined,
        "prose-p": props.type === "p" ? "" : undefined,
        className: cn(
          "pinyin",
          props.outline ? "text-outline" : "",
          `pinyin_${TagName}`,
          props.showPinYin ? "" : "no-pinyin",
          props.className,
        ),
      }}
    >
      {text.map((item, i) => (
        <span
          data-text=""
          key={i}
          className={cn(/，|。|？|·/.test(item) ? "!-px-1.5 !-mx-2" : "")}
        >
          {item}
          {!noShowChar.includes(pinyin[i] ?? "") && (
            <span data-pinyin="">{pinyin[i]}</span>
          )}
        </span>
      ))}
    </TagName>
  );
}

PinYinText.defaultProps = {
  showPinYin: true,
} as Partial<Props>;
