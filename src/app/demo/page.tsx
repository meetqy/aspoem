"use client";

import { Timeline } from "~/components/timeline";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function Page() {
  const { data } = api.author.timeline.useQuery();

  const authors = data?.data;

  return (
    <div className="container m-auto flex h-screen">
      <div className="w-72 bg-muted"></div>
      <div className="flex-1 overflow-y-auto">
        <div className="m-auto grid max-w-screen-md grid-cols-2 gap-4 p-4">
          {authors?.map((item, i) => (
            <div
              className="cursor-pointer space-y-8 rounded-md border border-border/40 bg-card px-4 pb-4 transition-all hover:border-border hover:shadow-lg"
              key={item.id}
            >
              {i % 6 === 0 ? (
                <div className="text-outline-muted mt-8 flex h-24 w-full items-center justify-center rounded-full bg-muted text-7xl uppercase shadow-inner">
                  MOCK
                </div>
              ) : (
                <div className="text-outline-muted mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-muted text-7xl uppercase shadow-inner">
                  <span className="-mt-2">{item.name[0]}</span>
                </div>
              )}

              <div className="w-full">
                <h1 className="text-3xl font-bold capitalize text-primary">
                  mock a Name
                </h1>
                <p className="text-foreground/80">Pin Yin</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  this is description, this is description,this is description
                </p>
              </div>

              <div className="grid w-full grid-cols-3 border-t border-border pt-4">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">223</span>
                  <span className="text-sm text-muted-foreground">Age</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">223</span>
                  <span className="text-sm text-muted-foreground">Prod</span>
                </div>
              </div>

              <Button className="w-full" variant="secondary">
                Follow
              </Button>
            </div>
          ))}
          {/* <Timeline
            events={
              authors?.map((item) => {
                return {
                  icon: item._count.poems,
                  title: item.name,
                  description: item.introduce,
                  buttonText: "查看详情",
                };
              }) ?? []
            }
          /> */}
        </div>
      </div>
    </div>
  );
}
