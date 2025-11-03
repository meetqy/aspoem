import { Icon } from '@iconify/react'
import Link from 'next/link'
import { CommandSearch } from '@/components/header/cmdk'
import { Menu } from '@/components/header/menu'
import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full h-16">
      <div className="container-wrapper flex items-center justify-between h-full gap-4">
        <div className="lg:w-2/3 flex items-center">
          <Button asChild className="flex items-center" variant="ghost" size="icon-lg">
            <Link href="/">
              <LogoIcon className="size-6" />
            </Link>
          </Button>

          <Menu className="ml-2 lg:block hidden" />
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
