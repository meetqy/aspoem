import { CalendarIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface Author {
  id: string
  name: string
  namePinYin: string
  dynasty: string
  birthDate?: number
  deathDate?: number
  introduce?: string
  epithets?: string[] // 称号，如 "诗仙"
  style?: string // 风格特色
  _count: {
    poems: number
  }
}

interface AuthorCardProps {
  author: Author
}

export function AuthorCard({ author }: AuthorCardProps) {
  const lifespan = `${author.birthDate || '?'}年—${author.deathDate || '?'}年`

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* 作者头像 */}
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {author.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            {/* 作者姓名 */}
            <div>
              <h3 className="text-xl font-semibold">{author.name}</h3>
              <p className="text-sm text-muted-foreground">{author.namePinYin}</p>
            </div>

            {/* 生卒年/朝代 */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{lifespan}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{author.dynasty}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 文学地位/称号 */}
        {author.epithets && (
          <div className="flex items-center gap-2">
            {author.epithets.map(item => (
              <Badge key={item} variant="secondary" className="text-sm">
                {item}
              </Badge>
            ))}
          </div>
        )}

        {/* 核心风格/创作特色 */}
        {author.style && (
          <div>
            <p className="text-sm text-muted-foreground">创作特色</p>
            <p className="text-sm">{author.style}</p>
          </div>
        )}

        {/* 作者简介 */}
        {author.introduce && (
          <div>
            <p className="text-sm text-muted-foreground">简介</p>
            <p className="text-sm line-clamp-3">{author.introduce}</p>
          </div>
        )}

      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/author/${author.id}`}>
            <UserIcon />
            进入主页
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
