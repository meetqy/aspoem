"use client";

import { useAtom } from "jotai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { poemTypographyAtom } from "@/stores/poem-typography";

export function ReadSetting() {
  const [poemTypography, setPoemTypography] = useAtom(poemTypographyAtom);

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
            checked={poemTypography.font === "cursive"}
            onCheckedChange={(checked) =>
              setPoemTypography((prev) => ({
                ...prev,
                font: checked ? "cursive" : "sans",
              }))
            }
          />
        </div>

        {/* 拼音标注 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="pinyin-switch" className="flex-1">
            拼音标注
          </Label>
          <Switch
            id="pinyin-switch"
            checked={poemTypography.pinyinVisible}
            onCheckedChange={(checked) =>
              setPoemTypography((prev) => ({
                ...prev,
                pinyinVisible: checked,
              }))
            }
          />
        </div>

        {/* 原文注解 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="annotation-switch" className="flex-1">
            原文注解
          </Label>
          <Switch
            id="annotation-switch"
            checked={poemTypography.annotationVisible}
            onCheckedChange={(checked) =>
              setPoemTypography((prev) => ({
                ...prev,
                annotationVisible: checked,
              }))
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
