import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.indigo.600'),
              '&:hover': {
                color: theme('colors.indigo.800'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    typography,
    plugin(function ({ addUtilities }) {
      const scrollbarStyles = {
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#4A5568 #EDF2F7',
        },
        '.scrollbar-thumb': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#4A5568',
            borderRadius: '9999px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#EDF2F7',
          },
        },
      };

      addUtilities(scrollbarStyles);
    }),
  ],
};

export default config;