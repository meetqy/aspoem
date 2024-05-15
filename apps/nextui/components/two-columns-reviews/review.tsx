"use client";

import React from "react";

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
        <p className="font-medium text-default-900">登金陵凤凰台</p>
        <p
          className="mt-2 text-default-500"
          dangerouslySetInnerHTML={{
            __html: `凤凰台上凤凰游，凤去台空江自流。<br/>吴宫花草埋幽径，晋代衣冠成古丘。`,
          }}
        ></p>
      </div>
    </div>
  )
);

Review.displayName = "Review";

export default Review;
