export type PageBlock =
    | BreakBlock
    | HeadingBlock<2>
    | HeadingBlock<3>
    | HeadingBlock<4>
    | ParagraphBlock;

export type TextContent = PlainText | SpanBlock;

export interface Style {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    color: string;
}

export interface BreakBlock {
    type: 'break';
}

export interface HeadingBlock<L extends 2 | 3 | 4> {
    type: 'heading';
    level: L;
    content: string;
}

export interface ParagraphBlock {
    type: 'paragraph';
    content: TextContent[];
}

export interface PlainText {
    type: 'plain_text';
    content: string;
}

export interface SpanBlock {
    type: 'span';
    content: string;
    style: Style;
}

export const BR = (): BreakBlock => ({ type: 'break' });

export const H2 = (content: string): HeadingBlock<2> => ({
    type: 'heading',
    level: 2,
    content,
});

export const H3 = (content: string): HeadingBlock<3> => ({
    type: 'heading',
    level: 3,
    content,
});

export const H4 = (content: string): HeadingBlock<4> => ({
    type: 'heading',
    level: 4,
    content,
});

export const P = (content: TextContent[]): ParagraphBlock => ({
    type: 'paragraph',
    content,
});

export const PlainText = (content: string): PlainText => ({
    type: 'plain_text',
    content,
});

export const SpanBlock = (content: string, style: Style): SpanBlock => ({
    type: 'span',
    content,
    style,
});
