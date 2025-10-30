import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ensureDirSync } from 'fs-extra'
import { pinyin } from 'pinyin-pro'

const POEMS_DIR = join(process.cwd(), 'poems') // 你的 MDX 诗词文件根目录
console.log(POEMS_DIR)

interface Poem {
  title: string
  paragraphs: string[] | string
  author: string
  dynasty: string
  tags?: string[]
}

function genSlug(text: string) {
  return pinyin(text, { toneType: 'none' }).replace(/\s+/g, '-').toLowerCase()
}

function escapeMarkdown(paragraphs: string | string[]) {
  const replacePunctuation = (text: string) => {
    const enSymbols = [',', '.', ';', ':', '?', '!', '"', '"', '\'', '\'', '(', ')', '[', ']', '<', '>']
    const cnSymbols = ['，', '。', '；', '：', '？', '！', '"', '"', '\'', '\'', '（', '）', '【', '】', '《', '》']

    let result = text
    enSymbols.forEach((en, i) => {
      result = result.replace(new RegExp(`\\${en}`, 'g'), cnSymbols[i]!)
    })

    return result
  }

  return Array.isArray(paragraphs)
    ? paragraphs.map((p) => {
        const line = replacePunctuation(p)
        const linePinyin = pinyin(p, { toneType: 'num' })
        return `- ${linePinyin}\n- ${line}`
      }).join('\n')
    : replacePunctuation(paragraphs)
}

export function createMdContent(poem: Poem) {
  const titleSlug = genSlug(poem.title)
  const authorSlug = genSlug(poem.author)
  const dynastySlug = genSlug(poem.dynasty)

  const content = escapeMarkdown(poem.paragraphs)

  const id = `${authorSlug}-${titleSlug}`

  const str = `---
id: ${id}
title: ${poem.title}
titleSlug: ${titleSlug}
author: ${poem.author}
authorSlug: ${authorSlug}
dynasty: ${poem.dynasty}
dynastySlug: ${dynastySlug}
tags: ${JSON.stringify(poem.tags || [])}
---

## 正文

${content}

## 注释

## 译文

## 赏析
`
  ensureDirSync(`${POEMS_DIR}/${authorSlug}`)

  return writeFileSync(`${POEMS_DIR}/${authorSlug}/${titleSlug}.md`, str)
}
