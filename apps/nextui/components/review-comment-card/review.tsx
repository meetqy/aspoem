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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User
            avatarProps={{
              src: user.avatar,
            }}
            classNames={{
              name: "font-medium",
              description: "text-small",
            }}
            description={new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(createdAt))}
            name={user.name}
          />
        </div>
      </div>
      <div className="mt-4 w-full">
        <p className="font-medium text-default-900">{title}</p>
        <p className="mt-2 text-default-500">{content || children}</p>
      </div>
      <div className="flex items-center gap-2 mt-8">
        {Array.from({ length: 5 }, (_, i) => {
          return (
            <Chip variant="dot" key={i} color="primary">
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
