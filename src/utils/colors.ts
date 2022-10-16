const stringColorToTheme = (color: string) => {
    switch (color) {
        case 'grey':
            return 'theme-grey-dark';
        case 'brown':
        case 'orange':
        case 'yellow':
        case 'green':
        case 'blue':
        case 'purple':
        case 'pink':
        case 'red':
            return `theme-${color.toLowerCase()}`;
        default:
            return 'theme-grey-light';
    }
};

export { stringColorToTheme };
