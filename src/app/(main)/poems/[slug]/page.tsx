import { RubyText } from '@/components/typography/poem/ruby-text'
import { Sidebar, SidebarContent, SidebarProvider } from '@/components/ui/sidebar'

const poem = {
  title: '直中書省',
  titlePinyin: 'Zhí Zhōng Shū Shěng',
  author: '白居易',
  authorPinyin: 'Bái Jū yì',
  dynasty: '唐',
  dynastyPinyin: 'Táng',
  paragraphs: [
    '絲綸閣下文章靜，鐘鼓樓中刻漏長。',
    '獨坐黃昏誰是伴，紫薇花對紫薇郎。',
  ],
  paragraphsPinyin: [
    'Sī Lún Gé Xià Wén Zhāng Jìng ， Zhōng Gǔ Lóu Zhōng Kè Lòu Cháng 。',
    'Dú Zuò Huáng Hūn Shuí Shì Bàn ， Zǐ Wēi Huā Duì Zǐ Wēi Láng 。',
  ],
  annotation: {
    紫薇花: '落葉亞喬木，夏季開紅紫色的花，秋天花謝。',
    絲綸閣: '指替皇帝撰擬詔書的閣樓。',
    刻漏: '古時用來滴水計時的器物。',
    紫微郎: '唐代官名，指中書舍人，因中書省曾改名紫微省，取天文紫微垣為義，故稱。',
  },
}

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SidebarProvider className="container mx-auto">
        <Sidebar side="left" className="sticky top-[4rem] h-[calc(100vh-4rem)] !border-none">
          <aside className="size-full text-center">left</aside>
        </Sidebar>

        <SidebarContent>
          <main className="max-w-screen-md mx-auto w-full py-12" style={{ fontFamily: 'cursive' }}>
            {/* <h1 className="text-7xl text-center tracking-widest font-bold">
              <RubyText className="text-[0.3em]" text={poem.title} pinyin={poem.titlePinyin} />
            </h1>
            <p className="mt-6 text-3xl text-center tracking-[0.25em] text-foreground/90">
              <RubyText className="text-[0.65em]" text={poem.dynasty} pinyin={poem.dynastyPinyin} />
              ·
              <RubyText className="text-[0.65em]" text={poem.author} pinyin={poem.authorPinyin} />
            </p> */}

            <div className="mt-8 text-4xl tracking-widest text-center leading-[1.75] text-foreground/80">
              {poem.paragraphs.map((paragraph, index) => (
                <p key={index} className="mt-6">
                  <RubyText
                    classNames={{
                      rt: 'text-[0.5em]',
                    }}
                    text={paragraph}
                    pinyin={poem.paragraphsPinyin[index]!}
                  />
                </p>
              ))}
            </div>
          </main>
        </SidebarContent>

        <Sidebar side="right" className="sticky !border-none top-[4rem] h-[calc(100vh-4rem)]">
          <aside className="size-full text-center">right</aside>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}
