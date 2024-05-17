"use client";

import type { CardProps } from "@nextui-org/react";

import React from "react";
import { Card, CardBody, CardFooter, Image, cn } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function DiscountCard(props: CardProps) {
  return (
    <Card {...props} className="relative w-full max-w-[400px] pb-[200px]">
      <CardBody>
        <Image
          alt="xxx"
          src="https://images.unsplash.com/photo-1549675584-91f19337af3d?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </CardBody>
      <CardFooter
        className={cn(
          "absolute bottom-0 h-[200px] overflow-visible bg-content1 px-6 duration-300 ease-in-out transition-height"
        )}
      >
        <ul className="gap-2 grid grid-cols-1">
          <li className="mb-2">
            <h1 className="text-large font-medium">唐诗三百首</h1>
            <p className="text-default-500 line-clamp-3 mt-2 text-small">
              由NedWalsh于一九九二年春陆续输入。当时他是美国Columbia大学的博士班学生。他断断续续地学习了十年的中文，其博士论文的主题将是关于北宋时期的词。我于该年春末将全文校正一遍，并稍改Ned的格式。全本共有三百又二十首诗，原由蘅塘退士选辑，分为六卷。作者：蘅塘退士，编者：德山书生。
            </p>
          </li>
          <li className="flex items-center gap-1">
            <Icon
              className="text-default-600"
              icon="material-symbols:person-2-outline"
              width={24}
            />
            <p className="text-small text-default-500">
              诗人 <span className="text-primary font-medium">82</span> 位
            </p>
          </li>
          <li className="flex items-center gap-1">
            <Icon
              className="text-default-600"
              icon="material-symbols:article-outline"
              width={24}
            />
            <p className="text-small text-default-500">
              诗文 <span className="text-primary font-medium">302</span> 篇
            </p>
          </li>
        </ul>
      </CardFooter>
    </Card>
  );
}
