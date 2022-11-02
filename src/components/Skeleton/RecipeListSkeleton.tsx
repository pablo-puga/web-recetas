import { useEffect, useState } from 'react';

import { Line } from './Line';

const RecipeListSkeleton = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => setIsLoaded(true), []);

    return (
        <section className="w-full max-w-xl">
            <ul className="-mt-20 sm:-mt-16 z-50 w-full">
                {Array.from({ length: 5 }, (v, k) => k).map((index) => (
                    <li key={index} className="mb-3 sm:mb-4 md:mb-5 last:mb-0 ">
                        <div className="bg-gray-50 drop-shadow shadow-theme-grey-dark rounded-sm px-3 py-3 w-full flex flex-col gap-3">
                            <Line
                                isLoaded={isLoaded}
                                width="80%"
                                height="16px"
                            />
                            <Line
                                isLoaded={isLoaded}
                                width="40%"
                                height="12px"
                                minWidth="100px"
                            />
                            <div className="flex flex-row gap-2">
                                <Line
                                    isLoaded={isLoaded}
                                    width="10%"
                                    height="12px"
                                    minWidth="40px"
                                />
                                <Line
                                    isLoaded={isLoaded}
                                    width="10%"
                                    height="12px"
                                    minWidth="40px"
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export { RecipeListSkeleton };
