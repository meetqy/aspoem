import Root from "../root";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Root lang="zh-Hans" languageComponent={false}>
      {children}
    </Root>
  );
}
