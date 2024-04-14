import { createApi } from "unsplash-js";
import { type Random } from "unsplash-js/dist/methods/photos/types";

export const unsplash = createApi({
  accessKey: "gLWHfOhV8pF7J3Hj1_2GKHtpt0pAvFdTkkrMIMzj3Bg",
});

export const getRandom = async () => {
  const res = await unsplash.photos.getRandom({
    count: 100,
    collectionIds: ["wallpapers", "nature", "textures-patterns"],
  });

  const result = res.response as Random[];

  return result.map((item) => item.urls.regular);
};
