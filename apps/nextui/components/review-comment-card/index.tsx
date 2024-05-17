import React from "react";

import CardReview from "./card-review";

export default function ReviewCommentCard() {
  return (
    <div className="flex flex-col gap-4">
      <CardReview
        content="Arcu dui vivamus arcu felis bibendum. Amet tellus cras adipiscing enim eu turpis egestas pretium. "
        createdAt="2021-08-01T12:00:00.000Z"
        rating={5}
        title="诗词名字-名字名字"
        user={{
          name: "John Doe",
          avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c",
        }}
      />
    </div>
  );
}
