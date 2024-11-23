/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        xxs: "360px", // Extra small devices
        xs: "480px", // Small devices
        sm: "640px", // Small (default Tailwind)
        md: "768px", // Medium (default Tailwind)
        lg: "1024px", // Large (default Tailwind)
        xl: "1280px", // Extra Large (default Tailwind)
        "2xl": "1536px", // 2X Large (default Tailwind)
        "4k": "2560px", // Custom for 4K screens
      },
    },
  },
  plugins: [],
};
