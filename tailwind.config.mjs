const withOpacityValue = (variable) => {
    return ({ opacityValue }) => {
        if (opacityValue === undefined) {
            return `rgb(${variable})`;
        }
        return `rgb(${variable} / ${opacityValue})`;
    };
};

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'theme-black': withOpacityValue('40 42 54'),
                'theme-grey': {
                    dark: withOpacityValue('68 71 90'),
                    light: withOpacityValue('188 194 205'),
                },
                'theme-white': withOpacityValue('255 255 250'),
                'theme-red': withOpacityValue('253 93 93'),
                'theme-coral': withOpacityValue('255 128 128'),
                'theme-yellow': withOpacityValue('255 247 188'),
                'theme-green': withOpacityValue('192 237 166'),
            },
            fontFamily: {
                opensans: ['OpenSans', 'sans-serif'],
            },
        },
    },
    plugins: [],
    safelist: [],
};
