import type { AstroCookies } from "astro";
import { getUserByAccessToken } from "./supabase";

const ACCESS_COOKIE = "sb-access-token";
const REFRESH_COOKIE = "sb-refresh-token";

export const cookieNames = {
  access: ACCESS_COOKIE,
  refresh: REFRESH_COOKIE,
};

export function setAuthCookies(
  cookies: AstroCookies,
  session: { access_token: string; refresh_token: string },
) {
  const base = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 7,
  };

  cookies.set(ACCESS_COOKIE, session.access_token, base);
  cookies.set(REFRESH_COOKIE, session.refresh_token, base);
}

export function clearAuthCookies(cookies: AstroCookies) {
  cookies.delete(ACCESS_COOKIE, { path: "/" });
  cookies.delete(REFRESH_COOKIE, { path: "/" });
}

export async function getSessionUser(cookies: AstroCookies) {
  const accessToken = cookies.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  return getUserByAccessToken(accessToken);
}
