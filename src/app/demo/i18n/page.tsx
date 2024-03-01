import { api } from "~/trpc/server";
import Client from "./client";

export default async function A() {
  const data = await api.poem.findById.query(568);
  console.log(data);

  return (
    <div>
      server: {data}
      <Client />
    </div>
  );
}
