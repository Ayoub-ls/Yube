'use client';

import { useState, useEffect } from 'react';
import { VoiceNotePlayer } from '../shared/VoiceNotePlayer';
import { ChelqaOrderForm } from './ChelqaOrderForm';
import { getOptimizedImageUrl } from '../../../lib/upload';
import './chelqa.css';
import type { TemplateProps } from '../types';

// Fallback size options used only if a page doesn't have custom sizes
// configured via page_config.sizes (there's no wizard UI to set this yet
// — see the note at the bottom of this file).
const DEFAULT_SIZES = ['6', '8', '10', '12', '14', '16'];

export function ChelqaTemplate({ page, client, theme }: TemplateProps) {
  const [toast, setToast] = useState({ show: false, message: '' });
  const [activeImg, setActiveImg] = useState(page.product_images[0] || '');
  const [inWishlist, setInWishlist] = useState(false);
  const [playingAudioSrc, setPlayingAudioSrc] = useState<string | null>(null);

  const hasDiscount = !!(page.original_price && page.original_price > page.price);
  const images = page.product_images.length > 0 ? page.product_images : [''];
  const sizes: string[] = page.page_config?.sizes || DEFAULT_SIZES;
  const audioProofs = page.social_proof.filter((p) => p.type === 'audio' && p.url);
  const imageProofs = page.social_proof.filter((p) => p.type === 'image' && p.url);
  const whatsappDigits = page.whatsapp ? page.whatsapp.replace(/[^0-9]/g, '') : null;

  // Falls back gracefully for pages created before this step existed,
  // or if the client left these fields empty. The default fallback
  // keeps the nice rose-highlight treatment on the business name (see
  // .hero-title em in chelqa.css); a fully custom headline renders as
  // plain text since there's no reliable way to know which word in
  // free-typed text the client would want highlighted.
  const hasCustomHeadline = !!page.page_config?.headline;
  const headline = page.page_config?.headline;
  const subheadline = page.page_config?.subheadline || page.description || 'منتجات عالية الجودة بأسعار منطقية، توصيل لكل الولايات.';

  const showToast = (message: string) => {
    setToast({ show: true, message });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Scroll reveal — sections fade/slide in as they enter the viewport.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.chelqa-theme .reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleToggleWishlist = () => {
    const next = !inWishlist;
    setInWishlist(next);
    showToast(next ? '❤️ أُضيف للمفضلة' : '🤍 أُزيل من المفضلة');
  };

  return (
    <div className="chelqa-theme">
      <div className="announce">
        <span>|</span>
        <span>✨ جودة عالية — مريحة وأنيقة</span>
        <span>|</span>
        <span>💳 الدفع عند الاستلام متاح</span>
      </div>

      <header>
        <a href="#" className="logo">
          <span className="logo-heart">♡</span>{client.business_name}
        </a>
        <ul className="nav-links">
          <li><a href="#products">المنتج</a></li>
          {sizes.length > 0 && <li><a href="#order">دليل المقاسات</a></li>}
          <li><a href="#order">اطلبي الآن</a></li>
          <li><a href="#reviews">آراء الزبائن</a></li>
        </ul>
        <div className="header-actions">
          <a href="#order" className="btn-primary" style={{ padding: '9px 22px', fontSize: '14px' }}>
            اطلبي الآن
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-text">
            <div className="hero-badge">✦ مجموعة جديدة</div>
            <h1 className="hero-title">
              {hasCustomHeadline ? (
                headline
              ) : (
                <>
                  أناقة تبدأ<br />
                  من<br />
                  <em>{client.business_name}</em>
                </>
              )}
            </h1>
            <p className="hero-sub">{subheadline}</p>
            <div className="hero-cta-row">
              <a href="#products" className="btn-primary">🛍️ تسوّقي الآن</a>
              <a href="#order" className="btn-ghost">📦 اطلبي الآن</a>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <span className="trust-num">4.9★</span>
                <span className="trust-label">تقييم العملاء</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT */}
        <section className="single-product" id="products">
          <div className="sp-wrap">
            <div className="sp-gallery reveal">
              <div className="sp-badge">الأكثر مبيعاً</div>
              <div className="sp-main-img">
                {activeImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getOptimizedImageUrl(activeImg, 800)} alt={page.product_name} />
                ) : (
                  <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                    لا توجد صورة
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="sp-thumbs" style={{ overflowX: 'scroll' }}>
                  {images.map((img, idx) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={idx}
                      src={getOptimizedImageUrl(img, 200)}
                      alt={`صورة ${idx + 1}`}
                      className={`sp-thumb ${activeImg === img ? 'active' : ''}`}
                      onClick={() => setActiveImg(img)}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="sp-details reveal reveal-delay-2">
              <h2 className="sp-title">{page.product_name}</h2>
              <div className="sp-rating">
                <div className="sp-stars">★★★★★</div>
                <div className="sp-rating-text">({page.reviews.length || 0} تقييم)</div>
              </div>
              <div className="sp-price-wrap">
                <div className="sp-price">{page.price.toLocaleString('ar-DZ')} دج</div>
                {hasDiscount && (
                  <div className="sp-old-price">{page.original_price?.toLocaleString('ar-DZ')} دج</div>
                )}
              </div>
              {page.description && <p className="sp-desc">{page.description}</p>}
              <div className="sp-actions">
                <a
                  href="#order"
                  className="submit-btn"
                  style={{ flex: 1, marginTop: 0, textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  🛒 اطلبي الآن
                </a>
                <button
                  className={`btn-ghost ${inWishlist ? 'active' : ''}`}
                  style={{ borderRadius: '14px', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}
                  onClick={handleToggleWishlist}
                  title="المفضلة"
                >
                  {inWishlist ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <ChelqaOrderForm
          pageId={page.id}
          clientId={client.id}
          pageSlug={page.slug}
          productName={page.product_name}
          price={page.price}
          sizes={sizes}
        />

        {/* FEATURES */}
        <section className="features">
          <div className="section-header reveal">
            <div className="section-tag">لماذا {client.business_name}؟</div>
            <h2 className="section-title">نهتم بكل <span>التفاصيل</span></h2>
            <p className="section-desc">من اختيار المنتج حتى التوصيل لباب بيتك، راحتك أولويتنا</p>
          </div>
          <div className="features-grid">
            <div className="feature-card reveal reveal-delay-1">
              <span className="feature-icon">✨</span>
              <div className="feature-title">جودة عالية</div>
              <p className="feature-desc">منتجات مختارة بعناية لضمان أفضل تجربة</p>
            </div>
            <div className="feature-card reveal reveal-delay-2">
              <span className="feature-icon">✂️</span>
              <div className="feature-title">تصاميم عصرية</div>
              <p className="feature-desc">موضة راقية تجمع بين الأناقة والعملية</p>
            </div>
            <div className="feature-card reveal reveal-delay-3">
              <span className="feature-icon">🚚</span>
              <div className="feature-title">توصيل سريع</div>
              <p className="feature-desc">نوصّل لجميع ولايات الجزائر خلال 24 إلى 48 ساعة</p>
            </div>
            <div className="feature-card reveal reveal-delay-4">
              <span className="feature-icon">💳</span>
              <div className="feature-title">الدفع عند الاستلام</div>
              <p className="feature-desc">لا تدفعي حتى تستلمي طلبك وتتأكدي من جودته</p>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS — driven by page.reviews (text) and
            page.social_proof (audio voice notes / image screenshots),
            collected via the wizard, instead of hardcoded names/files. */}
        {(page.reviews.length > 0 || audioProofs.length > 0 || imageProofs.length > 0) && (
          <section className="testimonials" id="reviews">
            <div className="section-header reveal">
              <div className="section-tag">💬 آراء الزبائن</div>
              <h2 className="section-title">ثقة <span>عملائنا</span></h2>
              <p className="section-desc">تجارب حقيقية من زبائن اختاروا {client.business_name}</p>
            </div>
            <div className="testimonials-grid">
              {page.reviews.slice(0, 6).map((r, i) => (
                <div key={`review-${i}`} className={`testimonial-card reveal reveal-delay-${(i % 4) + 1}`}>
                  <div className="stars">{'★'.repeat(r.rating || 5)}</div>
                  <p className="testimonial-text">"{r.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">👩</div>
                    <div>
                      <div className="author-name">{r.name}</div>
                      {r.location && <div className="author-city">🏙️ {r.location}</div>}
                    </div>
                  </div>
                </div>
              ))}

              {audioProofs.map((proof, i) => (
                <div key={`audio-${i}`} className={`testimonial-card reveal reveal-delay-${(i % 4) + 1}`}>
                  <div className="stars">★★★★★</div>
                  {proof.caption && <p className="testimonial-text">"{proof.caption}"</p>}
                  <VoiceNotePlayer
                    src={proof.url!}
                    playingAudioSrc={playingAudioSrc}
                    onPlay={setPlayingAudioSrc}
                    onPause={() => setPlayingAudioSrc(null)}
                  />
                </div>
              ))}

              {imageProofs.map((proof, i) => (
                <div key={`image-${i}`} className={`testimonial-card reveal reveal-delay-${(i % 4) + 1}`}>
                  {proof.caption && <p className="testimonial-text">"{proof.caption}"</p>}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getOptimizedImageUrl(proof.url!, 500)}
                    alt="رأي عميل"
                    style={{ width: '100%', height: 'auto', borderRadius: '12px', marginTop: '10px', display: 'block', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {whatsappDigits && (
          <div className="whatsapp-section cta-btn reveal">
            <div className="wa-text">
              <h3>💬 تكليمينا على واتساب</h3>
              <p>استفسري عن المنتج أو حالة طلبك — نردّ خلال دقائق!</p>
            </div>
            <a
              href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(`السلام عليكم، أريد طلب من ${client.business_name}`)}`}
              className="wa-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              📱 تحدثي معنا الآن
            </a>
          </div>
        )}
      </main>

      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-logo">♡ {client.business_name}</div>
            <p className="footer-tagline">منتجات مختارة بعناية، جودة عالية، وتوصيل لكل ولايات الجزائر.</p>
          </div>
          <div>
            <div className="footer-col-title">روابط سريعة</div>
            <ul className="footer-links">
              <li><a href="#products">المنتج</a></li>
              <li><a href="#order">اطلبي الآن</a></li>
              <li><a href="#reviews">آراء الزبائن</a></li>
            </ul>
          </div>
          {whatsappDigits && (
            <div>
              <div className="footer-col-title">تواصلي معنا</div>
              <ul className="footer-links">
                <li><a href={`tel:+${whatsappDigits}`} dir="ltr">📞 {page.whatsapp}</a></li>
              </ul>
            </div>
          )}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {client.business_name} — جميع الحقوق محفوظة</span>
        </div>
      </footer>

      {whatsappDigits && (
        <a
          href={`https://wa.me/${whatsappDigits}`}
          className="wa-float"
          target="_blank"
          rel="noopener noreferrer"
          title="تواصلي معنا"
          aria-label="تواصل معنا عبر واتساب"
        >
          💬
        </a>
      )}

      <div className="sticky-bar">
        <a href="#order" className="btn-primary" style={{ flex: 1, textAlign: 'center', padding: '13px' }}>
          اطلبي الآن 🛍️
        </a>
        {whatsappDigits && (
          <a
            href={`https://wa.me/${whatsappDigits}`}
            className="btn-ghost"
            style={{ whiteSpace: 'nowrap', padding: '12px 18px' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 واتساب
          </a>
        )}
      </div>

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </div>
  );
}

/**
 * KNOWN GAP: the size selector reads from page.page_config.sizes, a
 * JSONB column that already existed in the schema but has no wizard UI
 * to set it yet. Until that's built, every page using this theme falls
 * back to DEFAULT_SIZES (kids' clothing sizes 6-16) regardless of what
 * the product actually is. Fine for the original Amourshop use case,
 * misleading for anything else — worth building a real "sizes" step (or
 * making it optional/hideable) before offering this theme to clients
 * selling something that isn't sized clothing.
 */
