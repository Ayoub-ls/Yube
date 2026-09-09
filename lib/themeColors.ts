export interface ThemeColor {
  id: string;
  label: string;
  primary: string;
  accent: string;
}

// Original generic palette — kept as-is (still exported) for backward
// compatibility with anything else in the codebase that imports it
// directly, and used as the last-resort fallback in getThemeColor below.
export const THEME_COLORS: ThemeColor[] = [
  { id: 'green', label: 'أخضر', primary: '#006233', accent: '#D21034' },
  { id: 'pink', label: 'وردي', primary: '#EC4899', accent: '#F9A8D4' },
  { id: 'blue', label: 'أزرق', primary: '#2563EB', accent: '#93C5FD' },
  { id: 'purple', label: 'بنفسجي', primary: '#7C3AED', accent: '#C4B5FD' },
  { id: 'orange', label: 'برتقالي', primary: '#EA580C', accent: '#FED7AA' },
  { id: 'dark', label: 'داكن', primary: '#0F172A', accent: '#10B981' },
];

/**
 * Curated color presets per landing-page template — shown to the store
 * owner in the wizard's color step as named swatches (hex is never
 * shown, only used to paint the preview). Each template gets its own
 * hand-picked set so every option actually suits that template's
 * aesthetic, instead of forcing one generic palette onto everything.
 *
 * Ids only need to be unique within this file (they're never shown to
 * the user) — each is prefixed with a short per-template tag so two
 * templates can each have e.g. a "black / gold" option without clashing.
 */
export const TEMPLATE_COLOR_PRESETS: Record<string, ThemeColor[]> = {
  womansfashion: [
    { id: 'wf-rose-blush', label: 'روز / بلاش', primary: '#9B5C70', accent: '#E8A0B5' },
    { id: 'wf-burgundy-nude', label: 'بورجوندي / نود', primary: '#7F1D3A', accent: '#E8C4B8' },
    { id: 'wf-plum-pink', label: 'بنفسجي غامق / وردي', primary: '#581C46', accent: '#E879A9' },
    { id: 'wf-chocolate-cream', label: 'شوكولاتة / كريمي', primary: '#5A3E36', accent: '#F1E3D3' },
    { id: 'wf-black-rosegold', label: 'أسود / ذهبي وردي', primary: '#171717', accent: '#C08497' },
  ],
  mensfashion: [
    { id: 'mf-navy-gold', label: 'كحلي / ذهبي', primary: '#172033', accent: '#B58B4A' },
    { id: 'mf-black-white', label: 'أسود / أبيض', primary: '#111111', accent: '#F5F5F5' },
    { id: 'mf-charcoal-blue', label: 'فحمي / أزرق', primary: '#27272A', accent: '#2563EB' },
    { id: 'mf-forest-cream', label: 'أخضر غابي / كريمي', primary: '#17352D', accent: '#E8E1D4' },
    { id: 'mf-brown-tan', label: 'بني / بيج', primary: '#4A3026', accent: '#C19A6B' },
  ],
  abayafashion: [
    { id: 'af-black-gold', label: 'أسود / ذهبي', primary: '#171717', accent: '#C6A15B' },
    { id: 'af-emerald-gold', label: 'زمردي / ذهبي', primary: '#064E3B', accent: '#D4AF37' },
    { id: 'af-burgundy-gold', label: 'بورجوندي / ذهبي', primary: '#58151C', accent: '#D4AF37' },
    { id: 'af-navy-champagne', label: 'كحلي / شمبانيا', primary: '#172554', accent: '#E8D8B8' },
    { id: 'af-mocha-cream', label: 'موكا / كريمي', primary: '#4A3328', accent: '#E8DCCB' },
  ],
  sneakerdrop: [
    { id: 'sd-black-green', label: 'أسود / أخضر', primary: '#0F172A', accent: '#22C55E' },
    { id: 'sd-black-red', label: 'أسود / أحمر', primary: '#111111', accent: '#EF4444' },
    { id: 'sd-black-electricblue', label: 'أسود / أزرق كهربائي', primary: '#0F172A', accent: '#06B6D4' },
    { id: 'sd-white-black', label: 'أبيض / أسود', primary: '#18181B', accent: '#FFFFFF' },
    { id: 'sd-black-purple', label: 'أسود / بنفسجي', primary: '#111111', accent: '#A855F7' },
    { id: 'sd-navy-orange', label: 'كحلي / برتقالي', primary: '#172033', accent: '#F97316' },
  ],
  luxury: [
    { id: 'lx-black-gold', label: 'أسود / ذهبي', primary: '#0B0B0B', accent: '#C8A96B' },
    { id: 'lx-ivory-black', label: 'عاجي / أسود', primary: '#18181B', accent: '#F5F0E8' },
    { id: 'lx-burgundy-gold', label: 'بورجوندي / ذهبي', primary: '#4A0E1A', accent: '#C8A96B' },
    { id: 'lx-forest-gold', label: 'أخضر غابي / ذهبي', primary: '#12352B', accent: '#C6A15B' },
    { id: 'lx-navy-champagne', label: 'كحلي / شمبانيا', primary: '#111827', accent: '#E8D8B8' },
  ],
  // Templates below weren't in the original spec — palettes picked to
  // match each template's existing look and to read well for sales
  // (dark elegant base + one confident accent, good contrast, no
  // low-contrast combos).
  chelqa: [
    { id: 'ch-rose-gold', label: 'وردي غامق / ذهبي', primary: '#7A2E43', accent: '#D9A441' },
    { id: 'ch-blush-rosegold', label: 'بلاش / ذهبي وردي', primary: '#9B5C70', accent: '#E8B4C4' },
    { id: 'ch-berry-cream', label: 'توتي / كريمي', primary: '#6B1E3C', accent: '#F3E3D3' },
    { id: 'ch-lavender-plum', label: 'لافندر / بنفسجي', primary: '#4A2545', accent: '#C98BC3' },
    { id: 'ch-black-rose', label: 'أسود / وردي', primary: '#1A1A1A', accent: '#E8A0B5' },
  ],
  pairdz: [
    { id: 'pz-green-gold', label: 'أخضر جزائري / ذهبي', primary: '#0F5132', accent: '#D4AF37' },
    { id: 'pz-navy-sky', label: 'كحلي / سماوي', primary: '#0F2A4A', accent: '#38BDF8' },
    { id: 'pz-orange-cream', label: 'برتقالي / كريمي', primary: '#C2410C', accent: '#FEF3C7' },
    { id: 'pz-purple-yellow', label: 'بنفسجي / أصفر', primary: '#5B21B6', accent: '#FACC15' },
    { id: 'pz-teal-coral', label: 'تركواز / كورال', primary: '#0F766E', accent: '#FB7185' },
  ],
  rita: [
    { id: 'rt-onyx-gold', label: 'أسود / ذهبي', primary: '#0F0F13', accent: '#CF9B32' },
    { id: 'rt-espresso-champagne', label: 'بني غامق / شمبانيا', primary: '#3B2A20', accent: '#E8D8B8' },
    { id: 'rt-wine-rosegold', label: 'نبيذي / ذهبي وردي', primary: '#4A0E1A', accent: '#C08497' },
    { id: 'rt-charcoal-silver', label: 'فحمي / فضي', primary: '#1E1E24', accent: '#C7CDD6' },
    { id: 'rt-black-emerald', label: 'أسود / زمردي', primary: '#111111', accent: '#10B981' },
  ],
  gadget: [
    { id: 'gd-graphite-amber', label: 'غرافيت / كهرماني', primary: '#0A0A0A', accent: '#F59E0B' },
    { id: 'gd-midnight-cyan', label: 'كحلي داكن / سماوي', primary: '#0B1220', accent: '#22D3EE' },
    { id: 'gd-carbon-lime', label: 'كربوني / ليموني', primary: '#111111', accent: '#A3E635' },
    { id: 'gd-slate-blue', label: 'رمادي غامق / أزرق كهربائي', primary: '#0F172A', accent: '#3B82F6' },
    { id: 'gd-black-red', label: 'أسود / أحمر', primary: '#0A0A0A', accent: '#EF4444' },
  ],
  womensbags: [
    { id: 'wb-terracotta-ink', label: 'تراكوتا / أسود', primary: '#B5764A', accent: '#1A1A1A' },
    { id: 'wb-camel-cream', label: 'جملي / كريمي', primary: '#8C6239', accent: '#F3E6D8' },
    { id: 'wb-rosetaupe-blush', label: 'بني وردي / بلاش', primary: '#8B5D5D', accent: '#E8C4B8' },
    { id: 'wb-black-tan', label: 'أسود / بيج', primary: '#171717', accent: '#C19A6B' },
    { id: 'wb-burgundy-gold', label: 'بورجوندي / ذهبي', primary: '#5C1A2E', accent: '#C8A96B' },
  ],
  speaker: [
    { id: 'wb-pink-ink', label: 'وردي / أسود', primary: '#111111', accent: '#F50057' },
    { id: 'wb-blue-ink', label: 'أزرق / أسود', primary: '#111827', accent: '#2563EB' },
    { id: 'wb-green-ink', label: 'أخضر / أسود', primary: '#111827', accent: '#16A34A' },
    { id: 'wb-orange-ink', label: 'برتقالي / أسود', primary: '#171717', accent: '#F97316' },
    { id: 'wb-purple-ink', label: 'بنفسجي / أسود', primary: '#18181B', accent: '#7C3AED' },
  ],
};

/**
 * Resolves a stored `color_theme` id to its {primary, accent} pair.
 *
 * Pass the page's template id when you have it — it makes the lookup
 * exact and namespace-safe. Without it (or for legacy pages saved back
 * when there was one shared palette) this falls back to searching every
 * preset list, then the original generic THEME_COLORS, so old data
 * keeps resolving correctly.
 */
export function getThemeColor(colorThemeId: string, templateId?: string): ThemeColor {
  if (templateId && TEMPLATE_COLOR_PRESETS[templateId]) {
    const match = TEMPLATE_COLOR_PRESETS[templateId].find((c) => c.id === colorThemeId);
    if (match) return match;
  }

  for (const presets of Object.values(TEMPLATE_COLOR_PRESETS)) {
    const match = presets.find((c) => c.id === colorThemeId);
    if (match) return match;
  }

  const legacyMatch = THEME_COLORS.find((c) => c.id === colorThemeId);
  if (legacyMatch) return legacyMatch;

  return (templateId && TEMPLATE_COLOR_PRESETS[templateId]?.[0]) || THEME_COLORS[0];
}

/**
 * The list of presets to offer for a given template in the wizard.
 * Falls back to the original generic palette for any template that
 * doesn't (yet) have a dedicated set, so a new template never ends up
 * with zero color options.
 */
export function getPresetsForTemplate(templateId: string): ThemeColor[] {
  return TEMPLATE_COLOR_PRESETS[templateId] || THEME_COLORS;
}
