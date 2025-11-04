import data from '../../chinese-poetry-master/纳兰性德/纳兰性德诗集.json'

import { createMdContent } from './create-md'

export async function syncNalan() {
  await Promise.all(
    data.map(async poem =>
      createMdContent({
        title: poem.title,
        paragraphs: poem.para,
        author: '纳兰性德',
        dynasty: '清',
      }),
    ),

  )

  console.log(`纳兰性德诗集同步完成: ${data.length} 个章节已导入`)
}
