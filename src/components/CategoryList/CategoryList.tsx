import { Category } from '../../types';
import { CategoryBadge } from '../CategoryBadge';

import style from './CategoryList.module.css';

interface Props {
    categoryList: Category[];
}

const CategoryList = ({ categoryList }: Props) => {
    return (
        <section className={style['category-list-wrapper']}>
            <h1 className="text-center font-medium text-lg sm:font-bold md:text-xl lg:text-2xl lg:text-left tracking-wide">
                Categorías
            </h1>
            <nav className="mt-2 lg:mt-4">
                <ul className="flex flex-row flex-wrap items-center justify-evenly gap-2 lg:flex-col">
                    {categoryList.map((category) => (
                        <li key={category.id} className="lg:w-full">
                            <CategoryBadge
                                category={category}
                                isFullWidth={true}
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        </section>
    );
};

export { CategoryList };
