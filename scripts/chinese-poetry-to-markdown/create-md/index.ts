import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import CompleteDict from '@pinyin-pro/data/complete'
import { ensureDirSync } from 'fs-extra'
import { addDict, pinyin } from 'pinyin-pro'
import { replacePunctuation, splitLine } from './format'

addDict(CompleteDict)

const POEMS_DIR = join(process.cwd(), 'poems') // 你的 MDX 诗词文件根目录

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
  // 统一转换为数组处理
  const paragraphArray = Array.isArray(paragraphs)
    ? paragraphs
    : splitLine(paragraphs) // 如果是字符串，先用 splitLine 拆分为数组

  // 处理每个段落
  const processedParagraphs = paragraphArray.flatMap((p) => {
    const line = replacePunctuation(p)
    const splitLines = splitLine(line)
    return splitLines.map(splitLine => `- ${splitLine}`)
  })

  return processedParagraphs.join('\n')
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

## 拼音

${pinyin(content, { toneType: 'num', nonZh: 'consecutive' }).replace(/-(\s)+/g, '- ').replace(/\n\s+/g, '\n')}

## 注释

## 译文

## 赏析
`
  ensureDirSync(`${POEMS_DIR}/${authorSlug}`)

  return writeFileSync(`${POEMS_DIR}/${authorSlug}/${titleSlug}.md`, str)
}
