"use client";

import { api } from "~/trpc/react";

export default function Client() {
  const { data } = api.poem.updateHant.useQuery({
    id: 2235,
    content: "尚有綈袍贈，應憐範叔寒。\n不知天下士，猶作布衣看。",
    title: "詠史",
    annotation:
      '{"尚有":"尚且還有。","綈 袍":"用粗絲綢做成的長袍。","憐":"同情。","範叔":"範雎，字叔。戰國時期的範雎。由於須賈告狀，他被毒打得幾乎死去，後來逃到秦國當了宰相。須賈來秦，他特意以貧窮的面貌去相見，須賈送綈袍給他禦寒，他感到須賈還有故人之情，就寬恕須賈。出自《史記·範睢蔡澤列傳》。","天下士":"天下豪傑之士。","猶作":"還當作。","布衣":"指普通老百姓。"}',
    translation:
      "像須賈這樣的小人尚且有贈送綈袍的舉動，可見範雎的貧寒是多麽惹人同情。\n現在的人不了解像範雎這樣的天下治世賢才，只把他當成凡夫俗子看待。",
  });

  return <div>client: {JSON.stringify(data)}</div>;
}
