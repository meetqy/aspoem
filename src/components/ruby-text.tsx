import { cn_symbol } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface RubyTextProps {
  text: string
  pinyin: string
  className?: string
  classNames?: {
    symbol?: string
    char?: string
    pinyin?: string
  }
  as?: React.ElementType
}

export function RubyText({ text, pinyin, className, classNames, as: Component = 'p' }: RubyTextProps) {
  const pinyinArray = pinyin.split(' ')

  return (
    <Component className={cn('text-center tracking-[0.2em] transition-all', className)}>
      {text.split('').map((char, index) => cn_symbol.includes(char)
        ? <span className={cn('tracking-normal text-[0.75em] font-sans after:lg:inline after:block', classNames?.symbol)} key={index}>{char}</span>
        : (
            <ruby key={index}>
              <span className={cn('pl-[0.2em]', classNames?.char)}>{char}</span>
              <rp>(</rp>
              <rt className={cn('font-sans  select-none text-muted-foreground tracking-normal lowercase text-[0.5em] font-light', classNames?.pinyin)}>
                {pinyinArray[index]}
              </rt>
              <rp>)</rp>
            </ruby>
          ))}
    </Component>
  )
}
