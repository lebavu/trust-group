/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e2f8d",
        secondary: "#5bb460",
      },
      fontSize: {
        20: "2rem",
        24: "2.4rem",
        26: "2.6rem",
        30: "3rem",
        40: "4rem",
        50: "5rem",
      },
    },
  },
  plugins: [],
};
