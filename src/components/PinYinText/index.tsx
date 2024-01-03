import { cn } from "~/utils";
import "./index.css";

interface Props {
  text: string;
  pinyin?: string;
  type?: "h1" | "p";
  stroke?: boolean;
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
      className={cn(
        "pinyin",
        props.stroke ? "text-stroke-base-100" : "",
        `pinyin_${TagName}`,
        props.showPinYin ? "" : "no-pinyin",
        props.className,
      )}
    >
      {text.map((item, i) => (
        <span
          data-text=""
          key={item}
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
