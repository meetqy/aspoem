"use client";

import React from "react";
import { Chip, User } from "@nextui-org/react";

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
              name: "Li Bai",
            }}
            classNames={{
              name: "font-medium",
              description: "text-small",
            }}
            description={"Li Bai"}
            name={"唐·李白"}
          />
        </div>
        <div className="flex items-center gap-1">
          <Chip color="primary">53</Chip>
        </div>
      </div>
      <div className="mt-4 w-full">
        <p className="mt-2 text-default-500 line-clamp-3">
          {content || children}
        </p>
      </div>
    </div>
  )
);

Review.displayName = "Review";

export default Review;
