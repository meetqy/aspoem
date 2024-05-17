"use client";

import type { CardProps } from "@nextui-org/react";

import React from "react";
import { Button, Card, Image, CardBody, Chip } from "@nextui-org/react";

export default function DismissableCard(props: CardProps) {
  return (
    <Card className="w-full" {...props}>
      <CardBody className="flex flex-col p-0">
        <Image
          removeWrapper
          alt="Acme Creators"
          className="h-auto w-full max-h-96 rounded-b-none aspect-[4/3] object-cover"
          src="https://images.unsplash.com/photo-1549675584-91f19337af3d?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <div className="flex flex-col p-4">
          <h3 className="text-large">离歌辞五首·其二</h3>
          <p className="text-default-500 mt-1 mb-3">唐·李白</p>
          <p className="text-default-600">
            朝日城南路，旌旗照绿芜。
            <br />
            使君何处去，桑下觅罗敷。
          </p>
          <p className="gap-1 flex flex-wrap mt-4 text-small">
            <span className="text-default-500">宋词</span>,
            <span className="text-default-500">五言绝句</span>,
            <span className="text-primary">唐诗三百首</span>
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
