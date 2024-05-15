import React from "react";

import CardReview from "./card-review";
import reviews from "./reviews";

export default function TwoColumnsReviews() {
  return (
    <section className="mx-auto w-full max-w-6xl md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reviews.map((review, index) => (
          <CardReview key={index} {...review} />
        ))}
      </div>
    </section>
  );
}
