import { type MetadataRoute } from "next";
import { api } from "~/trpc/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const counts = await api.poem.count.query();

  const totalPage = Math.ceil(counts / 12);

  return new Array(totalPage).fill(0).map((_, index) => ({
    url: `https://aspoem.com/list/${index + 1}`,
  }));
}
