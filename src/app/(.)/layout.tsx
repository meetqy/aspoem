import { getFont } from "~/utils/getFont";

export default function Template({ children }: { children: React.ReactNode }) {
  const { ma_shan_zheng } = getFont();

  return <div className={ma_shan_zheng.className}>{children}</div>;
}
