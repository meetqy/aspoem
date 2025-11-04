import data from '../../../chinese-poetry-master/蒙学/sanzijing-traditional.json'
import { createMdContent } from '../create-md'

export async function syncSanzijing() {
  try {
    // 遍历每个分类下的所有章节
    createMdContent({
      title: `${data.title} (傳統版)`,
      paragraphs: data.paragraphs,
      author: data.author,
      dynasty: '南宋到清末',
      tags: ['蒙学'],
    })

    console.log(`三字经同步完成: 1 篇文章已导入`)
  }
  catch (error) {
    console.error('三字经同步失败:', error)
    throw error
  }
}
