import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)", canvas: "var(--canvas)", surface: "var(--surface)",
        raised: "var(--raised)", muted: "var(--muted)", line: "var(--line)",
        champagne: "var(--champagne)", success: "var(--success)", alert: "var(--alert)",
      },
      fontFamily: { sans: ["var(--font-manrope)"], serif: ["var(--font-fraunces)"] },
      borderRadius: { xs: "4px", sm: "6px", md: "8px" },
      boxShadow: { soft: "0 14px 36px rgba(0,0,0,.18)", lift: "0 20px 54px rgba(0,0,0,.26)" },
      spacing: { "18": "4.5rem", "22": "5.5rem", "30": "7.5rem" },
      keyframes: {
        rise: { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { boxShadow: "0 0 0 0 rgba(201,176,124,0)" }, "50%": { boxShadow: "0 0 0 8px rgba(201,176,124,.12)" } },
        shimmer: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
      },
      animation: { rise: "rise .55s ease-out both", "pulse-soft": "pulseSoft 1.2s ease-out", shimmer: "shimmer 1.6s linear infinite" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
