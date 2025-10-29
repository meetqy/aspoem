import { NavigationMenuLink, NavigationMenuList } from '@radix-ui/react-navigation-menu'
import Link from 'next/link'
import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem } from '@/components/ui/navigation-menu'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="h-16 bg-background/90 backdrop-blur-md">
        <div className="container flex items-center h-full">
          <Button asChild className="flex items-center" variant="ghost" size="icon-lg">
            <Link href="/">
              <LogoIcon className="size-6" />
            </Link>
          </Button>

          <div className="flex-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/docs">推荐</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

      </header>
      <main>{children}</main>
    </div>
  )
}
