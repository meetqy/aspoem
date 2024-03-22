import { api } from "~/trpc/server";

export default function Page({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;

  const poem = api.poem.findById.query({
    id: Number(id),
  });

  return <div>{searchParams.id}</div>;
}
