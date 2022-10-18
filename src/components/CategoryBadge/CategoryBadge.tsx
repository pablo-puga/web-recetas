import Link from 'next/link';
import { Category } from '../../types';
import clsx from 'clsx';
import { stringColorToTheme } from '../../utils/colors';

interface Props {
    category: Category;
}

const CategoryBadge = ({ category }: Props) => {
    const themeColor = stringColorToTheme(category.color);
    const bgThemeColor = `bg-${themeColor}/70`;
    return (
        <Link href={`/categoria/${category.name.toLowerCase()}`}>
            <a
                className={clsx(
                    'px-1.5 py-0.5 rounded-sm text-sm font-medium transition-all duration-150',
                    bgThemeColor,
                    `hover:brightness-90`,
                )}
            >
                {category.name}
            </a>
        </Link>
    );
};

export { CategoryBadge };
