/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", "system-ui", "sans-serif"],
        letter: ["Georgia", "Apple SD Gothic Neo", "serif"],
      },
      colors: {
        cream: "#fffaf1",
        roseMilk: "#ffe4ea",
        peachSoft: "#ffd7ba",
        mintSoft: "#d5f5e3",
        inkWarm: "#4b3540",
        cocoa: "#7a4e42",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(126, 71, 83, 0.18)",
        glow: "0 0 30px rgba(255, 205, 215, 0.9)",
      },
      animation: {
        shimmer: "shimmer 2.8s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
