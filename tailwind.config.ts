/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './src/renderer/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'podcast-blue': '#2563eb',
                'podcast-green': '#16a34a',
            },
            keyframes: {
                wave: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                wave: 'wave 1.5s linear infinite',
            },
        },
    },
    plugins: [],
}
