import data from '../../../chinese-poetry-master/蒙学/qianziwen.json'
import { createMdContent } from '../create-md'

export async function syncQianziwen() {
  try {
    // 遍历每个分类下的所有章节
    createMdContent({
      title: data.title,
      paragraphs: data.paragraphs,
      author: data.author,
      dynasty: '南北',
      tags: ['蒙学'],
    })

    console.log(`千字文同步完成: 1 篇文章已导入`)
  }
  catch (error) {
    console.error('千字文同步失败:', error)
    throw error
  }
}
