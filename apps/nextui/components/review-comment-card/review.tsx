"use client";

import React from "react";
import { Button, Chip, Image, User } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export type ReviewType = {
  user: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  rating: number;
  title: string;
  content: string;
};

export type ReviewProps = React.HTMLAttributes<HTMLDivElement> & ReviewType;

const Review = React.forwardRef<HTMLDivElement, ReviewProps>(
  ({ children, user, title, content, rating, createdAt, ...props }, ref) => (
    <div ref={ref} {...props}>
      <div className="w-full">
        <p className="text-large font-medium">
          {title}{" "}
          <span className="font-normal text-small text-default-500 ml-2">
            唐·李白
          </span>
        </p>
        <p className="mt-1">
          宫粉雕痕，仙云堕影，无人野水荒湾。
          <br />
          古石埋香，金沙锁骨连环。
          <br />
          南楼不恨吹横笛，恨晓风、千里关山。
          <br />
          半飘零，庭上黄昏，月冷阑干。
        </p>
      </div>
      <Image
        alt=""
        className="mt-4 border-small shadow-medium max-h-96"
        src="https://r2.aspoem.com/aspoem/2256-6a905ab9fc3.png"
      />
      <div className="flex items-center gap-2 mt-4">
        <Chip color="primary" variant="flat">
          唐诗三百首
        </Chip>
        <Chip color="primary" variant="flat">
          水调歌头
        </Chip>
      </div>
    </div>
  )
);

Review.displayName = "Review";

export default Review;
