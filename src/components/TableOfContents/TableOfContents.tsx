import clsx from 'clsx';

import { useHeadersObserver } from './hooks';
import styles from './TableOfContents.module.css';

import type { MarkdownHeading } from 'astro';

const RECIPE_WRAPPER = '.recipe-content';

const scrollTo = (level: number, id: string) => {
    const element = document.querySelector(
        `${RECIPE_WRAPPER} > h${level}${id}`,
    );
    window.history.pushState(
        {},
        '',
        `${window.location.protocol}//${window.location.host}${window.location.pathname}${id}`,
    );
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export const TableOfContents = ({
    headings,
}: {
    headings: MarkdownHeading[];
}) => {
    const activeId = useHeadersObserver(RECIPE_WRAPPER);

    return (
        <nav className={clsx('flex flex-col', styles['table-of-contents'])}>
            <h3 className="text-xl font-medium">Tabla de contenidos</h3>
            <ul className="flex flex-col gap-2 mt-2">
                {headings.map(({ depth, slug, text }, index) => (
                    <li
                        data-level={depth}
                        key={index}
                        data-current={activeId === slug}
                    >
                        <a
                            href={`#${slug}`}
                            onClick={(event) => {
                                event.preventDefault();
                                scrollTo(depth, `#${slug}`);
                            }}
                        >
                            {text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
