import type { ThemeColor } from '../../lib/themeColors';

/**
 * Every template component receives exactly this data — nothing more,
 * nothing less. To build a new theme: create a component that accepts
 * these props and renders however you like with them. You control 100%
 * of the visual design; Yube only guarantees this data will be there.
 */
export interface TemplateProps {
  page: {
    id: string;
    slug: string;
    product_name: string;
    price: number;
    original_price: number | null;
    description: string | null;
    whatsapp: string | null;
    product_images: string[];
    social_proof: Array<{ type: 'image' | 'audio' | 'video'; url?: string; caption?: string }>;
    reviews: Array<{ name: string; location?: string; rating: number; text: string }>;
    page_config?: { sizes?: string[]; headline?: string; subheadline?: string; colors?: Array<{ name: string; url: string }>; [key: string]: any } | null;
  };
  client: {
    id: string;
    slug: string;
    business_name: string;
  };
  theme: ThemeColor;
}
