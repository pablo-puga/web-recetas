import { CategoryBadge } from '../CategoryBadge';

import type { Category } from '../../types';

const InlineCategoryList = ({ categories }: { categories: Category[] }) => (
    <ul className="inline-flex flex-row flex-wrap mt-1">
        {categories.map((category) => (
            <li key={category.id} className="ml-3 first:ml-0">
                <CategoryBadge category={category} />
            </li>
        ))}
    </ul>
);

export { InlineCategoryList };
