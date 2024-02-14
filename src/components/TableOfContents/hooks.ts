import { useEffect, useRef, useState } from 'react';

const buildQuerySelector = (wrapperSelector: string) =>
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        .map((h) => `${wrapperSelector} > ${h}`)
        .join(', ');

export const useHeadersObserver = (wrapperSelector: string) => {
    const observer = useRef<IntersectionObserver>();
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const handleObserver: IntersectionObserverCallback = (entries) => {
            console.log(
                entries.map((e) => ({
                    isIntersecting: e.isIntersecting,
                    target: e.target,
                })),
            );
            entries.forEach((entry) => {
                if (entry?.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        };

        observer.current = new IntersectionObserver(handleObserver, {
            rootMargin: '0% 0% -40% 0%',
        });

        const elements = document.querySelectorAll(
            buildQuerySelector(wrapperSelector),
        );
        elements.forEach((element) => observer.current?.observe(element));

        return () => observer.current?.disconnect();
    }, [wrapperSelector]);

    return activeId;
};
