"use client";

import type { CardProps } from "@nextui-org/react";

import React from "react";
import { ReviewCommentCard } from "@/components/review-comment-card";

export default function Component(props: CardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-8">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_) => {
        return <ReviewCommentCard key={_} />;
      })}
    </div>
  );
}
