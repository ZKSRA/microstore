import { env } from "./env";
import { DEFAULT_PRODUCT } from "./products";

type Product = typeof DEFAULT_PRODUCT;

export async function createCheckoutSession(params: {
  product: Product;
  userId: string;
  customerEmail?: string;
}) {
  if (!env.stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  if (!env.publicSiteUrl) {
    throw new Error("Missing PUBLIC_SITE_URL");
  }

  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("success_url", `${env.publicSiteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${env.publicSiteUrl}/checkout/cancel`);
  form.set("line_items[0][quantity]", "1");
  form.set("line_items[0][price_data][currency]", params.product.currency);
  form.set("line_items[0][price_data][unit_amount]", String(params.product.priceCents));
  form.set("line_items[0][price_data][product_data][name]", params.product.name);
  form.set("line_items[0][price_data][product_data][description]", params.product.description);
  form.set("metadata[user_id]", params.userId);
  form.set("metadata[product_slug]", params.product.slug);

  if (params.customerEmail) {
    form.set("customer_email", params.customerEmail);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  const data = await response.json();

  if (!response.ok || !data?.url) {
    throw new Error(data?.error?.message ?? "Failed to create Stripe Checkout session.");
  }

  return data as { id: string; url: string };
}
