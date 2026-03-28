import { defineMiddleware } from "astro:middleware";
import { getSessionUser } from "@/lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    context.locals.user = await getSessionUser(context.cookies);
  } catch {
    context.locals.user = null;
  }

  return next();
});
