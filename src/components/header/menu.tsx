'use client'

import Link from 'next/link'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/', label: '推荐' },
  { href: '/poems', label: '诗文' },
  { href: '/authors', label: '诗人' },
  { href: '/quotes', label: '名句' },
  { href: '/ai-generator', label: 'AI 作诗' },
  { href: '/games', label: '游戏' },
]

export function Menu({ className}: { className?: string }) {
  const isMobile = useIsMobile()

  return (
    <NavigationMenu viewport={isMobile} className={cn('w-full', className)}>
      <NavigationMenuList className="flex-wrap">
        {menuItems.map(item => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href={item.href}>{item.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
