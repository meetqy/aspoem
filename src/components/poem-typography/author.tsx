import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { RubyText } from "./ruby-text";

const variants = cva("text-3xl @md/poem:text-4xl", {
  variants: {
    font: {
      cursive: "font-cursive",
      //   sans: "font-sans text-2xl @md/poem:text-3xl tracking-[0.15em] leading-[1.5em]",
      sans: "font-sans",
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

export const PoemTypographyAuthor = ({
  dynasty,
  dynastyPinyin,
  author,
  authorPinyin,
  font = "cursive",
  pinyinVisible,
}: {
  dynasty?: string;
  dynastyPinyin?: string;
  author: string;
  authorPinyin: string;
  font?: VariantProps<typeof variants>["font"];
  pinyinVisible?: boolean;
}) => {
  font = font || "cursive";

  return (
    <p className="text-center flex items-center justify-center">
      {dynasty && dynastyPinyin && (
        <>
          <RubyText
            className={variants({
              font,
              pinyin: pinyinVisible ? "default" : "hidden",
            })}
            classNames={{
              pinyin: "text-base",
            }}
            as="span"
            text={`[${dynasty}]`}
            pinyin={` ${dynastyPinyin} `}
            pinyinVisible={pinyinVisible}
          />
          <span className={cn(pinyinVisible ? "mx-2" : "mx-1")}></span>
        </>
      )}
      <RubyText
        classNames={{
          pinyin: "text-base",
        }}
        className={variants({
          font,
          pinyin: pinyinVisible ? "default" : "hidden",
        })}
        as="span"
        text={author}
        pinyin={authorPinyin}
        pinyinVisible={pinyinVisible}
      />
    </p>
  );
};
