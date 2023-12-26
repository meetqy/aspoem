import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import CardItem from "../_components/CardItem/index";

export default async function Page() {
  const poems = await api.poem.find.query();

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
