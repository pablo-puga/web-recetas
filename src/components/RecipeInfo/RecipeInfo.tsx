import clsx from 'clsx';
import { useReducer, type ReactElement } from 'react';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';

import style from './RecipeInfo.module.css';

import type { MarkdownHeading } from 'astro';

import { TableOfContents } from '@components/TableOfContents';

interface Props {
    headings: MarkdownHeading[];
    Dates?: ReactElement;
    CategoryList?: ReactElement;
}

export const RecipeInfo = ({ headings, Dates, CategoryList }: Props) => {
    const [isOpen, toggleIsOpen] = useReducer((state) => {
        const newState = !state;
        if (newState) {
            document.querySelector('body')?.classList.add('modal-opened');
        } else document.querySelector('body')?.classList.remove('modal-opened');
        return newState;
    }, false);

    return (
        <>
            {isOpen && (
                <div
                    className="bg-theme-grey-700/50 absolute z-40 top-0 left-0 h-[100vh] w-[100vw] lg:hidden"
                    style={{ transform: 'translateX(-100%)' }}
                ></div>
            )}
            <div
                data-open={isOpen}
                className={clsx(
                    'recipe-info absolute h-[100vh] w-[80vw] left-0 z-50 lg:w-auto lg:h-auto lg:sticky lg:top-1 transition duration-100',
                    style['recipe-info'],
                    'flex flex-col gap-4 bg-theme-grey-100',
                )}
            >
                <div className="relative lg:hidden">
                    <button
                        className={clsx(
                            'rounded-bl font-bold w-8 h-16 absolute left-0 transition duration-100',
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
                </div>
                <h1 className="text-2xl font-semibold">Información</h1>
                {Dates}
                <TableOfContents headings={headings} />
                {CategoryList}
            </div>
        </>
    );
};
