"use client";

import type { CardProps } from "@nextui-org/react";

import React from "react";
import { Card, Image, CardBody, Chip } from "@nextui-org/react";

export default function DismissableCard2(props: CardProps) {
  return (
    <Card className="w-full cursor-pointer" {...props}>
      <CardBody className="flex flex-row flex-wrap p-0 md:flex-nowrap">
        <Image
          removeWrapper
          alt="Acme Creators"
          className="h-auto lg:w-1/3 flex-none object-cover object-top"
          src="https://r2.aspoem.com/aspoem/2256-6a905ab9fc3.png"
        />
        <div className="px-4 py-5 flex flex-col justify-between">
          <div>
            <h3 className="text-large font-medium">游山西村</h3>
            <p className="mt-1 mb-3 text-default-500">宋 · 陆游</p>
            <div className="flex flex-col text-default-700">
              <p>莫笑农家腊酒浑，丰年留客足鸡豚。</p>
              <p>山重水复疑无路，柳暗花明又一村。</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-8">
            <Chip color="primary" variant="flat">
              唐诗三百首
            </Chip>
            <Chip color="primary" variant="flat">
              陆游集
            </Chip>
            <Chip color="secondary" variant="flat">
              宋朝诗人集选
            </Chip>
            <Chip color="warning" variant="flat">
              我是歌手第二季
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
