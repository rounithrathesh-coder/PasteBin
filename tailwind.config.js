/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "surface": "var(--color-surface)",
        "surface-dim": "var(--color-surface-dim)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "surface-variant": "var(--color-surface-variant)",

        "on-surface": "var(--color-on-surface)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "outline": "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",

        "primary": "var(--color-primary)",
        "primary-container": "var(--color-primary-container)",
        "on-primary-container": "var(--color-on-primary-container)",

        "secondary-container": "var(--color-secondary-container)",
        "on-secondary-container": "var(--color-on-secondary-container)",

        "background": "var(--color-surface)",
        "on-background": "var(--color-on-surface)",

        "tertiary": "#ffb784",
        "tertiary-container": "#a15100",
        "error": "#ffb4ab",
        "on-error": "#690005"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "12px",
        "xl": "16px",
        "full": "9999px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
