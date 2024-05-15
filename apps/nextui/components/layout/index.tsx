"use client";

import React from "react";
import { ScrollShadow } from "@nextui-org/react";

import { AcmeLogo } from "./acme";
import { items } from "./sidebar-items";

import Sidebar from "./sidebar";

/**
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} />
 * ```
 */
export function SideBarLayout() {
  return (
    <div className="h-screen w-72 border-r-small border-divider p-6 sticky top-0 left-0">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
          <AcmeLogo className="text-background" />
        </div>
        <span className="text-small font-bold uppercase">Acme</span>
      </div>
      <ScrollShadow className="h-full max-h-full py-[10vh]">
        <Sidebar defaultSelectedKey="home" items={items} />
      </ScrollShadow>
    </div>
  );
}
