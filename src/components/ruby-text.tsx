import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn_symbol } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface RubyTextProps {
  text: string
  pinyin: string
  annotation?: Record<string, string>
  className?: string
  classNames?: {
    symbol?: string
    char?: string
    pinyin?: string
  }
  as?: React.ElementType
}

export function RubyText({ text, pinyin, className, classNames, as: Component = 'p', annotation }: RubyTextProps) {
  const pinyinArray = pinyin.split(' ')

  // 检查当前字符是否是注释词汇的开始
  const isAnnotatedWord = (index: number) => {
    if (!annotation)
      return null

    for (const [word, meaning] of Object.entries(annotation)) {
      const wordAtIndex = text.slice(index, index + word.length)
      if (wordAtIndex === word) {
        return { word, meaning, length: word.length }
      }
    }
    return null
  }

  const renderCharacter = (char: string, index: number) => {
    const annotatedWord = isAnnotatedWord(index)

    if (annotatedWord) {
      // 如果是注释词汇的开始，用 Popover 包装
      return (
        <Popover key={index}>
          <PopoverTrigger asChild>
            <span className="cursor-help relative inline-flex leading-normal">
              {annotatedWord.word.split('').map((wordChar, wordIndex) => (
                <ruby key={`${index}-${wordIndex}`}>
                  <span className={cn('pl-[0.2em] text-primary', classNames?.char)}>
                    {wordChar}
                  </span>
                  <rp>(</rp>
                  <rt className={cn('font-sans text-muted-foreground tracking-normal lowercase text-[0.5em] font-light', classNames?.pinyin)}>
                    {pinyinArray[index + wordIndex]}
                  </rt>
                  <rp>)</rp>
                </ruby>
              ))}
              {/* 添加下划线提示 */}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/50" />
            </span>
          </PopoverTrigger>
          <PopoverContent className="text-base !max-w-xs w-auto font-sans py-2 -top-4">
            {annotatedWord.meaning}
          </PopoverContent>
        </Popover>
      )
    }

    // 检查当前字符是否在某个注释词汇中间（跳过渲染）
    if (annotation) {
      for (const word of Object.keys(annotation)) {
        for (let i = 1; i < word.length; i++) {
          if (index >= i && text.slice(index - i, index - i + word.length) === word) {
            return null // 跳过渲染
          }
        }
      }
    }

    // 渲染普通字符
    if (cn_symbol.includes(char)) {
      return (
        <span className={cn('tracking-normal text-[0.75em] font-sans', classNames?.symbol)} key={index}>
          {char}
        </span>
      )
    }

    return (
      <ruby key={index}>
        <span className={cn('pl-[0.2em]', classNames?.char)}>{char}</span>
        <rp>(</rp>
        <rt className={cn('font-sans text-muted-foreground tracking-normal lowercase text-[0.5em] font-light', classNames?.pinyin)}>
          {pinyinArray[index]}
        </rt>
        <rp>)</rp>
      </ruby>
    )
  }

  return (
    <Component className={cn('text-center tracking-[0.2em] transition-all select-none', className)}>
      {text.split('').map((char, index) => renderCharacter(char, index)).filter(Boolean)}
    </Component>
  )
}
