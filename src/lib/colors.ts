// src/lib/colors.ts - Preset color configurations for Yube generated pages

export interface ColorPreset {
  primary: string;
  accent: string;
  bgGradient: string;
  textOnPrimary: string;
  badgeBg: string;
}

export const COLOR_PRESETS: Record<string, ColorPreset> = {
  green: {
    primary: '#006233', // Algeria Green
    accent: '#D21034', // Flag Red
    bgGradient: 'from-emerald-50 to-emerald-100',
    textOnPrimary: 'text-white',
    badgeBg: 'bg-emerald-100 text-emerald-800'
  },
  pink: {
    primary: '#EC4899',
    accent: '#F43F5E',
    bgGradient: 'from-pink-50 to-pink-100',
    textOnPrimary: 'text-white',
    badgeBg: 'bg-pink-100 text-pink-800'
  },
  blue: {
    primary: '#1D4ED8',
    accent: '#F59E0B', // Warm amber accent
    bgGradient: 'from-blue-50 to-blue-100',
    textOnPrimary: 'text-white',
    badgeBg: 'bg-blue-100 text-blue-800'
  },
  purple: {
    primary: '#7C3AED',
    accent: '#10B981',
    bgGradient: 'from-purple-50 to-purple-100',
    textOnPrimary: 'text-white',
    badgeBg: 'bg-purple-100 text-purple-800'
  },
  orange: {
    primary: '#EA580C',
    accent: '#1E3A8A',
    bgGradient: 'from-orange-50 to-orange-100',
    textOnPrimary: 'text-white',
    badgeBg: 'bg-orange-100 text-orange-800'
  },
  dark: {
    primary: '#0F172A',
    accent: '#10B981',
    bgGradient: 'from-slate-800 to-slate-900',
    textOnPrimary: 'text-white',
    badgeBg: 'bg-slate-200 text-slate-800'
  }
};
