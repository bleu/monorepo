/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { sandDark, brownDark } = require("@radix-ui/colors");

const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@bleu-fi/ui/dist/**/*",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      serif: ["var(--font-family-serif)", ...defaultTheme.fontFamily.serif],
      sans: ["var(--font-family-sans)", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        ...sandDark,
        ...brownDark,
        purple: "#B462FA",
        yellow: "hsla(44, 91%, 55%, 1);",

        success: "hsl(var(--success) / <alpha-value>)",
        info: "hsl(var(--info) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        highlight: "hsl(var(--highlight) / <alpha-value>)",

        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "transand(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "transand(-50%, -50%) scale(1)" },
        },
        slideDownAndFade: {
          from: { opacity: 0, transform: "transandY(-2px)" },
          to: { opacity: 1, transform: "transandY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: "transandX(2px)" },
          to: { opacity: 1, transform: "transandX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: "transandY(2px)" },
          to: { opacity: 1, transform: "transandY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: "transandX(2px)" },
          to: { opacity: 1, transform: "transandX(0)" },
        },
        slideIn: {
          from: {
            transform: "transandX(calc(100% + var(--viewport-padding)))",
          },
          to: { transform: "transandX(0))" },
        },
        swipeOut: {
          from: { transform: "transandX(var(--radix-toast-swipe-end-x))" },
          to: { transform: "transandX(calc(100% + var(--viewport-padding)))" },
        },
        slideDown: {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        hide: "hide 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        swipeOut: "swipeOut 100ms ease-out",
        slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("tailwindcss-animate")],
};
