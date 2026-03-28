import type { APIRoute } from "astro";
import { DEFAULT_PRODUCT } from "@/lib/products";
import { createCheckoutSession } from "@/lib/stripe";
import { hasServerCommerceConfig } from "@/lib/env";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!locals.user) {
    return redirect("/login?next=/my-deck");
  }

  if (!hasServerCommerceConfig) {
    return redirect("/my-deck?error=server_config_missing");
  }

  const formData = await request.formData();
  const productSlug = String(formData.get("productSlug") ?? DEFAULT_PRODUCT.slug);

  if (productSlug !== DEFAULT_PRODUCT.slug) {
    return redirect("/my-deck?error=unknown_product");
  }

  try {
    const session = await createCheckoutSession({
      product: DEFAULT_PRODUCT,
      userId: locals.user.id,
      customerEmail: locals.user.email,
    });

    return Response.redirect(session.url, 303);
  } catch {
    return redirect("/my-deck?error=checkout_failed");
  }
};
