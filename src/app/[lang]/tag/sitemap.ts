import { type MetadataRoute } from "next";
import { api } from "~/trpc/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await api.tag.findMany.query({
    pageSize: 999,
    select: ["type"],
  });

  return data.map((poem) => ({
    url: `https://aspoem.com/tag/${poem.id}`,
  }));
}
