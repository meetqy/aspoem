import { createApi } from "unsplash-js";
import { type Random } from "unsplash-js/dist/methods/photos/types";

export const unsplash =
  process.env.UNSPLASH_ACCESS_KEY &&
  createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
  });

export const getRandom = async () => {
  if (unsplash) {
    const res = await unsplash.photos.getRandom({
      count: 30,
    });

    const result = res.response as Random[];

    return result.map((item) => item.urls.regular);
  }
};
