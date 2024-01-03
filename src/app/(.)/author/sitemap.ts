import { type MetadataRoute } from "next";
import { api } from "~/trpc/server";
import { getBaseUrl } from "~/trpc/shared";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await api.author.sitemap.query();

  return data.map((item) => ({
    url: `${getBaseUrl()}/poem/${item.id}`,
    lastModified: new Date(item.updatedAt ?? "2024-01-01"),
  }));
}
