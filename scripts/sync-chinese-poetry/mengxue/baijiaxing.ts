import { Dynasty } from '@/types'

import dataBaijiaxing from '../../../chinese-poetry-master/蒙学/baijiaxing.json'
import { createMdContent } from '../create-md'

export async function syncBaijiaxing() {
  const _author = {
    name: '佚名',
    dynasty: Dynasty.北宋,
  }

  createMdContent({
    title: '百家姓',
    paragraphs: dataBaijiaxing.paragraphs,
    author: _author.name,
    dynasty: _author.dynasty,
  })
}
