import fs from 'fs-extra'
import { createMdContent } from './create-md'

const { readJsonSync, readdirSync } = fs

export function syncQuantangshi() {
    try {
        // 读取全唐诗目录
        const files = readdirSync('chinese-poetry-master/全唐诗')
        const targetFiles = files.filter(file => file.startsWith('poet') || file.startsWith('唐诗三百首'))

        let totalPoems = 0
        let successCount = 0
        let skippedCount = 0

        console.log(`开始处理全唐诗，共 ${targetFiles.length} 个文件`)

        for (let i = 0; i < targetFiles.length; i++) {
            const file = targetFiles[i]!
            console.log(`[${i + 1}/${targetFiles.length}] 处理文件: ${file}`)

            try {
                const poems = readJsonSync(`chinese-poetry-master/全唐诗/${file}`)

                for (const poem of poems) {
                    totalPoems++
                    try {
                        const result = createMdContent({
                            title: poem.title,
                            author: poem.author,
                            paragraphs: poem.paragraphs,
                            dynasty: '唐',
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
        console.log('全唐诗同步完成！')
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
        console.error('全唐诗同步过程中发生错误:', error)
        throw error
    }
}
