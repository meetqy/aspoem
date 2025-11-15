import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { RubyText } from "./ruby-text";

const variants = cva("text-5xl", {
  variants: {
    font: {
      cursive: "font-cursive",
      sans: "font-sans",
    },
    pinyin: {
      default: "leading-[2em]",
      hidden: "leading-[1.5em]",
    },
  },
  defaultVariants: {
    font: "cursive",
    pinyin: "default",
  },
});

const pinyinSizeMap: Record<
  NonNullable<VariantProps<typeof variants>["font"]>,
  string
> = {
  cursive: "text-[0.5em]",
  sans: "text-[0.6em]",
};

export const PoemTypographyTitle = ({
  text,
  pinyin,
  font = "cursive",
  pinyinVisible,
}: {
  text: string;
  pinyin: string;
  font?: VariantProps<typeof variants>["font"];
  pinyinVisible?: boolean;
}) => {
  font = font || "cursive";

  return (
    <RubyText
      as="h1"
      text={text}
      pinyin={pinyin}
      className={cn(
        variants({ pinyin: pinyinVisible ? "default" : "hidden", font }),
      )}
      classNames={{
        pinyin: cn(pinyinSizeMap[font]),
      }}
      pinyinVisible={pinyinVisible}
    />
  );
};
