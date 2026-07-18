'use client';

import { useEffect } from 'react';
import { trackEvent } from '../../../lib/analytics';

interface PageViewTrackerProps {
  clientSlug: string;
  pageSlug: string;
  templateId: string;
}

export function PageViewTracker({ clientSlug, pageSlug, templateId }: PageViewTrackerProps) {
  useEffect(() => {
    // GA4's sitewide config already sends an automatic page_view — this
    // is a deliberate, additional custom event carrying the extra
    // context (which client/page/template) that the automatic one
    // doesn't include, per the original analytics spec.
    trackEvent('landing_page_view', {
      client_slug: clientSlug,
      page_slug: pageSlug,
      template_id: templateId,
    });
    // Intentionally fire once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
