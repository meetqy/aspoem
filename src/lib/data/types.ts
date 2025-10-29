import { z } from 'zod'

// 定义 Frontmatter 的 Schema
export const PoemFrontmatterSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  dynasty: z.string(),
  authorSlug: z.string(),
  dynastySlug: z.string(),
  tags: z.array(z.string()).default([]),
  excerpt: z.string().optional(),
  // ... 其他你定义的 Frontmatter 字段
})

// 导出 TypeScript 类型
export type PoemFrontmatter = z.infer<typeof PoemFrontmatterSchema>

// 如果你需要一个完整的 Poem 数据结构 (包含 Frontmatter 和内容)，可以这样定义：
export const PoemSchema = PoemFrontmatterSchema.extend({
  slug: z.string(), // 运行时从文件路径或 Frontmatter 生成
  content: z.string(), // 原始 MDX 内容
  // structuredContent: z.object({ // 如果你进一步解析了内容结构
  //   body: z.string(),
  //   annotations: z.string().optional(),
  //   translations: z.string().optional(),
  //   appreciation: z.string().optional(),
  // }).optional(),
})

export type PoemData = z.infer<typeof PoemSchema>
