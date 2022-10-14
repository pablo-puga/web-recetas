const withOpacityValue = (variable) => {
    return ({ opacityValue }) => {
        if (opacityValue === undefined) {
            return `rgb(${variable})`;
        }
        return `rgb(${variable} / ${opacityValue})`;
    };
};

module.exports = {
    darkMode: 'class',
    mode: 'jit',
    content: ['./src/**/*.{ts,tsx}'],
    prefix: '',
    theme: {
        extend: {
            colors: {
                'theme-black': withOpacityValue('40 42 54'),
                'theme-grey': {
                    dark: withOpacityValue('68 71 90'),
                    light: withOpacityValue('188 194 205'),
                },
                'theme-white': withOpacityValue('248 248 242'),
                'theme-yellow': withOpacityValue('251 231 198'),
                'theme-green': withOpacityValue('180 248 200'),
                'theme-blue': withOpacityValue('160 231 229'),
                'theme-pink': withOpacityValue('255 174 188'),
            },
            fontFamily: {
                roboto: ['Roboto', 'Arial', 'Noto Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
    future: {
        purgeLayersByDefault: true,
        removeDeprecatedGapUtilities: true,
    },
};
