import { Webhooks } from "@octokit/webhooks";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

const webhooks = new Webhooks({
  secret: env.GITHUB_WEBHOOK_SECRET,
});

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-hub-signature-256");
  const eventName = request.headers.get("x-github-event");
  const id = request.headers.get("x-github-delivery");
  const payload = await request.text();

  if (!signature || !eventName || !id) {
    return NextResponse.json(
      { error: "Missing required GitHub webhook headers" },
      { status: 400 },
    );
  }

  await webhooks.verifyAndReceive({
    id,
    name: eventName,
    payload,
    signature,
  });

  console.log(`Received GitHub webhook event: ${eventName}`);

  return NextResponse.json({
    success: true,
    event,
    message: "Webhook 处理成功",
  });
}

export async function GET() {
  return NextResponse.json({
    message: "GitHub webhook 端点运行正常",
    timestamp: new Date().toISOString(),
  });
}
