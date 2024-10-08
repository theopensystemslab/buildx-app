import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    // "./pages/*.{js,ts,jsx,tsx}",
    // "./pages/**/*.{js,ts,jsx,tsx}",
    // "./src/*.{js,ts,jsx,tsx}",
    // "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2A7A6C",
        "primary-dark": "#1F5B51",
        white: "#FFFFFF",
        black: "#000000",
        safety: "#ECE81A",
        "light-grey": {
          1: "#DBDBDB",
          2: "#ECECEC",
          3: "#F0F0F0",
        },
        "dark-grey": "#9D9D9D",
        "mid-grey": {
          1: "#B4B4B4",
          2: "#CDCDCD",
        },
        grey: {
          10: "#F4F4F4",
          20: "#E0E0E0",
          30: "#C6C6C6",
          40: "#A8A8A8",
          50: "#8D8D8D",
          60: "#6F6F6F",
          70: "#525252",
          80: "#393939",
          90: "#262626",
          100: "#161616",
        },
        building: {
          1: "#FAFF00",
          2: "#FDFFAD",
          3: "#E2FFA4",
          4: "#C1F3A2",
          5: "#C8F0CF",
          6: "#B2EEDF",
          7: "#C4EFF6",
          8: "#C7E6F8",
          9: "#C3DAF4",
          10: "#CABAEC",
          11: "#BAC2EC",
          12: "#F3C3F4",
          13: "#FCBDDF",
          14: "#FD6D6D",
          15: "#BFBFBF",
        },
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Times", "serif"],
    },
  },
  plugins: [],
};

export default config;
