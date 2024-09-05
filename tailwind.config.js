import { scopedPreflightStyles, isolateInsideOfContainer } from 'tailwindcss-scoped-preflight';


/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['18px', '28px'],
      xl: ['20px', '28px'],
      '2xl': ['24px', '32px'],
      '3xl': ['30px', '36px'],
      '4xl': ['36px', '40px'],
      '5xl': ['48px', '1'],
      '6xl': ['60px', '1'],
    },
    spacing: {
      '0': '0px',
      'px': '1px',
      '0.5': '2px',
      '1': '4px',
      '1.5': '6px',
      '2': '8px',
      '2.5': '10px',
      '3': '12px',
      '3.5': '14px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '11': '44px',
      '12': '48px',
      '14': '56px',
      '16': '64px',
      '20': '80px',
      '24': '96px',
      '28': '112px',
      '32': '128px',
      '36': '144px',
      '40': '160px',
      '44': '176px',
      '48': '192px',
      '52': '208px',
      '56': '224px',
      '60': '240px',
      '64': '256px',
      '72': '288px',
      '80': '320px',
      '96': '384px',

    },
    extend: {
      colors: {
        peach: "#F25E33",
        violet: "#C258DB",
        green: "#76D33A",
        lightBeige: "#F8F5F0",
      },
      fontFamily: {
        sans: ['Suisse Screen', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      screens: {
        xxl: '1500px',
        notouch: { raw: "(hover: hover)" },
      }
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require('@tailwindcss/typography'), require("tailwind-scrollbar"), require('@tailwind-plugin/expose-colors')({
    extract: ['lightBeige', 'peach', 'violet', 'green']
  }), require('@tailwindcss/forms'), scopedPreflightStyles({
    isolationStrategy: isolateInsideOfContainer('.twp', {
      except: '.no-twp', // optional, to exclude some elements under .twp from being preflighted, like external markup
    }),
  }),],
}

