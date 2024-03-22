import { api } from "~/trpc/server";
import PreviewPrint from "./components/preview-print";

export default async function Page({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;

  const poem = await api.poem.findById.query({
    id: Number(id),
  });

  if (!poem) return null;

  return <PreviewPrint poem={poem} />;
}
