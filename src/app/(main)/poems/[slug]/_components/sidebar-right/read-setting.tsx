import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function ReadSetting() {
  return (
    <Card className="bg-gradient-to-r from-accent/50 to-transparent shadow-none">
      <CardHeader>
        <CardTitle>阅读设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 简繁体切换 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="traditional-switch" className="flex-1">
            简/繁体切换
          </Label>
          <Switch id="traditional-switch" />
        </div>

        {/* 拼音标注 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="pinyin-switch" className="flex-1">
            拼音标注
          </Label>
          <Switch id="pinyin-switch" />
        </div>

        {/* 原文注解 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="annotation-switch" className="flex-1">
            原文注解
          </Label>
          <Switch id="annotation-switch" />
        </div>
      </CardContent>
    </Card>
  )
}
