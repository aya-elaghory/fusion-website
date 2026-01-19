/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#125B45",
        secondary: "#72B298",
        invert: "#FFFFFF",
        text: "#333333",
        accent: "#F59E0B",
        "primary-hover": "#72B298",
        "primary-light": "#125B45",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        main: "var(--main)",
        overlay: "var(--overlay)",
        bg: "var(--bg)",
        bw: "var(--bw)",
        blank: "var(--blank)",
        mtext: "var(--mtext)",
        border: "var(--border)",
        ring: "var(--ring)",
        ringOffset: "var(--ring-offset)",
        secondaryBlack: "#212121",
      },
      borderRadius: {
        base: "5px",
      },
      boxShadow: {
        shadow: "var(--shadow)",
      },
      translate: {
        boxShadowX: "4px",
        boxShadowY: "4px",
        reverseBoxShadowX: "-4px",
        reverseBoxShadowY: "-4px",
      },
      fontWeight: {
        base: "500",
        heading: "700",
      },
      fontFamily: {
        times: ["'Times New Roman'", "Times", "serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite", // Single continuous animation
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }, // Move half the content width
        },
      },
      fontSize: {
        "min-text-[1.25rem]": ["1.25rem", { lineHeight: "1.5" }],
        "min-text-[1.5rem]": ["1.5rem", { lineHeight: "1.5" }],
        "max-text-[3rem]": ["3rem", { lineHeight: "1.2" }],
        "max-text-[4rem]": ["4rem", { lineHeight: "1.2" }],
      },
       screens: {
        'xs': '403px',
        'xmd': '791px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".min-text-[1.25rem]": { fontSize: "clamp(1.25rem, 100%, 100%)" }, // Minimum 1.25rem
        ".min-text-[1.5rem]": { fontSize: "clamp(1.5rem, 100%, 100%)" },
        ".max-text-[3rem]": { fontSize: "clamp(0rem, 100%, 3rem)" }, // Maximum 3rem
        ".max-text-[4rem]": { fontSize: "clamp(0rem, 100%, 4rem)" },
      });
    },
  ],
};
