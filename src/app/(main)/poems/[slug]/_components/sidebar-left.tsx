'use client'

import { ArrowDownAzIcon, ChevronRight, CirclePlusIcon, DicesIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface SidebarItem { title: string, icon?: React.ElementType, url: string, defaultOpen?: boolean, isActive?: boolean, items?: SidebarItem[] }

const items: SidebarItem[] = [
  { title: '朝代', url: '#', defaultOpen: true, items: [
    { title: '唐 18k', url: '#' },
    { title: '宋 20000', url: '#' },
    { title: '元 55002', url: '#' },
    { title: '明 239291', url: '#' },
    { title: '清 1230102', url: '#' },
    { title: '更多...', url: '#' },
  ] },
  { title: '体裁', url: '#', defaultOpen: true, items: [
    { title: '五言绝句', url: '#' },
    { title: '七言绝句', url: '#' },
    { title: '五言律诗', url: '#' },
    { title: '七言律诗', url: '#' },
    { title: '词', url: '#' },
    { title: '古体诗', url: '#' },
    { title: '更多......', url: '#' },
  ] },
]

const discover: SidebarItem[] = [
  { title: '热门诗人', icon: StarIcon, url: '#' },
  { title: '最新收录', icon: CirclePlusIcon, url: '#' },
  { title: '随机诗词', icon: DicesIcon, url: '#' },
  { title: '诗词排行榜', icon: ArrowDownAzIcon, url: '#' },
]

export function SidebarLeft() {
  return (
    <Sidebar collapsible="none" className="bg-transparent h-[calc(100vh-4rem)] sticky top-[4rem] w-64 hidden xl:block">
      <ScrollArea className="h-full">
        <SidebarContent className="gap-0 py-12">
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>发现</SidebarGroupLabel>
            <SidebarMenu>
              {discover.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarMenu>
            {items.map(item => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <b>{item.title}</b>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map(subItem => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url} className="w-full flex justify-between">
                              {subItem.title.split(' ').map((part, index) => (
                                <span
                                  key={index}
                                  className={cn({
                                    'text-sm text-muted-foreground': index === 1,
                                  })}
                                >
                                  {part}
                                </span>
                              ))}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  )
}
