import { type Author, type Poem } from "@prisma/client";

export const getPoemTitle = (poem: Poem & { author: Author }) => {
  return `${poem.title}-${poem.author.dynasty}·${poem.author.name} 拼音、注解、译文/白话文`;
};
