/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#f5f5f5",
        },
      },
      colors: {
        gray: {
          100: "#f5f5f5",
          800: "#1a1a1a",
          900: "#0d0d0d",
        },
      },
      boxShadow: {
        
        neumorphic:
          "8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.8)",
        "neumorphic-hover":
          "12px 12px 24px rgba(0, 0, 0, 0.2), -12px -12px 24px rgba(255, 255, 255, 0.9)",
        "neumorphic-inset":
          "inset 6px 6px 12px rgba(0, 0, 0, 0.15), inset -6px -6px 12px rgba(255, 255, 255, 0.8)",
        "neumorphic-sm":
          "4px 4px 8px rgba(0, 0, 0, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.8)",
        "neumorphic-lg":
          "24px 24px 48px rgba(0, 0, 0, 0.2), -24px -24px 48px rgba(255, 255, 255, 0.9)",
        "neumorphic-error":
          "inset 6px 6px 12px rgba(220, 38, 38, 0.15), inset -6px -6px 12px rgba(255, 255, 255, 0.8), 0 0 0 1px rgba(220, 38, 38, 0.3)",

        // Dark mode 
        "dark-neumorphic":
          "8px 8px 16px rgba(0, 0, 0, 0.7), -8px -8px 16px rgba(80, 80, 80, 0.3)",
        "dark-neumorphic-hover":
          "12px 12px 24px rgba(0, 0, 0, 0.8), -12px -12px 24px rgba(120, 120, 120, 0.35)",
        "dark-neumorphic-inset":
          "inset 6px 6px 12px rgba(0, 0, 0, 0.6), inset -6px -6px 12px rgba(90, 90, 90, 0.35)",
        "dark-neumorphic-sm":
          "4px 4px 8px rgba(0, 0, 0, 0.6), -4px -4px 8px rgba(90, 90, 90, 0.3)",
        "dark-neumorphic-lg":
          "24px 24px 48px rgba(0, 0, 0, 0.75), -24px -24px 48px rgba(100, 100, 100, 0.4)",
        "dark-neumorphic-error":
          "inset 6px 6px 12px rgba(185, 28, 28, 0.4), inset -6px -6px 12px rgba(90, 90, 90, 0.35), 0 0 0 1px rgba(248, 113, 113, 0.4)",
      },
      transitionProperty: {
        shadow: "box-shadow",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["hover", "active", "dark"],
      backgroundColor: ["dark"],
      textColor: ["dark"],
    },
  },
  plugins: [],
};
