import { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};

export default config;
