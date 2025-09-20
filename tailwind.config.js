/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        base: "1.125rem", // sets text-lg (1.125rem) as the base size
      },
      colors: {
        primary: "#279D84", // Deep Teal Green
        "primary-hover": "#1E7C69", // Darker shade for hover
        secondary: "#E7CDAE", // Warm Beige Sand
        "secondary-hover": "#D4B38D", // Darker Beige
        accent: "#703C00", // Dark Burnt Umber
        "accent-hover": "#5A2F00", // Darker Umber
        neutral: "#DFF2EF", // Soft Mint Green
        "neutral-hover": "#C5E6E1", // Muted Mint
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#279D84",
          secondary: "#E7CDAE",
          accent: "#703C00",
          neutral: "#DFF2EF",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
