"use client";

import React from "react";
import { CheckboxGroup } from "@nextui-org/checkbox";

import TagGroupItem from "./tag-group-item";

export default function TagGroupGilter() {
  return (
    <div className="my-auto flex max-w-lg flex-col gap-2">
      <h3 className="text-medium font-medium leading-8 text-default-600">
        Amenities
      </h3>
      <CheckboxGroup
        aria-label="Select amenities"
        className="gap-1"
        orientation="horizontal"
      >
        <TagGroupItem icon="solar:home-wifi-angle-bold" value="wifi">
          Wifi
        </TagGroupItem>
        <TagGroupItem icon="solar:fridge-bold" value="kitchen">
          Kitchen
        </TagGroupItem>
        <TagGroupItem icon="solar:washing-machine-bold" value="washer">
          Washer
        </TagGroupItem>
        <TagGroupItem
          icon="solar:washing-machine-minimalistic-bold"
          value="dryer"
        >
          Dryer
        </TagGroupItem>
        <TagGroupItem icon="solar:tv-bold" value="tv">
          TV
        </TagGroupItem>
        <TagGroupItem icon="solar:wheel-bold" value="free_parking">
          Free Parking
        </TagGroupItem>
        <TagGroupItem icon="solar:swimming-bold" value="pool">
          Pool
        </TagGroupItem>
        <TagGroupItem icon="solar:treadmill-bold" value="gym">
          Gym
        </TagGroupItem>
        <TagGroupItem icon="solar:bath-bold" value="spa">
          Spa
        </TagGroupItem>
        <TagGroupItem icon="solar:sun-bold" value="beachfront">
          Beachfront
        </TagGroupItem>
        <TagGroupItem icon="solar:cat-bold" value="pet_friendly">
          Pet Friendly
        </TagGroupItem>
      </CheckboxGroup>
    </div>
  );
}
