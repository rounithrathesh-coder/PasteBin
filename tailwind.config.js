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
        "surface-container-highest": "#2f3445",
        "secondary": "#ddb7ff",
        "background": "#0d1322",
        "on-error": "#690005",
        "inverse-on-surface": "#2a3040",
        "on-error-container": "#ffdad6",
        "tertiary-container": "#a15100",
        "surface-tint": "#d2bbff",
        "tertiary": "#ffb784",
        "surface-variant": "#2f3445",
        "surface": "#0d1322",
        "tertiary-fixed": "#ffdcc6",
        "secondary-fixed-dim": "#ddb7ff",
        "on-primary-fixed-variant": "#5a00c6",
        "outline": "#958da1",
        "surface-container": "#191f2f",
        "error": "#ffb4ab",
        "on-tertiary": "#4f2500",
        "primary": "#d2bbff",
        "on-secondary": "#490080",
        "primary-fixed-dim": "#d2bbff",
        "on-surface": "#dde2f8",
        "surface-container-lowest": "#080e1d",
        "on-primary-container": "#ede0ff",
        "tertiary-fixed-dim": "#ffb784",
        "on-tertiary-container": "#ffe0cd",
        "surface-container-low": "#151b2b",
        "surface-dim": "#0d1322",
        "on-primary-fixed": "#25005a",
        "on-background": "#dde2f8",
        "on-secondary-container": "#d6a9ff",
        "surface-container-high": "#242a3a",
        "primary-container": "#7c3aed",
        "secondary-container": "#6f00be",
        "primary-fixed": "#eaddff",
        "outline-variant": "#4a4455"
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
