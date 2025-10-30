import { Dynasty } from '@/types'

import data from '../../chinese-poetry-master/论语/lunyu.json'

import { createMdContent } from './create-md'

const _author = {
  name: '孔子及其弟子',
  dynasty: Dynasty.春秋,
}

export async function syncLunyu() {
  Promise.all(
    data.map(poem =>
      createMdContent({
        title: poem.chapter,
        paragraphs: poem.paragraphs,
        author: _author.name,
        dynasty: _author.dynasty,
      }),
    ),
  ).then(() => {
    console.log('论语同步完成', 'chinese-poetry-master/论语/lunyu.json')
  })
}
