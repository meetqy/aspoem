'use client'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="h-svh border-r" {...props}>
      <SidebarHeader>
        Left Sidebar
      </SidebarHeader>
      <SidebarContent>

      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
