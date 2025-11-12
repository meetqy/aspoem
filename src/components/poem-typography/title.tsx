import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { RubyText } from "./ruby-text";

const variants = cva("text-3xl @md/poem:text-4xl", {
  variants: {
    font: {
      cursive: "font-cursive",
      sans: "font-sans",
      // sans: "font-sans text-2xl @md/poem:text-3xl tracking-[0.15em] leading-[1.5em]",
    },
    pinyin: {
      default: "tracking-[0.15em] leading-[2em]",
      hidden: "tracking-[0.05em] leading-[1.5em]",
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
