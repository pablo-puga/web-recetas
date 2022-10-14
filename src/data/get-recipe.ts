import { isFullBlock, isFullPage } from '@notionhq/client';
import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { notionClient, RECIPES_DATABASE_ID } from '../clients/notion';
import { NotionError } from '../errors/notion-error';
import { Recipe } from '../types';
import { None, Option, Some } from '../utils/option';
import {
    BR,
    H2,
    H3,
    H4,
    P,
    PageBlock,
    PlainText,
    SpanBlock,
    TextContent,
} from '../utils/page-blocks';
import { Err, Ok, Result } from '../utils/result';
import { getPageCategories, getPageTitle } from './notion/properties';

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

const log = (val: unknown) => console.dir(val, { depth: null });

const isStyledTextPiece = (text: RichTextItemResponse): boolean => {
    const { color, bold, italic, underline, strikethrough } = text.annotations;
    if (color !== 'default') return true;
    return bold || italic || underline || strikethrough;
};

const getBlockChildren = async (blockId: string) => {
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
            case 'heading_1':
                blocks.push(H2(rawBlock.heading_1.rich_text[0].plain_text));
                break;
            case 'heading_2':
                blocks.push(H3(rawBlock.heading_2.rich_text[0].plain_text));
                break;
            case 'heading_3':
                blocks.push(H4(rawBlock.heading_3.rich_text[0].plain_text));
                break;
            case 'paragraph': {
                if (rawBlock.paragraph.rich_text.length === 0) {
                    blocks.push(BR());
                } else {
                    const contents: TextContent[] =
                        rawBlock.paragraph.rich_text.map((text) => {
                            if (isStyledTextPiece(text)) {
                                return SpanBlock(
                                    text.plain_text,
                                    text.annotations,
                                );
                            } else {
                                return PlainText(text.plain_text);
                            }
                        });
                    blocks.push(P(contents));
                }
                break;
            }
            default:
                if (rawBlock.has_children) log(rawBlock);
                log(rawBlock.type);
                continue;
        }
    }
    return blocks;
};

const getRecipeBodyBlocks = async (baseBlockId: string) => {
    const baseBlock = await notionClient.blocks.retrieve({
        block_id: baseBlockId,
    });
    if (!isFullBlock(baseBlock)) return [];
    if (!baseBlock.has_children) return [];
    return getBlockChildren(baseBlock.id);
};

const getRecipe = async (
    slug: string,
): Promise<Result<Option<Recipe>, NotionError>> => {
    try {
        const baseRecipe = await getBaseRecipe(slug);
        if (!baseRecipe.has) return Ok(None);

        const pageBlocks = await getRecipeBodyBlocks(baseRecipe.some.id);
        log(pageBlocks);

        return Ok(baseRecipe);
    } catch (e) {
        if (e instanceof Error) return Err(new NotionError(e));
        return Err(new NotionError(new Error(JSON.stringify(e))));
    }
};

export { getRecipe };
