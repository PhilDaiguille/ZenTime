/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{vue,js}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./app.vue",
    ],
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                ZenTimeLight: {
                    "primary": "#ffd47f",
                    "secondary": "#ffe4a8",
                    "accent": "#76b3be",
                    "neutral": "#d2e6dc",
                    "base-100": "#fffef8",
                    "info": "#9ec6cb",
                    "success": "#a3d9b1",
                    "warning": "#f9c97e",
                    "error": "#f28b82",
                },
            },
            {
                ZenTimeDark: {
                    "primary": "#9ec6cb",
                    "secondary": "#76b3be",
                    "accent": "#ffd47f",
                    "neutral": "#2a2e37",
                    "base-100": "#1d2025",
                    "info": "#76b3be",
                    "success": "#a3d9b1",
                    "warning": "#f9c97e",
                    "error": "#f28b82",
                },
            },
        ],
    },
}
