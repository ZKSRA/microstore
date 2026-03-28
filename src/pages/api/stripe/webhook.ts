import type { APIRoute } from "astro";
import { env } from "@/lib/env";
import { upsertPurchase } from "@/lib/supabase";

export const prerender = false;

/**
 * IMPORTANT MANUAL SETUP:
 * 1) Configure Stripe webhook endpoint to point to /api/stripe/webhook
 * 2) Add STRIPE_WEBHOOK_SECRET and verify signature before processing events.
 *
 * For simplicity this starter does not include full signature verification logic yet.
 * Add that before production launch.
 */
export const POST: APIRoute = async ({ request }) => {
  if (!env.stripeSecretKey || !env.supabaseServiceRoleKey) {
    return new Response("Missing Stripe/Supabase server configuration", { status: 500 });
  }

  // TODO: verify Stripe signature with STRIPE_WEBHOOK_SECRET before trusting payload.
  const payload = (await request.json()) as {
    type?: string;
    data?: {
      object?: {
        id?: string;
        amount_total?: number;
        currency?: string;
        metadata?: { user_id?: string; product_slug?: string };
      };
    };
  };

  if (payload.type !== "checkout.session.completed") {
    return new Response("Ignored", { status: 200 });
  }

  const session = payload.data?.object;
  const userId = session?.metadata?.user_id;
  const productSlug = session?.metadata?.product_slug;

  if (!session?.id || !userId || !productSlug || !session.amount_total || !session.currency) {
    return new Response("Invalid session metadata", { status: 400 });
  }

  await upsertPurchase({
    userId,
    productSlug,
    stripeSessionId: session.id,
    amountTotal: session.amount_total,
    currency: session.currency,
  });

  return new Response("ok", { status: 200 });
};
