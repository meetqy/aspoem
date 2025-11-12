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
      hidden: "tracking-[-0.1em] leading-[1.75em]",
    },
  },
  defaultVariants: {
    font: "cursive",
    pinyin: "default",
  },
});

export const PoemTypographyContent = ({
  font = "cursive",
  paragraphs,
  paragraphsPinyin,
  pinyinVisible,
  annotation,
}: {
  paragraphs: string[];
  paragraphsPinyin: string[];
  annotation?: Record<string, string>;
  font?: VariantProps<typeof variants>["font"];
  pinyinVisible?: boolean;
}) => {
  font = font || "cursive";

  return (
    <div
      className={cn(
        variants({ pinyin: pinyinVisible ? "default" : "hidden", font }),
      )}
    >
      {paragraphs.map((paragraph, index) => (
        <RubyText
          key={index}
          as="p"
          className={cn("text-inherit")}
          text={paragraph}
          pinyin={paragraphsPinyin[index]!}
          pinyinVisible={pinyinVisible}
          annotation={annotation}
          classNames={{
            symbol: "lg:after:inline after:flex",
          }}
        />
      ))}
    </div>
  );
};
