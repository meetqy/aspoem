"use client";

import * as Tabs from "@radix-ui/react-tabs";

export default function Page() {
  return (
    <Tabs.Root
      className="shadow-blackA2 flex w-[300px] flex-col shadow-[0_2px_10px]"
      defaultValue="tab1"
    >
      <Tabs.List
        className="border-mauve6 flex shrink-0 border-b"
        aria-label="Manage your account"
      >
        <Tabs.Trigger
          className="text-mauve11 hover:text-violet11 data-[state=active]:text-violet11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none outline-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
          value="tab1"
        >
          Account
        </Tabs.Trigger>
        <Tabs.Trigger
          className="text-mauve11 hover:text-violet11 data-[state=active]:text-violet11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none outline-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
          value="tab2"
        >
          Password
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
}
