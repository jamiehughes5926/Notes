module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust this path to match your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
