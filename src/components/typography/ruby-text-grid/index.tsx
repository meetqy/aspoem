import { cn_symbol } from '@/lib/constants'
import { cn } from '@/lib/utils'
import './index.css'

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

/**
 * 适用于五言、七言诗
 * @param param0
 */
export function RubyTextGrid({ text, pinyin, className, classNames }: RubyTextProps) {
  const chars = text.split('')
  const pinyinArray = pinyin.split(' ')

  return (
    <>
      <ruby className={cn('ruby-text-grid flex', className)}>
        {chars.map((char, index) => {
          const charPinyin = pinyinArray[index] || ''
          const flex = cn_symbol.includes(char) ? '0.25' : '1'

          return (
            <span
              className={cn('wrapper', classNames?.wrapper)}
              key={index}
              style={{ flex }}
            >
              <span className={cn('char', classNames?.char)}>
                {char}
              </span>
              <rp>(</rp>
              <rt className={cn('rt', {
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
    </>
  )
}
