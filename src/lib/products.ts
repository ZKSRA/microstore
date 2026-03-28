export const PRODUCTS = {
  betterConversationsDeck: {
    slug: "better-conversations-deck",
    name: "The Better Conversations Deck",
    description: "120 guided prompts for better conversations, date nights, and weekly check-ins.",
    priceCents: 2900,
    currency: "usd",
  },
} as const;

export const DEFAULT_PRODUCT = PRODUCTS.betterConversationsDeck;
