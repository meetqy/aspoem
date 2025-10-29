import { Icon } from '@iconify/react'
import Link from 'next/link'
import { CommandSearch } from '@/components/header/cmdk'
import { Menu } from '@/components/header/menu'
import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="h-16 bg-background/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-full">
        <div className="w-2/3 flex items-center gap-4">
          <Button asChild className="flex items-center" variant="ghost" size="icon-lg">
            <Link href="/">
              <LogoIcon className="size-8" />
            </Link>
          </Button>
          <Menu />
        </div>

        <div className="flex-1 flex justify-end gap-4 items-center">
          <CommandSearch />

          <Button asChild variant="ghost" size="icon">
            <Link href="https://github.com/meetqy/aspoem" target="_blank" rel="noopener noreferrer">
              <Icon className="size-6" icon="mdi:github" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
