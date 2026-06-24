import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sacsi.com.ar',
  base: '/',
  server: {
    port: 8000,
    host: true
  },
  build: {
    format: 'directory'
  }
});
