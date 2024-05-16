"use client";

import { Select, SelectItem } from "@nextui-org/react";

export default function Page() {
  return (
    <div className="flex justify-between flex-1 items-center">
      <span className="text-large font-medium">诗文列表</span>
      <Select
        aria-label="Sort by"
        className="w-48"
        defaultSelectedKeys={["most_recent"]}
      >
        <SelectItem key="most_recent" value="most_recent">
          Most recent
        </SelectItem>
        <SelectItem key="most_helpful" value="most_helpful">
          Most helpful
        </SelectItem>
        <SelectItem key="highest_rating" value="highest_rating">
          Highest rating
        </SelectItem>
      </Select>
    </div>
  );
}
