import { isFullBlock, isFullPage } from '@notionhq/client';

import { notionClient, RECIPES_DATABASE_ID } from '../clients/notion';
import { NotionError } from '../errors/notion-error';
import { None, Some } from '../utils/option';
import {
    BR,
    H2,
    H3,
    H4,
    OL,
    P,
    PlainText,
    SpanBlock,
    UL,
} from '../utils/page-blocks';
import { Err, Ok } from '../utils/result';

import { getPageCategories, getPageTitle } from './notion/properties';

import type { Recipe, RecipeWithBody } from '../types';
import type { Option } from '../utils/option';
import type { PageBlock, TextContent } from '../utils/page-blocks';
import type { Result } from '../utils/result';
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

const getBaseRecipe = async (slug: string): Promise<Option<Recipe>> => {
    const recipe = await notionClient.databases.query({
        database_id: RECIPES_DATABASE_ID,
        filter: { property: 'Slug', rich_text: { equals: slug } },
        page_size: 1,
    });

    if (recipe.results.length === 0) return None;

    const recipeInfo = recipe.results[0];
    if (!isFullPage(recipeInfo)) return None;

    const title = getPageTitle(recipeInfo);
    if (!title.has) return None;

    return Some({
        id: recipeInfo.id,
        createdAt: recipeInfo.created_time,
        lastEditedAt: recipeInfo.last_edited_time,
        title: title.some,
        slug,
        categories: getPageCategories(recipeInfo),
    });
};

const isStyledTextPiece = (text: RichTextItemResponse): boolean => {
    const { color, bold, italic, underline, strikethrough } = text.annotations;
    if (color !== 'default') return true;
    return bold || italic || underline || strikethrough;
};

const parseRichText = (richText: RichTextItemResponse[]): TextContent[] =>
    richText.map((text) => {
        if (isStyledTextPiece(text)) {
            return SpanBlock(text.plain_text, text.annotations);
        } else {
            return PlainText(text.plain_text);
        }
    });

const getBlockChildren = async (
    blockId: string,
    slug: string,
): Promise<PageBlock[]> => {
    const blocks: PageBlock[] = [];

    const blocksSearch = await notionClient.blocks.children.list({
        block_id: blockId,
        page_size: 100,
    });

    for (let it = 0; it <= blocksSearch.results.length; it++) {
        const rawBlock = blocksSearch.results[it];
        if (rawBlock === undefined || rawBlock === null) {
            continue;
        }

        if (!isFullBlock(rawBlock)) continue;
        switch (rawBlock.type) {
            case 'bulleted_list_item': {
                const bulletedItems: TextContent[][] = [];
                let bulletedItem = rawBlock;
                do {
                    bulletedItems.push(
                        parseRichText(
                            bulletedItem.bulleted_list_item.rich_text,
                        ),
                    );

                    if (it + 1 > blocksSearch.results.length) break;
                    const nextBlock = blocksSearch.results[it + 1];
                    if (!isFullBlock(nextBlock)) break;
                    if (nextBlock.type !== 'bulleted_list_item') break;
                    bulletedItem = nextBlock;
                    it++;
                } while (true);

                blocks.push(UL(bulletedItems));
                break;
            }
            case 'heading_1':
                blocks.push(H2(rawBlock.heading_1.rich_text[0].plain_text));
                break;
            case 'heading_2':
                blocks.push(H3(rawBlock.heading_2.rich_text[0].plain_text));
                break;
            case 'heading_3':
                blocks.push(H4(rawBlock.heading_3.rich_text[0].plain_text));
                break;
            case 'numbered_list_item': {
                const numberedItems: TextContent[][] = [];
                let numberedItem = rawBlock;
                do {
                    numberedItems.push(
                        parseRichText(
                            numberedItem.numbered_list_item.rich_text,
                        ),
                    );

                    if (it + 1 > blocksSearch.results.length) break;
                    const nextBlock = blocksSearch.results[it + 1];
                    if (!nextBlock || !isFullBlock(nextBlock)) break;
                    if (nextBlock.type !== 'numbered_list_item') break;
                    numberedItem = nextBlock;
                    it++;
                } while (true);

                blocks.push(OL(numberedItems));
                break;
            }
            case 'paragraph':
                if (rawBlock.paragraph.rich_text.length === 0) {
                    blocks.push(BR());
                } else {
                    blocks.push(P(parseRichText(rawBlock.paragraph.rich_text)));
                }
                break;
            default:
                console.warn(
                    `Ignoring page block of type '${rawBlock.type}' for recipe '${slug}'`,
                );
                continue;
        }
    }
    return blocks;
};

const getRecipeBodyBlocks = async (
    baseBlockId: string,
    slug: string,
): Promise<PageBlock[]> => {
    const baseBlock = await notionClient.blocks.retrieve({
        block_id: baseBlockId,
    });
    if (!isFullBlock(baseBlock)) return [];
    if (!baseBlock.has_children) return [];
    return getBlockChildren(baseBlock.id, slug);
};

const getRecipe = async (
    slug: string,
): Promise<Result<Option<RecipeWithBody>, NotionError>> => {
    try {
        const baseRecipe = await getBaseRecipe(slug);
        if (!baseRecipe.has) return Ok(None);

        const pageBlocks = await getRecipeBodyBlocks(baseRecipe.some.id, slug);

        return Ok(Some({ ...baseRecipe.some, body: pageBlocks }));
    } catch (e) {
        if (e instanceof Error) return Err(new NotionError(e));
        return Err(new NotionError(new Error(JSON.stringify(e))));
    }
};

export { getRecipe };
