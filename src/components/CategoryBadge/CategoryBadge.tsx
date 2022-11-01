import clsx from 'clsx';
import Link from 'next/link';

import { stringColorToTheme } from '../../utils/colors';

import type { Category } from '../../types';

interface Props {
    category: Category;
    isFullWidth?: boolean;
}

const CategoryBadge = ({ category, isFullWidth = false }: Props) => {
    const themeColor = stringColorToTheme(category.color);
    const bgThemeColor = `bg-${themeColor}/70`;
    return (
        <Link
            href={`/categoria/${category.name.toLowerCase()}`}
            className={clsx(
                'px-1.5 py-0.5 rounded-sm text-sm font-medium transition-all duration-150',
                isFullWidth && 'inline-block w-full',
                bgThemeColor,
                `hover:brightness-90`,
            )}
        >
            {category.name}
        </Link>
    );
};

export { CategoryBadge };
