import data from '../../../chinese-poetry-master/蒙学/zhuzijiaxun.json'
import { createMdContent } from '../create-md'

export async function syncZhuzijiaxun() {
    try {
        createMdContent({
            title: data.title,
            paragraphs: data.paragraphs,
            author: data.author,
            dynasty: '明末清初',
            tags: ['蒙学'],
        })

        console.log(`朱子家訓同步完成: 1 个章节已导入`)
    }
    catch (error) {
        console.error('朱子家訓同步失败:', error)
        throw error
    }
}
