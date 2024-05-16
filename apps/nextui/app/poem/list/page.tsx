"use client";

import type { CardProps } from "@nextui-org/react";

import React from "react";

import { Card, CardBody, CardFooter } from "@nextui-org/react";

function MarketplaceCard(props: CardProps & { title?: string }) {
  return (
    <Card
      shadow="none"
      className="border-b-small border-divider rounded-none bg-background"
      {...props}
    >
      <CardBody className="px-4 pb-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex max-w-[80%] flex-col gap-1">
            <p className="text-large">{props.title}</p>
            <p className="text-small text-default-500 font-normal">唐·白居易</p>
          </div>
        </div>
        <p className="pt-4 text-small text-default-600">
          Build the next generation of web experiences with the fastest and most
          reliable hosting for modern applications.
        </p>
      </CardBody>
      <CardFooter className="justify-between gap-2"></CardFooter>
    </Card>
  );
}

export default function Component(props: CardProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <MarketplaceCard title="标签推荐" />
      <MarketplaceCard title="标签推荐" />
      <MarketplaceCard title="标签推荐" />
      <MarketplaceCard title="标签推荐" />
      <MarketplaceCard title="标签推荐" />
      <MarketplaceCard title="标签推荐" />
    </div>
  );
}
