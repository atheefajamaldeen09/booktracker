import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          bg: "#1C1009",
          surface: "#2A1C0F",
          raised: "#3D2B18",
          primary: "#C8813A",
          secondary: "#D4A853",
          highlight: "#F5E6D0",
          textPrimary: "#F5ECD7",
          textSecondary: "#A89070",
          success: "#7A9E7E",
          star: "#E8A030",
          border: "#4A3020",
        },
      },
      fontFamily: {
        sans: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;