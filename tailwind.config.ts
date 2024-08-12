import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        accent: "#FEF511",
        heading: "#1A1A1A",
        error: "#EA1A1A",
        success: "#10BC17",
      },
      boxShadow: {
        card: "0 10px 20px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
