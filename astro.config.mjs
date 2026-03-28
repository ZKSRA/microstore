import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  adapter: cloudflare(),
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://lovealaoui.com',
  integrations: [sitemap()],
});
