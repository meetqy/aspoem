import { notFound } from "next/navigation";
import AuthorPage from "../../page";

export async function generateMetadata({
  params,
}: {
  params?: { page: string };
}) {
  const pageIndex = Number(params?.page ?? 1);

  if (pageIndex < 1 || isNaN(pageIndex)) return notFound();

  return {
    title: `诗人列表 第${pageIndex}页 - 现代化中国诗词学习网站`,
  };
}

export default AuthorPage;
