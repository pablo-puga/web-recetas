import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const { APP_URL = 'http://localhost:4321' } = loadEnv(
    process.env.NODE_ENV,
    process.cwd(),
    '',
);

// https://astro.build/config
export default defineConfig({
    site: APP_URL,
    trailingSlash: 'never',
    integrations: [
        tailwind({
            applyBaseStyles: false,
            nesting: true,
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
            customPages: [APP_URL],
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
