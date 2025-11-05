import fs from 'fs-extra'
import data from '../../chinese-poetry-master/五代诗词/nantang/poetrys.json'
import { createMdContent } from './create-md'

const { readJsonSync, readdirSync } = fs

export async function syncWuDaiShiNanTang() {
    await Promise.all(
        data.map(async poem =>
            createMdContent({
                title: poem.title,
                paragraphs: poem.paragraphs,
                author: poem.author,
                dynasty: '五代',
            }),
        ),

    )

    console.log(`五代诗词同步完成: ${data.length} 个章节已导入`)
}

export function syncWuDaiShiCiHuajinji() {
    try {
        // 读取五代诗词目录
        const files = readdirSync('chinese-poetry-master/五代诗词/huajianji')
        const targetFiles = files.filter(file => !file.startsWith('huajianji-0-preface'))

        let totalPoems = 0
        let successCount = 0
        let skippedCount = 0

        console.log(`开始处理五代花间集，共 ${targetFiles.length} 个文件`)

        for (let i = 0; i < targetFiles.length; i++) {
            const file = targetFiles[i]!
            console.log(`[${i + 1}/${targetFiles.length}] 处理文件: ${file}`)

            try {
                const poems = readJsonSync(`chinese-poetry-master/五代诗词/huajianji/${file}`)

                for (const poem of poems) {
                    totalPoems++
                    try {
                        const result = createMdContent({
                            title: poem.rhythmic,
                            author: poem.author,
                            paragraphs: poem.paragraphs,
                            dynasty: '五代',
                            tags: ['花间集'],
                        })

                        if (result) {
                            successCount++
                        }
                        else {
                            skippedCount++
                        }
                    }
                    catch (error) {
                        console.error(`处理诗词失败: ${poem.title}`, error)
                        skippedCount++
                    }
                }

                console.log(`文件 ${file} 处理完成，共 ${poems.length} 首诗`)
            }
            catch (error) {
                console.error(`读取文件失败: ${file}`, error)
            }
        }

        console.log('='.repeat(50))
        console.log('五代花间集同步完成！')
        console.log(`总共处理: ${totalPoems} 首诗`)
        console.log(`成功创建: ${successCount} 首`)
        console.log(`跳过已存在: ${skippedCount} 首`)
        console.log(`处理文件数: ${targetFiles.length} 个`)
        console.log('='.repeat(50))

        return {
            total: totalPoems,
            success: successCount,
            skipped: skippedCount,
            files: targetFiles.length,
        }
    }
    catch (error) {
        console.error('五代花间集同步过程中发生错误:', error)
        throw error
    }
}
