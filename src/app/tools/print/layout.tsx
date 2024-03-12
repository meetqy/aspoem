import Root from "../../root";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Root
      lang="zh-Hans"
      languageComponent={false}
      head={
        <>
          <title>诗词打印、导出为PDF工具</title>
          <meta
            name="description"
            content="自定义打印诗词内容，可以选择译文、拼音、边框等选项，还支持将喜欢的诗词导出为PDF。"
          />
          <meta name="keywords" content="打印诗词,打印译文,打印拼音,边框" />
        </>
      }
    >
      {children}
    </Root>
  );
}
