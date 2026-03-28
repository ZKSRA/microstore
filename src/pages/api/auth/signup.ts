import type { APIRoute } from "astro";
import { setAuthCookies } from "@/lib/auth";
import { signUpWithEmail } from "@/lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/my-deck");

  if (!email || !password) {
    return redirect("/signup?error=missing_fields");
  }

  const result = await signUpWithEmail(email, password);

  if (result.error || !result.session) {
    return redirect("/signup?error=signup_failed");
  }

  setAuthCookies(cookies, result.session);
  return redirect(next);
};
