const withOpacityValue = (variable) => {
    return ({ opacityValue }) => {
        if (opacityValue === undefined) {
            return `hsl(${variable})`;
        }
        return `hsla(${variable}, ${opacityValue})`;
    };
};

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,css}'],
    theme: {
        extend: {
            colors: {
                theme: {
                    red: {
                        100: withOpacityValue('1, 57%, 95%'),
                        200: withOpacityValue('1, 57%, 80%'),
                        300: withOpacityValue('1, 57%, 70%'),
                        400: withOpacityValue('1, 57%, 60%'),
                        500: withOpacityValue('1, 57%, 50%'),
                        600: withOpacityValue('1, 57%, 40%'),
                        700: withOpacityValue('1, 57%, 30%'),
                        800: withOpacityValue('1, 57%, 20%'),
                        900: withOpacityValue('1, 57%, 15%'),
                    },
                    grey: {
                        100: withOpacityValue('0, 0%, 97%'),
                        200: withOpacityValue('0, 0%, 95%'),
                        300: withOpacityValue('0, 0%, 83%'),
                        400: withOpacityValue('0, 0%, 72%'),
                        500: withOpacityValue('0, 0%, 60%'),
                        600: withOpacityValue('0, 0%, 50%'),
                        700: withOpacityValue('0, 0%, 40%'),
                        800: withOpacityValue('0, 0%, 30%'),
                        900: withOpacityValue('0, 0%, 20%'),
                    },
                    teal: {
                        100: withOpacityValue('162, 62%, 95%'),
                        200: withOpacityValue('162, 62%, 80%'),
                        300: withOpacityValue('162, 62%, 70%'),
                        400: withOpacityValue('162, 62%, 60%'),
                        500: withOpacityValue('162, 62%, 50%'),
                        600: withOpacityValue('162, 62%, 40%'),
                        700: withOpacityValue('162, 62%, 30%'),
                        800: withOpacityValue('162, 62%, 20%'),
                        900: withOpacityValue('162, 62%, 10%'),
                    },
                    yellow: {
                        100: withOpacityValue('52, 94%, 90%'),
                        200: withOpacityValue('52, 94%, 80%'),
                        300: withOpacityValue('52, 94%, 70%'),
                        400: withOpacityValue('52, 94%, 60%'),
                        500: withOpacityValue('52, 94%, 50%'),
                        600: withOpacityValue('52, 94%, 40%'),
                        700: withOpacityValue('52, 94%, 30%'),
                        800: withOpacityValue('52, 94%, 20%'),
                        900: withOpacityValue('52, 94%, 10%'),
                    },
                    blue: {
                        100: withOpacityValue('210, 100%, 95%'),
                        200: withOpacityValue('210, 100%, 80%'),
                        300: withOpacityValue('210, 100%, 70%'),
                        400: withOpacityValue('210, 100%, 60%'),
                        500: withOpacityValue('210, 100%, 50%'),
                        600: withOpacityValue('210, 100%, 40%'),
                        700: withOpacityValue('210, 100%, 30%'),
                        800: withOpacityValue('210, 100%, 20%'),
                        900: withOpacityValue('210, 100%, 10%'),
                    },
                },
            },
            fontFamily: {
                opensans: ['OpenSans', 'sans-serif'],
            },
        },
    },
    plugins: [],
    safelist: [],
};
