import { type MetadataRoute } from "next";
import { api } from "~/trpc/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const poems = await api.poem.sitemap.query();

  return poems.map((poem) => ({
    url: `https://aspoem.com/poem/${poem.id}`,
  }));
}
