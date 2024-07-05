import React from "react";

import CardReview from "./card-review";
import reviews from "./reviews";

export default function TwoColumnsReviews() {
  return (
    <section className="mx-auto w-full px-4 mt-4">
      <div className="grid grid-cols-1 gap-4 ">
        {reviews.concat(reviews).map((review, index) => (
          <CardReview key={index} {...review} />
        ))}
      </div>
    </section>
  );
}
