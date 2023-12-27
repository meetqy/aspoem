import { notFound } from "next/navigation";
import CardItem from "~/app/_components/CardItem";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { page: string } }) {
  const { data: poems } = await api.poem.find.query({
    page: Number(params.page),
  });

  if (!poems || poems.length === 0) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-4 gap-4 py-4">
      {poems.map((poem) => (
        <CardItem key={poem.id} href={`/poem/${poem.id}`} text={poem.title} />
      ))}
    </div>
  );
}
