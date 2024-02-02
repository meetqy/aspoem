import { notFound } from "next/navigation";
import IndexPage from "../../page";

export async function generateMetadata({
  params,
}: {
  params?: { page: string };
}) {
  const pageIndex = Number(params?.page ?? 1);

  if (pageIndex < 1 || isNaN(pageIndex)) return notFound();

  return {
    title: `诗词列表 第${pageIndex}页`,
  };
}

export default IndexPage;
