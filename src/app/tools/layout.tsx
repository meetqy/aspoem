import Root from "../root";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Root lang="zh-Hans" languageComponent={false}>
      {children}
    </Root>
  );
}
