import { Webhooks } from "@octokit/webhooks";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { api } from "@/trpc/server";

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

  if (env.NODE_ENV === "production") {
    await webhooks.verifyAndReceive({
      id,
      name: eventName,
      payload,
      signature,
    });
  }

  api.webhook.handleWebhook({ payload, id, event: eventName });

  return NextResponse.json({ message: "Webhook received" });
}
