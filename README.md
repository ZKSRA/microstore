# Astro & Tailwind CSS Starter Kit

by https://lexingtonthemes.com

## License

This template is open-source software licensed under the [GPL-3.0 license](https://opensource.org/licenses/GPL-3.0). Feel free to fork, modify, and use it in your projects.

## Need an attribution-free version?

Checkout [Lexington Themes](https://lexingtonthemes.com/) for free and premium multipage themes & UI Kits
For freelancers, developers, businesses, and personal use.
Beautifully crafted with Astro.js, and Tailwind CSS — Simple & easy to customise.

## This template is using Tailwind CSS V4

Now we are using only a CSS file. It's called `global.css` and it's located in the src/styles folder. Now we are eimporting Tailwind CSS on the same file instead of using the `tailwind.config.cjs` file. Like this:

```css
// Importing Tailwind CSS
@import "tailwindcss";
// Importing Tailwind plugins
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
```

Then to add your styles you will use the @theme directive. Like this:

```css
@theme {
  /* Your CSS goes here, see how styles are written on the global.css file */
}
```

Remember this is just in Alpha version, so you can use it as you want. Just keep an eye on the changes that Tailwind CSS is going to make.

## Template Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
├── src/
│   └── components/
│   └── layouts/
│   └── pages/
│       └── index.astro
│   └── styles/
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.
There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.
Any static assets, like images, can be placed in the `public/` directory.

## Commands

All commands are run from the root of the project, from a terminal:
| Command | Action |
| :--------------------- | :----------------------------------------------- |
| `npm install` | Installs dependencies |
| `npm run dev` | Starts local dev server at `localhost:3000` |
| `npm run build` | Build your production site to `./dist/` |
| `npm run preview` | Preview your build locally, before deploying |
| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI |

---

Updated on: 06.16.2025-

Whats new:

- Full redesign
- Ligth mode
- New palette

## Payments + Accounts setup (Stripe + Supabase)

This project now includes a simple account + checkout flow:

- Supabase email/password auth (`/signup`, `/login`, `/account`)
- Protected `/my-deck` route
- Stripe Checkout one-time payment via `/api/checkout`
- Stripe webhook ingestion via `/api/stripe/webhook`

### Required environment variables (Cloudflare-compatible names)

```bash
PUBLIC_SITE_URL=https://your-domain.com
PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

### Supabase table (manual)

Create a `purchases` table in Supabase with at least these columns:

- `id` (uuid, primary key)
- `user_id` (text or uuid)
- `product_slug` (text)
- `stripe_session_id` (text, unique)
- `amount_total` (int)
- `currency` (text)
- `created_at` (timestamp, default now)

Recommended unique constraint:

- `(user_id, product_slug)`

### Stripe webhook (manual)

Add a Stripe webhook endpoint:

- URL: `https://your-domain.com/api/stripe/webhook`
- Event: `checkout.session.completed`

> Note: webhook signature verification is left as a TODO in code and should be added before production.
