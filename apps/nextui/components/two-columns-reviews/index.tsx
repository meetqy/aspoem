import React from "react";

import CardReview from "./card-review";
import reviews from "./reviews";

export default function TwoColumnsReviews() {
  return (
    <div className="max-w-screen-lg mx-auto lg:px-0 px-4 my-8">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
        {reviews.map((review, index) => (
          <CardReview key={index} {...review} />
        ))}
      </section>
    </div>
  );
}
