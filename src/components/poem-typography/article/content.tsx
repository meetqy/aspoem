import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn_symbol } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ApiPoemFindDetail } from "@/server/api/router/poem";

export const PoemTypographyContent = ({
  poem,
  pinyinVisible,
  annotationVisible = false,
}: {
  poem: ApiPoemFindDetail;
  pinyinVisible: boolean;
  annotationVisible?: boolean;
}) => {
  // 提取拼音渲染组件
  const RubyPinyin = ({ pinyin, char }: { pinyin: string; char: string }) => {
    if (!pinyinVisible) return null;
    // 如果是中文符号,不显示拼音
    if (cn_symbol.includes(char)) return null;

    return (
      <>
        <rp>(</rp>
        <rt className="text-[0.5em] font-sans font-light text-muted-foreground">
          {pinyin}
        </rt>
        <rp>)</rp>
      </>
    );
  };

  // 检查当前字符是否是注释词汇的开始
  const isAnnotatedWord = (paragraphIndex: number, charIndex: number) => {
    if (!poem.annotation) return null;

    const paragraph = poem.paragraphs[paragraphIndex]!;

    for (const [word, meaning] of Object.entries(poem.annotation)) {
      const wordAtIndex = paragraph.slice(charIndex, charIndex + word.length);
      if (wordAtIndex === word) {
        return { word, meaning, length: word.length };
      }
    }
    return null;
  };

  // 检查当前字符是否在某个注释词汇中间
  const isInsideAnnotatedWord = (paragraphIndex: number, charIndex: number) => {
    if (!poem.annotation) return false;

    const paragraph = poem.paragraphs[paragraphIndex]!;

    for (const word of Object.keys(poem.annotation)) {
      for (let i = 1; i < word.length; i++) {
        if (
          charIndex >= i &&
          paragraph.slice(charIndex - i, charIndex - i + word.length) === word
        ) {
          return true;
        }
      }
    }
    return false;
  };

  return poem.paragraphs.map((paragraph, paragraphIndex) => {
    const py = poem.paragraphsPinyin[paragraphIndex]!.split(" ");

    return (
      <p
        key={paragraphIndex}
        style={{
          lineBreak: "strict",
        }}
      >
        {paragraph.split("").map((char, charIndex) => {
          // 检查是否是注释词汇的开始
          const annotatedWord = isAnnotatedWord(paragraphIndex, charIndex);

          if (annotatedWord) {
            // 渲染注释词汇
            return (
              <Popover
                key={charIndex}
                open={annotationVisible ? undefined : false}
              >
                <PopoverTrigger asChild>
                  <span
                    className={cn("relative inline-block leading-normal", {
                      "cursor-help": annotationVisible,
                    })}
                  >
                    {annotatedWord.word.split("").map((wordChar, wordIndex) => (
                      <ruby key={wordIndex}>
                        {wordChar}
                        <RubyPinyin
                          pinyin={py[charIndex + wordIndex]!}
                          char={wordChar}
                        />
                      </ruby>
                    ))}
                    {/* 添加下划线提示 */}
                    {annotationVisible && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/50" />
                    )}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="text-base !max-w-xs w-auto font-sans py-2">
                  {annotatedWord.meaning}
                </PopoverContent>
              </Popover>
            );
          }

          // 检查是否在注释词汇中间（跳过渲染）
          if (isInsideAnnotatedWord(paragraphIndex, charIndex)) {
            return null;
          }

          // 渲染普通字符
          return (
            <ruby key={charIndex}>
              {char}
              <RubyPinyin pinyin={py[charIndex]!} char={char} />
            </ruby>
          );
        })}
      </p>
    );
  });
};
