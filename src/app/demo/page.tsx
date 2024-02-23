"use client";

import { Verse } from "./verse";

export default function A() {
  return (
    <div className="m-auto max-w-screen-md">
      <div className="space-y-4">
        <Verse
          variant="title"
          content="今天是星期五·怎么说？"
          py="jīn tiān shì xīng qī wǔ . zen me shuo ?"
        />
        <Verse content={"现代·李小龙"} className="!mb-8" />
        <Verse
          variant="shi"
          content={"虢国夫人承主恩，平明骑马入宫门。"}
          py={"guó guó fū rén chéng zhǔ ēn , píng míng qí mǎ rù gōng mén ."}
          annotation={{
            虢国夫人: "杨贵妃三姊的封号。",
            承: "接受。",
            平明: "早晨。",
          }}
        />
        <Verse
          variant="shi"
          content={"却嫌脂粉污颜色，澹扫峨眉朝至尊。"}
          py={"què xián zhī fěn wū yán sè , dàn sǎo é méi zhāo zhì zūn ."}
        />
      </div>

      <br />
      <br />

      <div>
        <Verse variant="title" content="今天是星期五·怎么说？" />
        <Verse content={"现代·李小龙"} className="mb-6 mt-4" />
        <Verse
          variant="shi"
          content={"虢国夫人承主恩，平明骑马入宫门。"}
          annotation={{
            虢国夫人: "杨贵妃三姊的封号。",
            承: "接受。",
            平明: "早晨。",
          }}
        />
        <Verse variant="shi" content={"却嫌脂粉污颜色，澹扫峨眉朝至尊。"} />
      </div>

      <br />
      <br />

      <div>
        <Verse variant="title" content="怎么说？" />
        <Verse content={"现代·李小龙"} className="mb-6 mt-4" />
        <Verse variant="shi" content="嫁得瞿塘贾，朝朝误妾期。" />
        <Verse variant="shi" content="早知潮有信，嫁与弄潮儿。" />
      </div>
    </div>
  );
}
