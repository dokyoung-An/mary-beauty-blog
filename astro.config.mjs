import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://mary-beauty-talk.vercel.app',
  integrations: [
    tailwind(),
    sitemap(),
    mdx(),
    react(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@/': '/src/',
      },
    },
    optimizeDeps: {
      exclude: ['astro:content'],
    },
    envPrefix: 'PUBLIC_',
    ssr: {
      noExternal: ['@astrojs/mdx', 'astro-expressive-code'],
    },
    build: {
      rollupOptions: {
        external: ['env.mjs']
      }
    }
  },
}); 