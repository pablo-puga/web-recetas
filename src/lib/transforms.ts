export const capitalize = (str: string) =>
    str
        .split(' ')
        .map((word) => {
            const letters = word.split('');
            letters[0] = letters[0].toLocaleUpperCase();
            return letters.join('');
        })
        .join(' ');
