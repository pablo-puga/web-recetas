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
    vite: {
        define: {
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        },
    },
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
        }),
    ],
    output: 'server',
    adapter: node({
        mode: 'standalone',
    }),
    redirects: {
        '/categoria/[category]': '/categoria/[category]/pagina/1',
    },
});
