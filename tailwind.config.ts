import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Zeotap brand palette (from existing dark-system.css)
        brand: {
          cyan: '#38bdf8',
          blue: '#3b82f6',
          purple: '#a855f7',
          green: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          indigo: '#6366f1',
        },
        // Background layers
        bg: {
          primary: '#020617',
          secondary: '#0f172a',
          surface: '#111827',
          elevated: '#1e293b',
          hover: 'rgba(255, 255, 255, 0.04)',
        },
        // Text hierarchy
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#8b9ab8', // Fixed from #64748b for WCAG AA
          accent: '#93c5fd',
        },
        // Borders
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.04)',
          strong: 'rgba(255, 255, 255, 0.14)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.2)',
        card: '0 4px 24px rgba(0, 0, 0, 0.2)',
        modal: '0 32px 80px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
        'gradient-blue': 'linear-gradient(135deg, #3b82f6, #6366f1)',
        'gradient-green': 'linear-gradient(135deg, #10b981, #059669)',
        'gradient-surface': 'linear-gradient(135deg, #0f172a, #1e293b)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-out-right': 'slideOutRight 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.2s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(120%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(120%)', opacity: '0' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.25)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
