import { SimpleTemplate } from './SimpleTemplate';
import { PremiumTemplate } from './premium/PremiumTemplate';
import { ChelqaTemplate } from './chelqa/ChelqaTemplate';
import { PairDZTemplate } from './pairdz/PairDZTemplate';
import { RitaTemplate } from './rita/RitaTemplate';
import { GadgetTemplate } from './gadget/GadgetTemplate';
import type { TemplateProps } from './types';

/**
 * TEMPLATE REGISTRY
 * ══════════════════
 * To add a new theme:
 *   1. Build a component in components/templates/ that accepts TemplateProps
 *      (see types.ts) and renders however you like.
 *   2. Import it below and add it to this map, keyed by whatever
 *      template_id string you want clients to see it as.
 *   3. Add a matching row to the `templates` table in Supabase (id, name,
 *      description) so it shows up as a selectable card in the wizard's
 *      first step — see setup.sql's "insert into templates" block for
 *      the pattern.
 * That's it — the public page route below picks the right component
 * automatically based on each landing page's stored template_id.
 *
 * Note: 'multivariant' currently points at SimpleTemplate as a
 * placeholder — the original spec called for a distinct variant/size
 * selector UI that hasn't been built yet. It's aliased here rather than
 * left broken, but it doesn't yet look any different from 'simple'.
 */
export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<TemplateProps>> = {
  simple: SimpleTemplate,
  premium: PremiumTemplate,
  chelqa: ChelqaTemplate,
  pairdz: PairDZTemplate,
  rita: RitaTemplate,
  gadget: GadgetTemplate,
};

export const DEFAULT_TEMPLATE_ID = 'simple';

export function getTemplateComponent(templateId: string): React.ComponentType<TemplateProps> {
  return TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY[DEFAULT_TEMPLATE_ID];
}
