# How to Build and Register a Template Manually

Follow this step-by-step checklist to design, implement, and register a new landing page template in the platform without using AI.

---

## Step 1: Initialize Files
Create a new directory for your template under `components/templates/[your-template-id]/`.
Add the following files inside that directory:
1. **`[YourTemplateName]Template.tsx`**: The main React component rendering the landing page structure.
2. **`[YourTemplateName]OrderForm.tsx`**: A client-side React component rendering the checkout form.
3. **`[your-template-id].css`**: Template-specific styles (e.g. custom Google Fonts, gradients, keyframes, transitions).

---

## Step 2: Implement the Order Form
Copy a reference order form (like `GadgetOrderForm.tsx` or `RitaOrderForm.tsx`) and adapt it.
- **Imports**: Ensure you import `submitOrder` from `../../../app/[clientSlug]/[pageSlug]/actions` and `WILAYAS` from `../../../lib/wilayas` to calculate correct shipping fees and submit entries to Supabase.
- **Props**: Define props to accept `pageId`, `clientId`, `pageSlug`, and selections (like sizes/colors).

---

## Step 3: Implement the Template Component
Your main template component should import the custom CSS stylesheet and accept `TemplateProps` (defined in `components/templates/types.ts`):
```tsx
import './[your-template-id].css';
import type { TemplateProps } from '../types';

export function YourTemplateName({ page, client, theme }: TemplateProps) {
  // 1. Setup layout (RTL dir="rtl")
  // 2. Setup state (selected color, size, active image)
  // 3. Render page content (hero, details, testimonials, trust badges)
  // 4. Embed your checkout form component
  // 5. Add a sticky mobile footer CTA
}
```

---

## Step 4: Add Seeding Data to the Database
To make the new template visible to the system, add it to the `templates` database table:
1. Open [setup.sql](file:///home/dqvy-d/Downloads/algerian-landing-page-builder/yube_fixed%20(13)/yube_project/setup.sql)
2. Locate the `insert into templates` statement block (around lines 100–135).
3. Insert a new row with your template information:
   ```sql
   (
     'your-template-id',
     'اسم القالب باللغة العربية',
     'الوصف القصير المناسب للقالب ومميزاته',
     '["product_name","price","original_price","description","product_images","social_proof","reviews"]'
   )
   ```
4. Apply the SQL statement in your database manager or Supabase SQL Editor.

---

## Step 5: Register the Template Component
To map the database template ID to your React component:
1. Open [components/templates/registry.tsx](file:///home/dqvy-d/Downloads/algerian-landing-page-builder/yube_fixed%20(13)/yube_project/components/templates/registry.tsx)
2. Import your template component.
3. Add it to the `TEMPLATE_REGISTRY` map:
   ```typescript
   export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<TemplateProps>> = {
     // ... other templates
     'your-template-id': YourTemplateName,
   };
   ```

---

## Step 6: Make the Template Selectable in the Wizards

### A. Next.js Dashboard Wizard (Admin/Client Dashboard)
1. Open [components/builder/steps/TemplateStep.tsx](file:///home/dqvy-d/Downloads/algerian-landing-page-builder/yube_fixed%20(13)/yube_project/components/builder/steps/TemplateStep.tsx)
2. Add your template metadata to the `TEMPLATES` list (assigning a representative Lucide icon):
   ```typescript
   { id: 'your-template-id', name: 'اسم القالب', desc: 'وصف القالب في خطوة الاختيار', icon: IconName }
   ```
3. If your template requires specific sizes (like shoes or clothing sizes), open [components/builder/types.ts](file:///home/dqvy-d/Downloads/algerian-landing-page-builder/yube_fixed%20(13)/yube_project/components/builder/types.ts) and add its default sizes to `SIZE_SUGGESTIONS`.
4. Open [app/dashboard/pages/new/Wizard.tsx](file:///home/dqvy-d/Downloads/algerian-landing-page-builder/yube_fixed%20(13)/yube_project/app/dashboard/pages/new/Wizard.tsx):
   - Add your template ID to `THEMES_WITH_CUSTOM_HERO` if it needs custom headlines and sizes config.
   - Add your template ID to `THEMES_WITH_COLOR_VARIANTS` if it supports custom color names assigned to photos.

### B. Vite SPA Builder (Alternative SPA panel)
1. Open [src/components/builder/PageBuilder.tsx](file:///home/dqvy-d/Downloads/algerian-landing-page-builder/yube_fixed%20(13)/yube_project/src/components/builder/PageBuilder.tsx)
2. Import your template component at the top.
3. Add `'your-template-id'` to the `templateId` React state type definition:
   ```typescript
   const [templateId, setTemplateId] = useState<'simple' | 'multivariant' | 'premium' | 'your-template-id'>('simple');
   ```
4. Insert a selectable card in Step 1 (Template choice grid).
5. Add a preview rule inside Step 10 (Live Preview section):
   ```tsx
   {templateId === 'your-template-id' && <YourTemplateName page={mockPageData} client={currentUser!} />}
   ```

---

## Step 7: Verify Everything Compiles
Run the following commands to check for syntax errors and build warnings:
- `npm run lint` (runs `tsc --noEmit` to verify TypeScript types)
- `npm run build` (verifies Next.js bundler works without errors)
