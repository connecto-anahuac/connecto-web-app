import type { Config } from "tailwindcss";

const contentGlobs: Config["content"] = [
  "./app/**/*.{ts,tsx,js,jsx,mdx}",
  "./components/**/*.{ts,tsx,js,jsx,mdx}",
  "./.storybook/**/*.{ts,tsx,js,jsx,mdx}",
];

const config: Config = {
  content: contentGlobs,
  theme: {
    extend: {},
    fontFamily: {
      //sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      inter: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      // notoSansJP: ["var(--font-noto-sans-jp)", "Noto Sans JP", "sans-serif"],
    },
  },
  plugins: [
    // function ({ addUtilities }: { addUtilities: any }) {
    //   addUtilities({
    //     ".scrollbar-none": {
    //       background: "transparent" /* 背景を透明に */,
    //       "-ms-overflow-style": "none" /* IE and Edge */,
    //       "scrollbar-width": "none" /* Firefox */,
    //     },
    //     ".scrollbar-none::-webkit-scrollbar": {
    //       display: "none" /* Safari and Chrome */,
    //     },
    //   });
    // },
  ],
};

export default config;
