import type { ReviewType } from "./review";

import React from "react";

import { cn } from "@/utils/cn";

import Review from "./review";

export type CardReviewProps = React.HTMLAttributes<HTMLDivElement> & ReviewType;

const CardReview = React.forwardRef<HTMLDivElement, CardReviewProps>(
  ({ className, ...review }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-content1 hover:bg-content2/50 transition-colors p-5 border-b-small rounded-none cursor-pointer",
        className
      )}
    >
      <Review {...review} />
    </div>
  )
);

CardReview.displayName = "CardReview";

export default CardReview;
