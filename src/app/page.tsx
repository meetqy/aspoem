import { api } from "~/trpc/server";

export default async function Home() {
  const poems = await api.poem.find.query();

  return (
    <div>
      {poems.map((poem) => (
        <div
          key={poem.id}
          dangerouslySetInnerHTML={{
            __html: poem.content.replace(/\n/g, "<br />"),
          }}
        ></div>
      ))}
    </div>
  );
}
