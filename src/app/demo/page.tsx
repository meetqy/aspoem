"use client";

import Poems from "../(.)/author/[id]/components/poems";

export default function Page() {
  return (
    <div className="container m-auto">
      <Poems authorId={1} />
    </div>
  );
}
