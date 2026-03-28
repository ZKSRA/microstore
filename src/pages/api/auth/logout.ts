import type { APIRoute } from "astro";
import { clearAuthCookies, cookieNames } from "@/lib/auth";
import { logout } from "@/lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const accessToken = cookies.get(cookieNames.access)?.value;

  if (accessToken) {
    await logout(accessToken);
  }

  clearAuthCookies(cookies);
  return redirect("/");
};
