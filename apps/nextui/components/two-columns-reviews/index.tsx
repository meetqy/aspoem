import React from "react";

import CardReview from "./card-review";
import reviews from "./reviews";

export default function TwoColumnsReviews() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:px-0 px-4 max-w-screen-lg mx-auto">
      {reviews.map((review, index) => (
        <CardReview key={index} {...review} />
      ))}
    </section>
  );
}
