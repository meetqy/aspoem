"use client";

import type { CardProps } from "@nextui-org/react";

import React from "react";
import { Card, Image, CardBody } from "@nextui-org/react";

export default function Component(props: CardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 ">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
        return (
          <Card key={item} className="w-full" radius="none" {...props}>
            <CardBody className="flex flex-row flex-wrap p-0 lg:flex-nowrap">
              <Image
                removeWrapper
                radius="none"
                alt="Acme Creators"
                className="h-auto w-full flex-none object-cover object-top lg:w-48"
                src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/hero-card-complete.jpeg"
              />
              <div className="px-4 py-5">
                <h3 className="text-large font-medium">
                  Become an Acme Creator!
                </h3>
                <div className="flex flex-col gap-3 pt-2 text-small text-default-400">
                  <p>
                    Visit creators.acme.com to sign up today and start earning
                    credits from your fans and followers.
                  </p>
                  <p>Tag1, Tag2, Tag3</p>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
