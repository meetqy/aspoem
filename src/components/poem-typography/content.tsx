import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { RubyText } from "./ruby-text";

const variants = cva("text-3xl", {
  variants: {
    font: {
      cursive: "font-cursive",
      sans: "font-sans",
    },
    pinyin: {
      default: "leading-[2em]",
      hidden: "leading-[1.75em]",
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
  annotationVisible,
}: {
  paragraphs: string[];
  paragraphsPinyin: string[];
  annotation?: Record<string, string>;
  font?: VariantProps<typeof variants>["font"];
  pinyinVisible?: boolean;
  annotationVisible?: boolean;
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
          annotationVisible={annotationVisible}
          annotation={annotation}
          classNames={{
            symbol: "lg:after:inline after:flex",
          }}
        />
      ))}
    </div>
  );
};
