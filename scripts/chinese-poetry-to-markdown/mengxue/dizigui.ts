import { Dynasty } from '@/types'

import dataDizigui from '../../../chinese-poetry-master/蒙学/dizigui.json'
import { createMdContent } from '../create-md'

export async function syncDizigui() {
  try {
    const _author = {
      name: '李毓秀',
      dynasty: Dynasty.清,
    }

    // 遍历弟子规的各个章节
    await Promise.all(
      dataDizigui.content.map(async (chapter) => {
        return createMdContent({
          title: chapter.chapter,
          paragraphs: chapter.paragraphs,
          author: _author.name,
          dynasty: _author.dynasty,
          tags: ['蒙学'],
        })
      }),
    )

    console.log(`弟子规同步完成: ${dataDizigui.content.length} 个章节已导入`)
  }
  catch (error) {
    console.error('弟子规同步失败:', error)
    throw error
  }
}
