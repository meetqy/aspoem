"use client";

import type { CardProps } from "@nextui-org/react";

import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Link,
  cn,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function Component(props: CardProps) {
  return (
    <div className="lg:gap-6 gap-4 grid grid-cols-1 lg:mt-8 mt-4 lg:px-0 px-4 max-w-screen-sm w-full mx-auto">
      {Array.from({ length: 20 }).map((_, i) => (
        <Card key={i} className="p-3" shadow="md">
          <CardHeader className="flex flex-col items-start gap-2 pb-6">
            <h2 className="text-large font-medium">林逋</h2>
            <p className="text-medium text-default-500">
              林逋，北宋隐逸诗人，隐居西湖孤山，以梅鹤为伴，自谓“梅妻鹤子”。其诗歌反映隐居生活，苏轼赞其诗歌澄浃峭特。宋仁宗赐谥“和靖先生”，留有《林和靖诗集》。现杭州西湖孤山有“放鹤亭”和“林和靖先生墓”纪念之。
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="gap-8">
            <p className="flex items-baseline gap-1 pt-2">
              <span className="inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text text-4xl font-semibold leading-7 tracking-tight text-transparent">
                lín bū
              </span>
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-2">
                <Icon className="text-primary" icon="ci:check" width={24} />
                <p className="text-default-500">
                  <span className="text-primary">唐朝</span> 著名诗人
                </p>
              </li>
              <li className="flex items-center gap-2">
                <Icon className="text-primary" icon="ci:check" width={24} />
                <p className="text-default-500">
                  一生作诗 <span className="text-primary">999</span> 首
                </p>
              </li>
              <li className="flex items-center gap-2">
                <Icon className="text-primary" icon="ci:check" width={24} />
                <p className="text-default-500">
                  被誉为 <span className="text-primary">诗仙</span>
                </p>
              </li>
              <li className="flex items-center gap-2">
                <Icon className="text-primary" icon="ci:check" width={24} />
                <p className="text-default-500">
                  陆游自言{" "}
                  <span className="text-primary">“六十年间万首诗”</span>
                  ，是中国历史上自作诗留存最多的诗人。
                </p>
              </li>
            </ul>
          </CardBody>
          <CardFooter>
            <Button fullWidth as={Link} color={"default"} variant={"flat"}>
              了解更多
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
