"use client";

import React from "react";
import { Button, Chip, User } from "@nextui-org/react";
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
        <p className="text-default-900 font-medium text-large">{title}</p>
        <p className="text-default-500 mt-2 mb-4">唐·李白</p>
        <p className="text-default-600">
          宫粉雕痕，仙云堕影，无人野水荒湾。
          <br />
          古石埋香，金沙锁骨连环。
          <br />
          南楼不恨吹横笛，恨晓风、千里关山。
          <br />
          半飘零，庭上黄昏，月冷阑干。
        </p>
      </div>
      <div className="flex items-center gap-2 mt-8">
        {Array.from({ length: 5 }, (_, i) => {
          return (
            <Chip variant="dot" key={i} color="default">
              数据
            </Chip>
          );
        })}
      </div>
    </div>
  )
);

Review.displayName = "Review";

export default Review;
