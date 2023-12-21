import { notFound } from "next/navigation";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { id: string } }) {
  const poem = await api.poem.findById.query(Number(params.id));

  if (!poem) {
    return notFound();
  }

  return (
    <article className="prose-2xl prose m-auto mt-12 text-center">
      <h1
        style={{
          WebkitTextStrokeWidth: 1,
          WebkitTextStrokeColor: "oklch(var(--bc))",
          color: "transparent",
        }}
      >
        {poem.title}
      </h1>
      <p>
        <span className="font-light">唐</span> ·{" "}
        <span
          className="bg-gradient-to-tr from-primary via-current to-secondary bg-clip-text"
          style={{
            WebkitTextFillColor: "transparent",
          }}
        >
          {poem.author.name}
        </span>
      </p>
      <div className="tracking-widest">
        {poem.content.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </article>
  );
}
