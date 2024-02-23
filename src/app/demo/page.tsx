"use client";

import VerseShi from "../(.)/poem/[id]/components/verse/shi/verse-shi";

export default function A() {
  return (
    <div className="m-auto max-w-screen-md">
      <div className="space-y-4">
        <VerseShi
          content={"虢国夫人承主恩，平明骑马入宫门。"}
          py={"guó guó fū rén chéng zhǔ ēn , píng míng qí mǎ rù gōng mén ."}
          annotation={{
            虢国夫人: "杨贵妃三姊的封号。",
            承: "接受。",
            平明: "早晨。",
          }}
        />
        <VerseShi
          content={"却嫌脂粉污颜色，澹扫峨眉朝至尊。"}
          py={"què xián zhī fěn wū yán sè , dàn sǎo é méi zhāo zhì zūn ."}
        />
      </div>

      <br />
      <br />

      <div>
        <VerseShi
          content={"虢国夫人承主恩，平明骑马入宫门。"}
          annotation={{
            虢国夫人: "杨贵妃三姊的封号。",
            承: "接受。",
            平明: "早晨。",
          }}
        />
        <VerseShi content={"却嫌脂粉污颜色，澹扫峨眉朝至尊。"} />
      </div>

      <br />
      <br />

      <div>
        <VerseShi content="嫁得瞿塘贾，朝朝误妾期。" />
        <VerseShi content="早知潮有信，嫁与弄潮儿。" />
      </div>
    </div>
  );
}
