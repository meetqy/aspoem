"use client";

import React from "react";
import {
  Avatar,
  Button,
  Input,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

import { AcmeLogo } from "./acme";
import { sectionItemsWithTeams } from "./sidebar-items";
import SidebarDrawer from "./sidebar-drawer";

import Sidebar from "./sidebar";

import MarketplaceCard from "../marketplace-card";

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
export default function SidebarOffCanvasResponsive({
  children,
  title,
}: {
  children: React.ReactNode;
  title: React.ReactNode | string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();
  const currentPath = pathname.split("/")?.[1] || "/";

  const content = (
    <div className="relative flex h-full w-72 flex-1 flex-col p-6">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
          <AcmeLogo className="text-background" />
        </div>
        <span className="text-small font-bold uppercase text-foreground">
          Acme
        </span>
      </div>
      <Spacer y={8} />
      <div className="flex items-center gap-3 px-3">
        <Avatar
          isBordered
          size="sm"
          src="https://i.pravatar.cc/150?u=a04258114e29026708c"
        />
        <div className="flex flex-col">
          <p className="text-small font-medium text-default-600">John Doe</p>
          <p className="text-tiny text-default-400">Product Designer</p>
        </div>
      </div>

      <Spacer y={8} />

      <Sidebar
        defaultSelectedKey="/"
        items={sectionItemsWithTeams}
        selectedKeys={[currentPath]}
      />

      <Spacer y={8} />
      <div className="mt-auto flex flex-col">
        <Button
          fullWidth
          className="justify-start text-default-500 data-[hover=true]:text-foreground"
          startContent={
            <Icon
              className="text-default-500"
              icon="solar:info-circle-line-duotone"
              width={24}
            />
          }
          variant="light"
        >
          Help & Information
        </Button>
        <Button
          className="justify-start text-default-500 data-[hover=true]:text-foreground"
          startContent={
            <Icon
              className="rotate-180 text-default-500"
              icon="solar:minus-circle-line-duotone"
              width={24}
            />
          }
          variant="light"
        >
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex container mx-auto max-w-screen-xl min-h-dvh">
      <SidebarDrawer
        className="!border-r-small border-divider sticky top-0 left-0 h-dvh"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        {content}
      </SidebarDrawer>
      <div className="w-full flex-1 flex-col border-r border-divider">
        <header className="flex h-16 items-center gap-2 border-b-small border-divider px-4">
          <Button
            isIconOnly
            className="flex md:hidden"
            size="sm"
            variant="light"
            onPress={onOpen}
          >
            <Icon
              className="text-default-500"
              height={24}
              icon="solar:hamburger-menu-outline"
              width={24}
            />
          </Button>

          {/* header */}
          {typeof title === "string" ? (
            <h2 className="text-medium font-medium text-default-700">
              {title}
            </h2>
          ) : (
            title
          )}
        </header>
        <main className="h-full w-full overflow-visible p-4">
          <div className="flex min-h-screen w-full flex-col gap-4">
            {children}
          </div>
        </main>
      </div>

      <aside className="w-80 xl:flex hidden py-4 pl-8 sticky top-0 h-screen gap-8 flex-col">
        <Input size="lg" placeholder="Command + K Search..." />

        <MarketplaceCard title="标签推荐" />
        <MarketplaceCard title="诗人推荐" />
        <MarketplaceCard title="词牌名推荐" />
      </aside>
    </div>
  );
}
