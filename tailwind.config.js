/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Organic Neobrutalism Palette
                earth: {
                    50: '#fefae0', // Background
                    100: '#faedcd',
                    200: '#e9edc9',
                    300: '#d4a373',
                    400: '#dda15e', // Primary
                    500: '#bc6c25', // Accent
                    600: '#606c38', // Muted Green
                    700: '#283618', // Deep Green / Text
                    800: '#1c1917',
                    900: '#0c0a09',
                },
                primary: {
                    DEFAULT: '#dda15e',
                    foreground: '#283618',
                },
                secondary: {
                    DEFAULT: '#606c38',
                    foreground: '#fefae0',
                },
                accent: {
                    DEFAULT: '#bc6c25',
                    foreground: '#fefae0',
                },
                background: '#fefae0',
                surface: '#ffffff',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                display: ['Outfit', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            boxShadow: {
                'neobrutalism': '4px 4px 0px 0px #283618',
                'neobrutalism-sm': '2px 2px 0px 0px #283618',
                'neobrutalism-lg': '6px 6px 0px 0px #283618',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            }
        },
    },
    plugins: [],
}
