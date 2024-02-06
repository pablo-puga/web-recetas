import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: process.env.APP_URL || 'http://localhost:4321',
    integrations: [
        tailwind(),
        react(),
        mdx(),
        sitemap({
            lastmod: new Date().new,
        }),
    ],
    output: 'server',
    adapter: node({
        mode: 'standalone',
    }),
});
