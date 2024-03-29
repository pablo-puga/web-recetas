import clsx from 'clsx';
import { useReducer, type ReactElement } from 'react';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';

import style from './RecipeInfo.module.css';

import type { MarkdownHeading } from 'astro';

import { withStrictMode } from '@components/strict-mode';
import { TableOfContents } from '@components/TableOfContents';

interface Props {
    headings: MarkdownHeading[];
    Meta?: ReactElement;
    CategoryList?: ReactElement;
}

const RecipeInfo = ({ headings, Meta, CategoryList }: Props) => {
    const [isOpen, toggleIsOpen] = useReducer((state) => {
        const newState = !state;
        if (newState) {
            document.querySelector('body')?.classList.add('info-opened');
        } else document.querySelector('body')?.classList.remove('info-opened');
        return newState;
    }, false);

    return (
        <>
            {isOpen && (
                <div
                    className="bg-theme-grey-700/50 fixed z-40 top-0 left-0 h-[100vh] w-[100vw] lg:hidden"
                    role="presentation"
                    onClick={toggleIsOpen}
                ></div>
            )}
            <div
                data-open={isOpen}
                className={clsx(
                    'recipe-info fixed h-[100vh] w-full right-0 z-50 top-8 lg:top-16 lg:w-auto lg:h-auto lg:sticky transition',
                    style['recipe-info'],
                    'flex flex-col gap-4 bg-theme-grey-100',
                )}
            >
                <button
                    className={clsx(
                        'rounded-l font-bold w-8 h-16 absolute left-0 transition top-[50%] lg:hidden',
                        isOpen
                            ? 'bg-theme-grey-100'
                            : 'bg-theme-yellow-200 shadow-sm',
                    )}
                    onClick={toggleIsOpen}
                >
                    <PiDotsThreeOutlineVerticalFill
                        className="text-5xl absolute"
                        style={{ transform: 'translate(-8px, -24px)' }}
                    />
                </button>
                <div className="relative lg:hidden"></div>
                <h2 className="text-2xl font-semibold">Información</h2>
                {Meta}
                <hr />
                <TableOfContents headings={headings} />
                <hr />
                {CategoryList}
            </div>
        </>
    );
};

export default withStrictMode(RecipeInfo);
