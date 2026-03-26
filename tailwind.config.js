/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fun: ['"Nunito"', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 4s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out 1s infinite',
        'float-delayed-2': 'float 3s ease-in-out 2s infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        pop: 'pop 0.3s ease-out',
        'star-burst': 'starBurst 0.6s ease-out forwards',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-8deg) scale(1.1)' },
          '50%': { transform: 'rotate(8deg) scale(1.1)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        starBurst: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1.5) rotate(180deg)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      colors: {
        veera: {
          pink: '#FF6B9D',
          purple: '#A855F7',
          blue: '#3B82F6',
          green: '#22C55E',
          yellow: '#FBBF24',
          orange: '#F97316',
          red: '#EF4444',
          sky: '#38BDF8',
          mint: '#34D399',
          rose: '#FB7185',
          lavender: '#C084FC',
          peach: '#FDBA74',
        },
      },
    },
  },
  plugins: [],
};
