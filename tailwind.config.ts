import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#111111',
        card: '#181818',
        border: '#242424',
        foreground: '#F5F5F5',
        muted: '#A1A1AA',
        primary: {
          DEFAULT: '#6D28D9',
          hover: '#7C3AED',
        },
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
      fontFamily: {
        display: ['var(--font-anton)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-space-grotesk)', 'monospace'],
      },
      fontSize: {
        'display-xl': ['5.5rem', { lineHeight: '0.95', letterSpacing: '0.02em', fontWeight: '400' }],
        h1: ['3.5rem', { lineHeight: '1.0', letterSpacing: '0.01em', fontWeight: '400' }],
        h2: ['2.5rem', { lineHeight: '1.05', letterSpacing: '0.01em', fontWeight: '400' }],
        h3: ['1.75rem', { lineHeight: '1.15', letterSpacing: '0', fontWeight: '500' }],
        h4: ['1.25rem', { lineHeight: '1.25', letterSpacing: '0', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '500' }],
      },
      letterSpacing: {
        wide2: '0.15em',
        wide3: '0.25em',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px',
        section: '8rem',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.4)',
        md: '0 8px 24px -8px rgba(0,0,0,0.5)',
        lg: '0 24px 48px -16px rgba(0,0,0,0.55)',
        glow: '0 0 0 1px rgba(109,40,217,0.4), 0 8px 24px -8px rgba(109,40,217,0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'scale-in': 'scaleIn 0.2s ease forwards',
        'slide-in': 'slideIn 0.25s ease forwards',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        spin: 'spin 0.7s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
