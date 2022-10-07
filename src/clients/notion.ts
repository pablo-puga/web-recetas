import { Client } from '@notionhq/client';

const RECIPES_DATABASE_ID = process.env.NOTION_DATABASE_ID as string;

const client = new Client({
    auth: process.env.NOTION_API_KEY,
});

export { client as notionClient, RECIPES_DATABASE_ID };
