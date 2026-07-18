---
name: Lumina Tech Arabic
colors:
  surface: '#faf8fe'
  surface-dim: '#dad9df'
  surface-bright: '#faf8fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf3'
  surface-container-high: '#e9e7ed'
  surface-container-highest: '#e3e2e7'
  on-surface: '#1a1b1f'
  on-surface-variant: '#414755'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#5a5c5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#737576'
  on-tertiary-container: '#fcfcfe'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e4'
  tertiary-fixed-dim: '#c6c6c8'
  on-tertiary-fixed: '#1a1c1d'
  on-tertiary-fixed-variant: '#454749'
  background: '#faf8fe'
  on-background: '#1a1b1f'
  surface-variant: '#e3e2e7'
typography:
  display-lg:
    fontFamily: Cairo
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
  display-lg-mobile:
    fontFamily: Cairo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Cairo
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Cairo
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Cairo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Cairo
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  button:
    fontFamily: Cairo
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

This design system is engineered for a premium Direct-to-Consumer (DTC) gadget experience, specifically optimized for Modern Standard Arabic and Right-to-Left (RTL) reading patterns. The aesthetic blends the precision of high-end consumer electronics with the approachability of modern e-commerce.

The design style is **Corporate / Modern** with a **Minimalist** foundation. It leverages high-quality product photography against expansive whitespace to evoke a sense of clarity and sophistication. Every interaction is designed to feel deliberate, using subtle transitions and high-fidelity depth to guide the user through the conversion funnel. The emotional response is one of trust, innovation, and frictionless luxury.

## Colors

The palette is anchored by a high-contrast foundation of Clean White (#FFFFFF) and Charcoal Gray (#111111). 

- **Primary (Electric Blue):** Reserved exclusively for high-priority calls to action and interactive states. This ensures the conversion path is always visually distinct.
- **Secondary (Charcoal):** Used for primary text and structural elements to provide a grounded, premium feel.
- **Tertiary (Soft Gray):** Utilized for background sections and container fills to create subtle separation without introducing heavy borders.
- **Functional Gradients:** Use a subtle top-to-bottom linear gradient (Primary to a slightly darker #005DC2) on buttons to add a tactile, "pressable" quality.

## Typography

The typography system uses **Cairo**, a modern sans-serif typeface designed specifically for Arabic legibility. 

- **Alignment:** All text must be right-aligned. Ensure that punctuation marks and numbers (Western Arabic numerals) are handled correctly within the RTL flow.
- **Hierarchy:** Use the Bold (700) weight for Display levels to create a strong editorial feel. Medium (500) and SemiBold (600) weights should be used for labels and buttons to ensure clarity against vibrant backgrounds.
- **Readability:** Line heights are slightly more generous than standard Latin settings to accommodate the verticality of Arabic script characters.

## Layout & Spacing

This design system utilizes a **Fixed Grid** for desktop and a **Fluid Grid** for mobile. 

- **Grid Logic:** A 12-column grid is used for desktop (1280px max-width). In RTL mode, column 1 begins at the right. 
- **RTL Mirroring:** All layout properties (padding-left/right, margin-left/right) are flipped. Sidebars appear on the right; navigation icons (like 'Back' arrows) are mirrored to point right.
- **Rhythm:** Use a 4px baseline grid to maintain vertical rhythm. Section gaps are generous (80px+) to emphasize a premium, uncluttered aesthetic.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layers**. 

- **Shadows:** Use extremely soft, large-radius shadows (e.g., `0px 10px 30px rgba(0,0,0,0.05)`) to lift product cards and modals off the surface. 
- **Z-Index Strategy:** Sticky elements, such as the mobile "Add to Cart" bar, should sit at the highest elevation with a subtle backdrop blur (Glassmorphism) to maintain context of the content scrolling beneath them.
- **Depth:** Avoid harsh black shadows; use a deep charcoal tint for shadows on light backgrounds to keep the appearance natural and "airy."

## Shapes

The shape language is defined by **Rounded (16px)** corners, providing a friendly yet high-tech feel. 

- **Large Containers:** Product cards and hero sections should use `rounded-xl` (24px) to create a distinct frame.
- **Interactive Elements:** Buttons and input fields use `rounded-lg` (16px) for a consistent tactile signature.
- **Icons:** Use icons with rounded terminals to match the typeface and UI corner radii.

## Components

### Buttons
- **Primary CTA:** Electric Blue background, white text, 16px corner radius. On hover, apply a slight scale (1.02x) and darken the gradient.
- **Sticky CTA (Mobile):** A fixed bar at the bottom of the viewport with a "Price" label on the right and the "Buy Now" button on the left (RTL optimized).

### Input Fields
- **Styling:** Soft gray background (#F5F5F7) with 16px rounded corners. The border should only appear on focus (2px Electric Blue).
- **Labels:** Floating labels or right-aligned labels above the field.

### Elegant Review Cards
- **Structure:** Right-aligned text. Star ratings should be mirrored (flowing right to left). Include a subtle "Verified Purchase" badge in a soft green or the primary blue.
- **Visuals:** Minimalist borders or just a soft shadow to define the card boundaries.

### Navigation
- **Header:** Centered logo with navigation links on the right and utility icons (Cart, Search) on the left.
- **Cart Drawer:** Slides in from the left side of the screen (opposite of the natural RTL flow to create a distinct "overlay" feel).