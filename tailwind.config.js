/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        chart: {
          1: "#FF6384",
          2: "#36A2EB",
          3: "#FFCE56",
          4: "#4BC0C0",
          5: "#9966FF",
        },
      },
    },
  },
  plugins: [],
};
