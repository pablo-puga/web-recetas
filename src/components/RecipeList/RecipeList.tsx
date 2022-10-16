import { Recipe } from '../../types';
import { RecipeDisplay } from './RecipeDisplay';

interface Props {
    recipeList: Recipe[];
}

const RecipeList = ({ recipeList }: Props) => (
    <ul className="-mt-20 sm:-mt-16 z-50 w-full max-w-xl">
        {recipeList.map((recipe) => (
            <li key={recipe.id} className="mb-3 sm:mb-4 md:mb-5 last:mb-0">
                <RecipeDisplay recipe={recipe} />
            </li>
        ))}
    </ul>
);

export { RecipeList };
