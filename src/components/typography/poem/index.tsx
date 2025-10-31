import type { Poem } from '@prisma/client'
import { RubyTextGrid } from '../ruby-text-grid'

type TypographyPoemProps = Omit<Poem, 'id' | 'createdAt' | 'updatedAt' | 'authorSlug' | 'titleSlug' | 'dynastySlug'>

export function TypographyPoem(poem: TypographyPoemProps) {
  return (
    <>
      <h1 className="text-7xl text-center tracking-widest font-bold">
        {/* <RubyText
          classNames={
            { rt: 'text-[0.3em]' }
          }
          text={poem.title}
          pinyin={poem.titlePinyin}
        /> */}
      </h1>
      <p className="mt-6 text-3xl text-center tracking-[0.25em] text-foreground/90">
        {/* <RubyText
          classNames={
            { rt: 'text-[0.65em]' }
          }
          text={poem.dynasty}
          pinyin={poem.dynastyPinyin}
        />
        ·
        <RubyText
          classNames={
            { rt: 'text-[0.65em]' }
          }
          text={poem.author}
          pinyin={poem.authorPinyin}
        /> */}
      </p>

      <div className="mt-8 text-4xl tracking-widest text-center leading-[1.75] text-foreground/80">
        {poem.paragraphs.map((paragraph, index) => (
          <p key={index} className="mt-6">
            <RubyTextGrid
              classNames={{
                rt: 'text-[0.5em]',
              }}
              text={paragraph}
              pinyin={poem.paragraphsPinyin[index]!}
            />
          </p>
        ))}
      </div>
    </>
  )
}
