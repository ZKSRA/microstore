import { env, hasSupabasePublicConfig } from "./env";

function assertPublicConfig() {
  if (!hasSupabasePublicConfig) {
    throw new Error("Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
  }
}

const authHeaders = () => ({
  apikey: env.supabaseAnonKey,
  "Content-Type": "application/json",
});

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email?: string;
  };
};

export type AuthResult = {
  session: AuthSession | null;
  user: AuthSession["user"] | null;
  error?: { message?: string };
};

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  assertPublicConfig();
  const response = await fetch(`${env.supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      Authorization: `Bearer ${env.supabaseAnonKey}`,
    },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}

export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  assertPublicConfig();
  const response = await fetch(`${env.supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      Authorization: `Bearer ${env.supabaseAnonKey}`,
    },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}

export async function getUserByAccessToken(accessToken: string) {
  assertPublicConfig();
  const response = await fetch(`${env.supabaseUrl}/auth/v1/user`, {
    headers: {
      ...authHeaders(),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

export async function logout(accessToken: string) {
  assertPublicConfig();
  await fetch(`${env.supabaseUrl}/auth/v1/logout`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

const serviceHeaders = () => {
  if (!env.supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return {
    apikey: env.supabaseServiceRoleKey,
    Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
  };
};

export async function hasPurchase(userId: string, productSlug: string) {
  assertPublicConfig();
  const query = new URLSearchParams({
    select: "id",
    user_id: `eq.${userId}`,
    product_slug: `eq.${productSlug}`,
    limit: "1",
  });

  const response = await fetch(`${env.supabaseUrl}/rest/v1/purchases?${query.toString()}`, {
    headers: serviceHeaders(),
  });

  if (!response.ok) return false;

  const rows = (await response.json()) as Array<{ id: string }>;
  return rows.length > 0;
}

export async function upsertPurchase(params: {
  userId: string;
  productSlug: string;
  stripeSessionId: string;
  amountTotal: number;
  currency: string;
}) {
  assertPublicConfig();
  const response = await fetch(`${env.supabaseUrl}/rest/v1/purchases`, {
    method: "POST",
    headers: {
      ...serviceHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      user_id: params.userId,
      product_slug: params.productSlug,
      stripe_session_id: params.stripeSessionId,
      amount_total: params.amountTotal,
      currency: params.currency,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to upsert purchase record.");
  }
}
