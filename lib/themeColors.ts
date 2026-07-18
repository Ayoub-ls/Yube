export interface ThemeColor {
  id: string;
  label: string;
  primary: string;
  accent: string;
}

export const THEME_COLORS: ThemeColor[] = [
  { id: 'green', label: 'أخضر', primary: '#006233', accent: '#D21034' },
  { id: 'pink', label: 'وردي', primary: '#EC4899', accent: '#F9A8D4' },
  { id: 'blue', label: 'أزرق', primary: '#2563EB', accent: '#93C5FD' },
  { id: 'purple', label: 'بنفسجي', primary: '#7C3AED', accent: '#C4B5FD' },
  { id: 'orange', label: 'برتقالي', primary: '#EA580C', accent: '#FED7AA' },
  { id: 'dark', label: 'داكن', primary: '#0F172A', accent: '#10B981' },
];

export function getThemeColor(colorThemeId: string): ThemeColor {
  return THEME_COLORS.find((c) => c.id === colorThemeId) || THEME_COLORS[0];
}
