import { cn_symbol } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface RubyTextProps {
  text: string
  pinyin: string
  className?: string
  classNames?: {
    wrapper?: string
    char?: string
    rt?: string
  }
}

export function RubyText({ text, pinyin, className, classNames }: RubyTextProps) {
  const chars = text.split('')
  const pinyinArray = pinyin.split(' ')

  return (
    <ruby className={cn('ruby-text poem', className)}>
      {chars.map((char, index) => {
        const charPinyin = pinyinArray[index] || ''
        const flex = cn_symbol.includes(char) ? '0.25' : '1'

        return (
          <span
            className={cn('flex aspect-square relative justify-center', classNames?.wrapper)}
            key={index}
            style={{ flex }}
          >
            <span className={cn('leading-none pt-5', classNames?.char)}>
              {char}
            </span>
            <rp>(</rp>
            <rt className={cn('font-light absolute lowercase text-muted-foreground font-sans leading-none tracking-normal', {
              'opacity-0': cn_symbol.includes(char),
            }, classNames?.rt)}
            >
              {charPinyin}
            </rt>
            <rp>)</rp>
          </span>
        )
      })}
    </ruby>
  )
}
