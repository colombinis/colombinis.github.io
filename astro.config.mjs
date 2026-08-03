import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sacsi.com.ar',
  base: '/',
  integrations: [sitemap()],
  server: {
    port: 8000,
    host: true,
  },
  build: {
    format: 'directory',
  },
});
