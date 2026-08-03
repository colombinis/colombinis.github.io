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
  vite: {
    server: {
      // Permite que la preview (servida desde otro host vía proxy) no sea
      // bloqueada por el chequeo de Host de Vite ("Cross-origin request blocked").
      allowedHosts: true,
    },
  },
  build: {
    format: 'directory',
  },
});
