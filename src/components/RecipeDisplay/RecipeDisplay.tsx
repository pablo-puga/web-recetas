import clsx from 'clsx';
import { Fragment, ReactNode } from 'react';
import { RecipeWithBody } from '../../types';
import { stringColorToTheme } from '../../utils/colors';
import { PageBlock, TextContent } from '../../utils/page-blocks';

const textContentBlockToReactNode = (
    block: TextContent,
    key: number,
): ReactNode => {
    switch (block.type) {
        case 'plain_text':
            return <Fragment key={key}>{block.content}</Fragment>;
        case 'span': {
            const style = block.style;
            const themeColor = stringColorToTheme(style.color);
            return (
                <span
                    key={key}
                    className={clsx(
                        style.bold && 'font-bold',
                        style.italic && 'italic',
                        style.underline && 'underline',
                        style.strikethrough && 'line-through',
                        style.color !== 'default' && `text-${themeColor}`,
                    )}
                >
                    {block.content}
                </span>
            );
        }
        default:
            return null;
    }
};

const pageBlockToReactNode = (block: PageBlock, key: number): ReactNode => {
    switch (block.type) {
        case 'break':
            return <br key={key} />;
        case 'heading':
            const TagName = `h${block.level}` as keyof JSX.IntrinsicElements;
            return (
                <TagName
                    key={key}
                    className={clsx(
                        'font-medium mt-3 mb-2 tracking-wide',
                        block.level === 2 && 'text-2xl',
                        block.level === 3 && 'text-xl',
                        block.level === 3 && 'text-lg',
                    )}
                >
                    {block.content}
                </TagName>
            );
        case 'ordered_list':
            return (
                <ol
                    key={key}
                    className="flex flex-col gap-1 list-decimal pl-5 mt-2 mb-1"
                >
                    {block.content.map((contentList, index) => (
                        <li key={index}>
                            {contentList.map(textContentBlockToReactNode)}
                        </li>
                    ))}
                </ol>
            );
        case 'paragraph':
            return (
                <p key={key} className="my-1">
                    {block.content.map(textContentBlockToReactNode)}
                </p>
            );
        case 'unordered_list':
            return (
                <ul
                    key={key}
                    className="flex flex-col gap-1 list-disc pl-5 mt-2 mb-1"
                >
                    {block.content.map((contentList, index) => (
                        <li key={index}>
                            {contentList.map(textContentBlockToReactNode)}
                        </li>
                    ))}
                </ul>
            );
        default:
            return null;
    }
};

interface Props {
    recipe: RecipeWithBody;
}

const RecipeDisplay = ({ recipe }: Props) => {
    return (
        <article className="z-50 w-full max-w-3xl px-3 py-1 bg-gray-50 shadow shadow-theme-grey-light rounded-sm text-sm sm:text-base">
            <h1
                className="font-medium mt-3 mb-2 tracking-wide"
                style={{ fontSize: '1.75rem', lineHeight: '2.2rem' }}
            >
                Receta
            </h1>
            {recipe.body.map(pageBlockToReactNode)}
        </article>
    );
};

export { RecipeDisplay };
