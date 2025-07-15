import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        playfair: ["var(--font-playfair)"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "var(--tw-prose-body)",
            h1: {
              fontFamily: "var(--font-playfair)",
              fontWeight: "400",
              lineHeight: "1.2",
              marginBottom: "1.5rem",
            },
            h2: {
              fontFamily: "var(--font-playfair)",
              fontWeight: "400",
              lineHeight: "1.3",
              marginTop: "2.5rem",
              marginBottom: "1rem",
            },
            h3: {
              fontFamily: "var(--font-playfair)",
              fontWeight: "400",
            },
            h4: {
              fontFamily: "var(--font-playfair)",
              fontWeight: "400",
            },
            p: {
              marginBottom: "1.5rem",
              lineHeight: "1.7",
            },
            a: {
              color: "#000",
              textDecoration: "underline",
              textDecorationColor: "rgba(0,0,0,0.3)",
              fontWeight: "500",
              "&:hover": {
                textDecorationColor: "rgba(0,0,0,0.7)",
              },
            },
            ul: {
              marginBottom: "1.5rem",
            },
            li: {
              marginBottom: "0.5rem",
            },
            img: {
              borderRadius: "0.5rem",
            },
            blockquote: {
              fontStyle: "italic",
              borderLeftColor: "rgba(0,0,0,0.1)",
              fontFamily: "var(--font-playfair)",
            },
          },
        },
        lg: {
          css: {
            fontSize: "1.125rem",
            lineHeight: "1.7",
            p: {
              marginBottom: "1.5rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/aspect-ratio"), require("@tailwindcss/typography")],
} satisfies Config

export default config
