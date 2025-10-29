import type { PoemData, PoemFrontmatter } from './types'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import matter from 'gray-matter'
import { PoemFrontmatterSchema } from './types'

const POEMS_DIR = join(process.cwd(), 'poems')

// 存储所有诗歌元数据的全局变量，在构建时填充一次
let allPoemsMetadata: PoemFrontmatter[] | null = null

// 用于获取所有诗歌的 slug
export async function getPoemSlugs(): Promise<string[]> {
  const slugs: string[] = []
  const walk = async (dir: string) => {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      }
      else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        const relativePath = relative(POEMS_DIR, fullPath)
        const slug = relativePath.replace(/\.mdx$/, '').replace(/\.md$/, '') // 例如 'tang/li-bai/jing-ye-si'
        slugs.push(slug)
      }
    }
  }

  await walk(POEMS_DIR)
  return slugs
}

// 获取所有诗歌的元数据 (在构建时运行一次)
export async function getAllPoemsMetadata(): Promise<PoemFrontmatter[]> {
  if (allPoemsMetadata) {
    return allPoemsMetadata // 如果已加载，直接返回缓存
  }

  const slugs = await getPoemSlugs()
  const metadataPromises = slugs.map(async (slug) => {
    const filePath = join(POEMS_DIR, `${slug}.mdx`)
    const fileContent = await readFile(filePath, 'utf8')
    const { data } = matter(fileContent) // 提取 Frontmatter

    try {
      // 使用 Zod 验证 Frontmatter
      const validatedFrontmatter = PoemFrontmatterSchema.parse(data)
      return validatedFrontmatter
    }
    catch (error) {
      console.error(`Error validating frontmatter for ${filePath}:`, error)
      // 根据你的策略，可以选择抛出错误，或返回一个带有错误标记的对象，或跳过此文件
      throw new Error(`Invalid frontmatter in ${filePath}: ${error}`)
    }
  })

  const allMetadata = await Promise.all(metadataPromises)
  allPoemsMetadata = allMetadata
  return allMetadata
}

// 获取单首诗歌的完整数据 (Frontmatter + 原始 MDX 内容)
export async function getPoemBySlug(slug: string): Promise<PoemData | undefined> {
  const filePath = join(POEMS_DIR, `${slug}.mdx`)
  try {
    const fileContent = await readFile(filePath, 'utf8')
    const { data, content } = matter(fileContent) // content 是原始 MDX 字符串

    const validatedFrontmatter = PoemFrontmatterSchema.parse(data)

    return {
      ...validatedFrontmatter,
      slug,
      content, // 原始 MDX 内容
    }
  }
  catch (error) {
    console.error(`Error getting poem data for ${slug}:`, error)
    return undefined
  }
}
