import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import CardItem from "../_components/CardItem";

export default async function Page() {
  const poem = await api.poem.findById.query(3);

  if (!poem) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-4 gap-4 py-4">
      <CardItem href="/poem/3" text="待到重阳日逗还来就菊花啊" />
      <CardItem href="/poem/3" text="待到重阳日逗还来就菊花" />
      <CardItem href="/poem/3" text="待到重阳日逗还来就菊" />
      <CardItem href="/poem/3" text="待到重阳日逗还来就" />
      <CardItem href="/poem/3" text="待到重阳日逗还来" />
      <CardItem href="/poem/3" text="待到重阳日逗还" />
      <CardItem href="/poem/3" text="待到重阳日逗" />
      <CardItem href="/poem/3" text="待到重阳日" />
      <CardItem href="/poem/3" text="待到重阳" />
      <CardItem href="/poem/3" text="待到重" />
      <CardItem href="/poem/3" text="待到" />
      <CardItem href="/poem/3" text="待" />
    </div>
  );
}
