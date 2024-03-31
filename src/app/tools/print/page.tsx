import { api } from "~/trpc/server";
import PreviewPrint from "./components/preview-print";
import { cache } from "react";

interface Props {
  searchParams: { id: string };
}

const getItem = cache(async ({ searchParams }: Props) => {
  if (searchParams.id === "null" || !searchParams.id) return null;

  return api.poem.findById.query({
    id: Number(searchParams.id),
  });
});

export async function generateMetadata(props: Props) {
  const poem = await getItem(props);

  if (!poem) {
    return {
      title: "诗词打印工具 | 现代化诗词学习网站",
      description:
        "本工具支持在线打印诗词田字格、内容、译文、拼音。允许你自由组合打印方式。",
    };
  }

  return {
    title: `诗词《${poem.title}》打印`,
    description: `诗词《${poem.title}》作者${poem.author.name}，支持在线打印诗词田字格、内容、译文、拼音。允许你自由组合打印方式。`,
  };
}

export default async function Page({ searchParams }: Props) {
  const poem = await getItem({ searchParams });

  if (!poem) return null;

  return <PreviewPrint poem={poem} />;
}
