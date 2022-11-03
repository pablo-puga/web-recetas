const genPages = (maxPages: number) =>
    Array.from({ length: maxPages }, (v, k) => k + 1).slice(1);

export { genPages };
