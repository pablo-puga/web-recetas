import { getAllRecipes } from '../data/get-recipes-list';
import { getIntEnvVar, getStringEnvVar } from '../utils/env';

import type { GetServerSideProps } from 'next';

const BASE_URL = getStringEnvVar('BASE_URL', 'http://localhost:3000');
const REVALIDATE_TTL = getIntEnvVar('REVALIDATE_TTL', 3600 * 6);

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const allRecipesSearch = await getAllRecipes();
    if (allRecipesSearch.error) {
        throw allRecipesSearch.value.source;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${BASE_URL}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    ${allRecipesSearch.value
        .map((recipe) => {
            const lastmod = recipe.lastEditedAt || recipe.createdAt;
            const postXML = `<url>
        <loc>${BASE_URL}/receta/${recipe.slug}</loc>
        <lastmod>${lastmod}</lastmod>
    </url>`;
            return postXML.trim();
        })
        .join('\n    ')}
</urlset>
`;
    res.setHeader(
        'Cache-Control',
        `public, s-maxage=${REVALIDATE_TTL}, stale-while-revalidate=${REVALIDATE_TTL}`,
    );
    res.setHeader('Content-Type', 'application/xml');
    res.write(xml);
    res.end();

    return {
        props: {},
    };
};

const SiteMap = () => {
    // getServerSideProps would do the work
};

export default SiteMap;
