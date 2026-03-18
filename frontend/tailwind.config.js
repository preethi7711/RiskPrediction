/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        slateNight: "#09111f",
        surface: "#111b2f",
        mint: "#88f3d1",
        warning: "#ffcf66",
        critical: "#ff6f7d"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(5, 15, 35, 0.18)"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"]
      }
    }
  },
  plugins: []
};

