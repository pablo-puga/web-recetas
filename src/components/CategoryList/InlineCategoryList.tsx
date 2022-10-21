import { Category } from '../../types';
import { CategoryBadge } from '../CategoryBadge';

const InlineCategoryList = ({ categories }: { categories: Category[] }) => (
    <ul className="inline-flex flex-row flex-wrap">
        {categories.map((category) => (
            <li key={category.id} className="ml-3 first:ml-0">
                <CategoryBadge category={category} />
            </li>
        ))}
    </ul>
);

export { InlineCategoryList };
