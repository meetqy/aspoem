import type { ApiPoemFindDetail } from "@/server/api/router/poem";
import { PoemTypographyArticle } from "./article";
import { PoemTypographyOrderliness } from "./orderliness";

export const PoemTypography = ({ poem }: { poem: ApiPoemFindDetail }) => {
  if (poem.isOrderliness) {
    return <PoemTypographyOrderliness poem={poem} />;
  }

  return <PoemTypographyArticle poem={poem} />;
};
