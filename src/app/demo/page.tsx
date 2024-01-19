"use client";

import PinYinText from "../(.)/poem/[id]/components/PinYinText";

export default function Page() {
  return (
    <>
      <PinYinText
        text={`夜来雨。赖倩得、东风吹住。海棠正妖娆处。且留取。`}
        pinyin={`yè lái yǔ . lài qiàn dé . dōng fēng chuī zhù . hǎi táng zhèng yāo ráo chù . qiě liú qǔ . `}
        annotation={{
          赖: "依靠",
          倩: "请、托",
          住: "停止，不动了。",
          妖娆: `妖媚艳丽。形容景色异常艳丽。 一作“娇饶“。`,
          处: "时候，季节",
        }}
      />

      <PinYinText
        text={`悄庭户。试细听、莺啼燕语。分明共人愁绪。怕春去。`}
        pinyin={`qiāo tíng hù . shì xì tīng . yīng tí yàn yǔ . fēn míng gòng rén chóu xù . pà chūn qù . `}
        annotation={{
          莺啼燕语: "莺啼婉转，燕语呢喃。形容春光明媚。",
        }}
      />
    </>
  );
}
