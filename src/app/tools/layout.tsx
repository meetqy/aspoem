import { type Metadata } from "next";
import Root from "../root";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

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
