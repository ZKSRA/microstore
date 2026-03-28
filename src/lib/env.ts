const optional = (value: string | undefined) => value?.trim() ?? "";

export const env = {
  publicSiteUrl: optional(import.meta.env.PUBLIC_SITE_URL),
  supabaseUrl: optional(import.meta.env.PUBLIC_SUPABASE_URL),
  supabaseAnonKey: optional(import.meta.env.PUBLIC_SUPABASE_ANON_KEY),
  supabaseServiceRoleKey: optional(import.meta.env.SUPABASE_SERVICE_ROLE_KEY),
  stripeSecretKey: optional(import.meta.env.STRIPE_SECRET_KEY),
  stripeWebhookSecret: optional(import.meta.env.STRIPE_WEBHOOK_SECRET),
};

export const hasSupabasePublicConfig = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const hasServerCommerceConfig = Boolean(
  env.supabaseUrl && env.supabaseServiceRoleKey && env.stripeSecretKey && env.publicSiteUrl,
);
