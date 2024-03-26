import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
    await prisma.poem.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.author.deleteMany();

    // Seed data for the Author model
    const author1 = await prisma.author.create({
        data: {
            name: '李白',
            namePinYin: 'Li Bai',
            introduce: '李白（701年－762年），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。',
            birthDate: 701,
            deathDate: 762,
            dynasty: '唐代',
        },
    });

    const author2 = await prisma.author.create({
        data: {
            name: '杜甫',
            namePinYin: 'Du Fu',
            introduce: '杜甫（712年－770年），字子美，唐代现实主义诗人，与李白合称"李杜"。',
            birthDate: 712,
            deathDate: 770,
            dynasty: '唐代',
        },
    });

    // Seed data for the Tag model
    const tag1 = await prisma.tag.create({
        data: {
            name: '山水',
            name_zh_Hant: '山水',
            introduce: '以描写自然风景为主题的诗歌。',
        },
    });

    const tag2 = await prisma.tag.create({
        data: {
            name: '抒情',
            name_zh_Hant: '抒情',
            introduce: '抒发内心情感的诗歌。',
        },
    });

    // Seed data for the Poem model
    const poem1 = await prisma.poem.create({
        data: {
            title: '静夜思',
            titlePinYin: 'Jing Ye Si',
            content: '床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。',
            contentPinYin: 'Chuang qian ming yue guang,\n yi shi di shang shuang. \nJu tou wang ming yue, \ndi tou si gu xiang.',
            author: {
                connect: { id: author1.id },
            },
            tags: {
                connect: [{ id: tag2.id }],
            },
        },
    });

    const poem2 = await prisma.poem.create({
        data: {
            title: '春望',
            titlePinYin: 'Chun Wang',
            content: '国破山河在，\n城春草木深。\n感时花溅泪，\n恨别鸟惊心。\n烽火连三月，\n家书抵万金。\n白头搔更短，\n浑欲不胜簪。',
            contentPinYin: 'Guo po shan he zai, \ncheng chun cao mu shen. \nGan shi hua jian lei, \nhen bie niao jing xin. Feng huo lian san yue, \njia shu di wan jin. \nBai tou sao geng duan, \nhun yu bu sheng zan.',
            author: {
                connect: { id: author2.id },
            },
            tags: {
                connect: [{ id: tag1.id }, { id: tag2.id }],
            },
        },
    });

    console.log('Database seeded successfully');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });