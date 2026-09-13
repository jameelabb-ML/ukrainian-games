// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// NOTE: update `site` to your real domain before deploying — it's used to
// generate correct canonical URLs, Open Graph tags, and the sitemap.
export default defineConfig({
  site: 'https://ukrainiangames.com',
  output: 'static',
  integrations: [react(), sitemap()],
});
