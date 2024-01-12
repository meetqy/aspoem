"use client";

import { api } from "~/trpc/react";

export default function Page() {
  const { data } = api.author.timeline.useQuery();

  const authors = data?.data;

  return (
    <div className="container m-auto flex h-screen">
      <div className="w-72"></div>
      <div className="flex-1 overflow-y-auto">
        <div className="m-auto grid max-w-screen-md grid-cols-2 gap-8 py-4">
          {authors?.map((item) => (
            <div
              key={item.id}
              className="cursor-pointe cursor-pointer overflow-hidden rounded-md border border-border/40 px-4 pb-8 transition-all hover:border-border hover:shadow-lg"
            >
              <div className="text-outline-muted mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-muted text-7xl uppercase shadow"></div>

              <div className="mt-4 w-full">
                <h1 className="text-4xl font-bold uppercase text-foreground">
                  {item.name}
                  <span className="ml-2 font-mono text-base font-normal capitalize text-foreground/80">
                    {item.namePinYin}
                  </span>
                </h1>
                <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                  {item.introduce || "暂未完善"}
                </p>
              </div>

              <div className="my-8 flex justify-center">
                <div className="h-[1px] w-36 bg-muted"></div>
              </div>

              <div className="grid w-full grid-cols-3">
                <div className="flex flex-col items-center justify-center border-r border-border/40">
                  <span className="font-mono text-2xl font-bold text-blue-500">
                    {item._count.poems}
                  </span>
                  <span className="text-sm text-muted-foreground">作品</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="font-mono text-2xl font-bold">
                    {item.birthDate && item.deathDate
                      ? item.deathDate - item.birthDate
                      : "?"}
                  </span>
                  <span className="text-sm text-muted-foreground">享年</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="flex flex-col space-y-4">
  <div className="w-full flex-1 rounded-md border border-border/40 p-4 transition-all hover:shadow-lg">
    <div className="flex items-center">
      <div className="h-24 w-24 rounded-full bg-muted"></div>
      <div className="ml-4">
        <h1 className="text-2xl text-primary">Mock A Name</h1>
        <p className="capitalize text-foreground/80">pin yin</p>
      </div>
    </div>
    <p className="mt-4 text-sm text-muted-foreground">
      this is description, this is description,this is description
    </p>
    <div className="mt-4 grid w-full grid-cols-3">
      <div className="flex flex-col items-center justify-center">
        <span className="text-2xl">223</span>
        <span className="text-sm text-muted-foreground">Age</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="text-2xl">223</span>
        <span className="text-sm text-muted-foreground">Prod</span>
      </div>
    </div>
  </div>

</div>; */
}
