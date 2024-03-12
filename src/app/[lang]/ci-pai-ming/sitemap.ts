import { type MetadataRoute } from "next";
import { api } from "~/trpc/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await api.tag.sitemap.query({ type: "词牌名" });

  const totalPage = Math.ceil(data.length / 12);

  return new Array(totalPage).fill(0).map((_, index) => ({
    url: `https://aspoem.com/ci-pai-ming/${index + 1}`,
  }));
}
