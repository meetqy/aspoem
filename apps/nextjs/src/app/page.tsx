import { api } from "~/trpc/server";

export const runtime = "edge";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  const hi = await api.post.hi();

  return <main className="container h-screen py-16">{hi}</main>;
}
