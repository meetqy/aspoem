"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ReadSetting() {
  const loader = useTopLoader();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Card className="bg-gradient-to-r from-accent/50 to-transparent shadow-none">
      <CardHeader>
        <CardTitle>阅读设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 简繁体切换 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="traditional-switch" className="flex-1">
            简体/繁体
          </Label>
          <Switch id="traditional-switch" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="font-switch" className="flex-1">
            楷体/宋体
          </Label>
          <Switch
            id="font-switch"
            onCheckedChange={(checked) => {
              loader.start();
              router.replace(`?font=${checked ? "sans" : "cursive"}`);
            }}
          />
        </div>

        {/* 拼音标注 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="pinyin-switch" className="flex-1">
            拼音标注
          </Label>
          <Switch
            id="pinyin-switch"
            onCheckedChange={(checked) => {
              loader.start();
              router.replace(checked ? `?py=1` : pathname);
            }}
          />
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
  );
}
