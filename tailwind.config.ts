import type { Config } from 'tailwindcss'


const config: Config = {
    // ...
    theme: {
        extend: {
            keyframes: {
                'marquee-left': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                'marquee-right': {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(0)' },
                },
            },
            animation: {
                'marquee-left': 'marquee-left 38s linear infinite',
                'marquee-right': 'marquee-right 42s linear infinite',
            },
        },
    },
}

export default config