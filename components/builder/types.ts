export interface PendingImage {
  id: string;
  previewUrl: string;
  uploadedUrl?: string;
  uploading: boolean;
  error?: boolean;
  // Only used by themes with color-variant image switching (see
  // THEMES_WITH_COLOR_VARIANTS in Wizard.tsx) — e.g. "بوردو" labels this
  // image as the bordeaux color option. Ignored by every other theme.
  colorLabel?: string;
}

export interface SocialProofItem {
  id: string;
  type: 'image' | 'audio' | 'video';
  url?: string;
  previewUrl?: string;
  caption: string;
  uploading: boolean;
  error?: boolean;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
}

export interface WizardData {
  niche: string;
  templateId: string;
  productName: string;
  price: string;
  originalPrice: string;
  description: string;
  images: PendingImage[];
  colorTheme: string;
  socialProof: SocialProofItem[];
  reviews: ReviewItem[];
  whatsapp: string;
  // Theme-specific extras — currently only used by templates that opt in
  // (see THEMES_WITH_CUSTOM_HERO in Wizard.tsx). Stored in landing_pages
  // .page_config, which existed in the schema but was unused before this.
  headline: string;
  subheadline: string;
  sizes: string[];
  colors: string[];
}

// Sensible starting point for themes with a size selector — editable,
// not fixed. Kept in one place so the wizard step and each theme's
// fallback rendering can't drift apart from each other.
export const DEFAULT_SIZES = ['6', '8', '10', '12', '14', '16'];

// Per-template quick-add suggestions shown in CustomHeroStep (clothing
// sizes read oddly as a shoe-size suggestion and vice versa, so each
// theme gets its own reasonable starting suggestions instead of one
// generic list).
export const SIZE_SUGGESTIONS: Record<string, string[]> = {
  womansfashion: ['S', 'M', 'L', 'XL', 'XXL'],
  luxury: ['S', 'M', 'L', 'XL', 'XXL'],
  chelqa: ['6', '8', '10', '12', '14', '16', 'S', 'M', 'L', 'XL'],
  pairdz: ['2', '4', '6', '8', '10', '12', '14', '16', 'S', 'M', 'L', 'XL'],
  rita: ['36', '37', '38', '39', '40', '41']
};
export const COLORS_SUGGESTIONS: Record<string, string[]> = {
  womansfashion: ['أسود', 'أبيض', 'أزرق', 'أخضر', 'أحمر', 'وردي'],
  luxury: ['أسود', 'أبيض', 'ذهبي', 'فضي', 'رمادي', 'بيج'],
  chelqa: ['أسود', 'أبيض', 'أزرق', 'أخضر', 'أحمر', 'وردي'],
  pairdz: ['أسود', 'أبيض', 'أزرق', 'أخضر', 'أحمر', 'وردي'],
  rita: ['أسود', 'أبيض', 'أزرق', 'أخضر', 'أحمر', 'وردي'],
  abayafashion: ['أسود', 'أبيض', 'أزرق', 'أخضر', 'أحمر', 'وردي'],
  womensbags: ['أسود', 'أبيض', 'أزرق', 'أخضر', 'أحمر', 'وردي'],

};

export const initialWizardData: WizardData = {
  niche: '',
  templateId: '',
  productName: '',
  price: '',
  originalPrice: '',
  description: '',
  images: [],
  // Left blank on purpose — the color step now shows presets specific
  // to whichever template was picked in step 2, so there's no single
  // sensible default here. ColorThemeStep auto-selects that template's
  // first preset the moment it mounts.
  colorTheme: '',
  socialProof: [],
  reviews: [],
  whatsapp: '',
  headline: '',
  subheadline: '',
  sizes: [],
  colors: [],
};

import { THEME_COLORS } from '../../lib/themeColors';

// Kept under the original name (COLOR_THEMES) and shape (.hex) so any
// existing code that still imports this generic list keeps working.
// The wizard's color step no longer uses this directly — see
// getPresetsForTemplate below for the per-template presets it uses now.
export const COLOR_THEMES = THEME_COLORS.map((c) => ({ id: c.id, label: c.label, hex: c.primary }));

export { getPresetsForTemplate, getThemeColor, TEMPLATE_COLOR_PRESETS } from '../../lib/themeColors';
export type { ThemeColor } from '../../lib/themeColors';
