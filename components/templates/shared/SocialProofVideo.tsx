'use client';

import { useState } from 'react';

interface SocialProofVideoProps {
  /** Video URL from the social_proof entry (item.url). */
  src?: string | null;
  /**
   * Extra classes for the outer wrapper — use this to match each template's
   * card styling (rounded corners, border, background, spacing, etc).
   */
  className?: string;
  /**
   * Extra classes for the <video> element itself, if a template needs to
   * override sizing (rare — the defaults already handle mobile/desktop).
   */
  videoClassName?: string;
  /**
   * Set this when the wrapper already has a fixed/aspect-ratio size (e.g. an
   * `aspect-square` grid cell) and the video should fill it edge-to-edge
   * instead of using its own natural-height + max-height cap. The video
   * still uses `object-contain` so it letterboxes instead of stretching.
   */
  fill?: boolean;
}

/**
 * Renders a single video social-proof item as an actual <video> element.
 *
 * - Never autoplays and is never forced muted-autoplay (browsers require
 *   muted for autoplay, so we simply don't autoplay at all — the visitor
 *   presses play).
 * - `object-contain` + a max-height cap means portrait/vertical clips are
 *   letterboxed instead of being cropped or stretched into a landscape box,
 *   and the card can't grow to an unreasonable height on mobile.
 * - `w-full h-auto` keeps it responsive and never causes horizontal
 *   overflow, since it can never exceed its parent's width.
 * - If `src` is missing, or the browser fails to load/play the source, the
 *   component just renders nothing rather than showing a broken player or
 *   throwing — the rest of the page (and the rest of the social proof grid)
 *   is unaffected.
 */
export function SocialProofVideo({ src, className = '', videoClassName = '', fill = false }: SocialProofVideoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  const sizingClasses = fill
    ? 'w-full h-full'
    : 'w-full h-auto max-h-[420px] sm:max-h-[520px]';

  return (
    <div className={`relative w-full max-w-full overflow-hidden bg-black ${className}`}>
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        autoPlay={false}
        muted={false}
        className={`block object-contain mx-auto ${sizingClasses} ${videoClassName}`}
        onError={() => setFailed(true)}
      >
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
    </div>
  );
}
