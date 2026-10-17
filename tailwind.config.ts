import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        typography: {
            DEFAULT: {
                css: {
                    "--tw-prose-body": "hsl(var(--foreground))",
                    "--tw-prose-headings": "hsl(var(--foreground))",
                    "--tw-prose-bold": "hsl(var(--foreground))",
                    "--tw-prose-links": "hsl(var(--accent))",
                    "--tw-prose-links-hover": "hsl(var(--accent-dark))",
                    "--tw-prose-bullets": "hsl(var(--muted))",
                    "--tw-prose-underline": "hsl(var(--accent))",
                    "--tw-prose-underline-hover": "hsl(var(--accent-dark))",
                    "--tw-prose-quotes": "hsl(var(--muted-foreground))",
                    "--tw-prose-captions": "hsl(var(--muted))",
                    "--tw-prose-th-borders": "hsl(var(--border))",
                    "--tw-prose-td-borders": "hsl(var(--border))",
                    "--tw-prose-dividers": "hsl(var(--border))",

                    color: "var(--tw-prose-body)",
                    a: {
                        color: "var(--tw-prose-links)",
                        textDecoration: "underline",
                        fontWeight: "500",
                        "&:hover": {
                            color: "var(--tw-prose-links-hover)",
                        },
                    },
                    "h1, h2, h3, h4, h5, h6": {
                        color: "var(--tw-prose-headings)",
                        fontWeight: "700",
                    },
                    h1: { fontSize: "2.25rem", lineHeight: "2.5rem" },
                    h2: { fontSize: "1.875rem", lineHeight: "2.25rem" },
                    h3: { fontSize: "1.5rem", lineHeight: "2rem" },
                    h4: { fontSize: "1.25rem", lineHeight: "1.75rem" },
                    h5: { fontSize: "1.125rem", lineHeight: "1.5rem" },
                    h6: { fontSize: "1rem", lineHeight: "1.5rem" },
                    p: { fontSize: "1rem", lineHeight: "1.5rem" },
                    strong: {
                        color: "var(--tw-prose-bold)",
                        fontWeight: "bold",
                    },
                    em: {
                        fontStyle: "italic",
                    },
                    del: {
                        textDecoration: "line-through",
                    },
                    "ul, ol": {
                        paddingLeft: "1.5rem",
                    },
                    ul: {
                        listStyleType: "disc",
                    },
                    ol: {
                        listStyleType: "decimal",
                    },
                    li: {
                        marginTop: "0.25rem",
                        marginBottom: "0.25rem",
                    },
                    blockquote: {
                        color: "var(--tw-prose-quotes)",
                        fontStyle: "italic",
                        borderLeft: "0.25rem solid var(--tw-prose-dividers)",
                        paddingLeft: "1rem",
                    },
                    img: {
                        margin: "auto",
                    },
                    iframe: {
                        width: "100%",
                        height: "auto",
                        aspectRatio: "16/9",
                        display: "block",
                        margin: "0 auto",
                    },
                    hr: {
                        borderColor: "var(--tw-prose-dividers)",
                        borderTopWidth: "1px",
                        marginTop: "2rem",
                        marginBottom: "2rem",
                    },
                },
            },
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground":
                        "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground":
                        "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
                brand: {
                    DEFAULT: "hsl(var(--brand))",
                    foreground: "hsl(var(--brand-foreground))",
                },
                highlight: {
                    DEFAULT: "hsl(var(--highlight))",
                    foreground: "hsl(var(--highlight-foreground))",
                },
                copper: "#900201",
                bronze: "#B3732A",
                silver: "#A4A4A4",
                gold: "#E6C714",
                platinum: "#49AEAC",
                emerald: "#06A458",
                diamond: "#B093FF",
                champion: "#DF1883",
                allies: "#117DD3",
                opponents: "#E6690D",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            screens: {
                "main-hover": {
                    raw: "(hover: hover)",
                },
            },
            animation: {
                jump: "jump 1.25s ease-in-out infinite",
                morph: "morph 2.5s ease-in-out infinite",
                "fade-in": "fade-in 0.75s ease",
            },
            keyframes: {
                jump: {
                    "0%, 30%, 75%, 100%": { transform: "translateY(0px)" },
                    "50%": {
                        transform: "translateY(-200%)",
                        animationTimingFunction: "ease-in",
                    },
                },
                morph: {
                    "0%, 10%, 70%, 85%, 100%": { transform: "scaleY(1)" },
                    "20%, 25%": {
                        transform: "scaleY(0.6) scaleX(1.3)",
                        animationTimingFunction: "ease-in-out",
                    },
                    "30%": {
                        transform: "scaleY(1.15) scaleX(0.9)",
                        animationTimingFunction: "ease-in-out",
                    },
                    "75%": { transform: "scaleY(0.8) scaleX(1.2)" },
                },
                "fade-in": {
                    "0%": {
                        opacity: "0",
                    },
                    "100%": {
                        opacity: "1",
                    },
                },
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("tailwind-scrollbar-hide"),
        require("@tailwindcss/typography"),
        plugin(function ({ addUtilities }) {
            addUtilities({
                ".origin-bottom": {
                    "transform-origin": "center bottom",
                },
            });
        }),
    ],
};
export default config;
