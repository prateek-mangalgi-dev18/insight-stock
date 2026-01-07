/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    blue: "#00f3ff",
                    purple: "#bc13fe",
                    green: "#0aff0a",
                },
                dark: {
                    bg: "#0a0c10",
                    card: "#13161b",
                },
                signal: {
                    red: "#ef4444",
                    amber: "#f59e0b",
                    emerald: "#10b981",
                }
            },
            fontFamily: {
                mono: ['"Space Mono"', 'monospace'],
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'neon-blue': '0 0 10px #00f3ff, 0 0 20px #00f3ff40',
                'neon-purple': '0 0 10px #bc13fe, 0 0 20px #bc13fe40',
            }
        },
    },
    plugins: [],
}
