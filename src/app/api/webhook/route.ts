import { type NextRequest, NextResponse } from "next/server";
import { api } from "@/trpc/server";

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");

  if (!signature || !event) {
    return NextResponse.json({ error: "缺少必要的请求头" }, { status: 400 });
  }

  // 使用 tRPC 处理 webhook
  const result = await api.webhook.handleWebhook({
    signature,
    payload,
    event,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json(result);
}

export async function GET() {
  return NextResponse.json({
    message: "GitHub webhook 端点运行正常",
    timestamp: new Date().toISOString(),
  });
}
