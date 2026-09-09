import { Layout, Award, Heart, Shirt, Gem, Headphones, LucideIcon } from 'lucide-react';

export interface NicheDef {
  id: string;
  label: string;
  emoji: string;
}

// The 5 requested niches, plus a "general" escape hatch so a store owner
// whose product doesn't fit any specific category (or who just wants to
// see everything) isn't stuck with zero options.
export const NICHES: NicheDef[] = [
  { id: 'kids', label: 'أطفال', emoji: '🧸' },
  { id: 'men', label: 'رجال', emoji: '👔' },
  { id: 'women', label: 'نساء', emoji: '👗' },
  { id: 'footwear', label: 'أحذية', emoji: '👟' }
];

export interface TemplateDef {
  id: string;
  name: string;
  icon: LucideIcon;
  // Which niches this template shows up under in step 2. Templates with
  // no dedicated design (simple/premium) are tagged for every niche so
  // every niche always has at least a couple of usable options — e.g.
  // "men" has no dedicated theme yet, so only those two show up there.
  niches: string[];
}

export const TEMPLATES: TemplateDef[] = [
  { id: 'womansfashion', name: 'ملابس النساء الفاخرة', icon: Heart, niches: ['women'] },
  { id: 'abayafashion', name: 'عبايات نسائية', icon: Heart, niches: ['women'] },
  { id: 'mensfashion', name: 'ملابس رجالية', icon: Shirt, niches: ['men'] },
  { id: 'luxury', name: 'للرجال و النساء', icon: Heart, niches: ['women', 'men'] },
  { id: 'chelqa', name: 'للفتيات و النساء', icon: Heart, niches: ['kids', 'women'] },
  { id: 'pairdz', name: 'للأولاد و البنات الصغار', icon: Shirt, niches: ['kids'] },
  { id: 'rita', name: 'أحذية نسائية', icon: Gem, niches: ['women', 'footwear'] },
  { id: 'sneakerdrop', name: 'أحذية رياضية', icon: Gem, niches: ['men', 'footwear'] },
  { id: 'gadget', name: 'أدوات إلكترونية', icon: Gem, niches: ['men', 'women'] },
  { id: 'womensbags', name: 'حقائب نسائية', icon: Heart, niches: ['women'] },
  { id: 'englishlbook', name: 'العاب اطفال', icon: Heart, niches: ['kids'] },
  { id: 'speaker', name: 'أدوات', icon: Heart, niches: ['women', 'men'] },
];

export function getTemplatesForNiche(nicheId: string): TemplateDef[] {
  return TEMPLATES.filter((t) => t.niches.includes(nicheId));
}
