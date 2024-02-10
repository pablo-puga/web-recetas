import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: process.env.APP_URL || 'http://localhost:4321',
    trailingSlash: 'never',
    integrations: [
        tailwind({
            applyBaseStyles: false,
        }),
        react(),
        mdx(),
        sitemap({
            lastmod: new Date().new,
            filter: (page) =>
                !page.includes('/pagina') &&
                !page.includes('search') &&
                !page.includes('palette') &&
                !page.includes('404') &&
                !page.includes('500'),
            customPages: [`${process.env.APP_URL || 'http://localhost:4321'}`],
        }),
    ],
    output: 'server',
    adapter: node({
        mode: 'standalone',
    }),
    redirects: {
        '/': '/pagina/1',
        '/categoria/[category]': '/categoria/[category]/pagina/1',
    },
});
