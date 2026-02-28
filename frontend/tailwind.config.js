/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'truth-dark': '#0f172a',
                'truth-panel': '#1e293b',
                'truth-accent': '#38bdf8',
                'truth-success': '#4ade80',
                'truth-error': '#f87171',
            }
        },
    },
    plugins: [],
}
