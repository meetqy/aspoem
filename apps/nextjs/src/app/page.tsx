import { api } from "~/trpc/server";

export default async function HomePage() {
  const v = await api.post.hello();

  console.log(v);

  return (
    <div>
      <h1>Welcome to {v}!</h1>
    </div>
  );
}
