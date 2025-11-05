import data from '../../chinese-poetry-master/水墨唐诗/shuimotangshi.json'

import { createMdContent } from './create-md'

export async function syncShuiMoTangShi() {
    await Promise.all(
        data.map(async poem =>
            createMdContent({
                title: poem.title,
                paragraphs: poem.paragraphs,
                author: poem.author,
                dynasty: '唐',
                tags: ['水墨唐诗'],
            }),
        ),

    )

    console.log(`水墨唐诗诗集同步完成: ${data.length} 个章节已导入`)
}
