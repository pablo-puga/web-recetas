import { useEffect, useState } from 'react';

import { Line } from './Line';

const RecipeDisplaySkeleton = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => setIsLoaded(true), []);

    return (
        <section className="w-full max-w-3xl">
            <div className="-mt-20 sm:-mt-16 mb-8 w-full max-w-3xl z-50 p-3 bg-gray-50 shadow shadow-theme-grey-light rounded-sm flex flex-col gap-3">
                <Line isLoaded={isLoaded} width="180px" height="30px" />
                <Line isLoaded={isLoaded} width="250px" height="15px" />
                <Line isLoaded={isLoaded} width="250px" height="15px" />
                <Line isLoaded={isLoaded} width="250px" height="15px" />
            </div>
            <div className="p-3 bg-gray-50 shadow shadow-theme-grey-light rounded-sm flex flex-col gap-3">
                <Line isLoaded={isLoaded} width="180px" height="30px" />
                <Line isLoaded={isLoaded} width="200px" height="20px" />
                <Line isLoaded={isLoaded} width="150px" height="15px" />
                <Line isLoaded={isLoaded} width="150px" height="15px" />
                <Line isLoaded={isLoaded} width="150px" height="15px" />
                <Line isLoaded={isLoaded} width="200px" height="20px" />
                <Line isLoaded={isLoaded} width="85%" height="15px" />
                <Line isLoaded={isLoaded} width="85%" height="15px" />
                <Line isLoaded={isLoaded} width="85%" height="15px" />
                <Line isLoaded={isLoaded} width="85%" height="15px" />
                <Line isLoaded={isLoaded} width="85%" height="15px" />
            </div>
        </section>
    );
};

export { RecipeDisplaySkeleton };
