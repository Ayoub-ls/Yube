// src/types.ts - Core types for Yube Platform

export interface Client {
  id: string;
  user_id: string;
  business_name: string;
  slug: string;
  email: string;
  whatsapp?: string;
  plan: 'trial' | 'basic' | 'pro' | 'agency';
  status: 'active' | 'suspended';
  pixel_id?: string;
  created_at: string;
}

export interface Review {
  name: string;
  location: string;
  rating: number; // 1-5
  text: string;
}

export interface SocialProof {
  type: 'image' | 'audio' | 'video';
  url: string;
  caption?: string;
}

export interface LandingPage {
  id: string;
  client_id: string;
  slug: string;
  template_id: 'simple' | 'multivariant' | 'premium';
  status: 'pending_review' | 'live' | 'rejected' | 'draft';
  
  // Product Info
  product_name: string;
  price: number;
  original_price?: number;
  description: string;
  whatsapp?: string;
  
  // Theme styling
  color_theme: 'green' | 'pink' | 'blue' | 'purple' | 'orange' | 'dark';
  
  // Media & Lists
  product_images: string[];
  social_proof: SocialProof[];
  reviews: Review[];
  
  // Template specific features
  page_config?: {
    variants?: { name: string; options: string[] }[]; // multivariant option grids
    features?: { icon: string; title: string; desc: string }[]; // premium feature bullets
    pain_points?: string[]; // simple "عيتي من..." section
    sizes?: string[]; // size tags list
  };
  
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Order {
  id: string;
  landing_page_id: string;
  client_id: string;
  name: string;
  phone: string;
  city: string; // Algeria 58 Wilayas
  size?: string;
  quantity: number;
  product_name?: string;
  source?: string; // e.g. landing page slug
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface Template {
  id: 'simple' | 'multivariant' | 'premium';
  name: string;
  description: string;
  preview_image: string;
  fields: string[];
  is_active: boolean;
  created_at: string;
}
