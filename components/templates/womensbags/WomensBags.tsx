"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Heart,
  ChevronDown,
  Volume2,
  Maximize2,
  X,
  MessageCircle,
  HelpCircle,
  Award,
  Zap,
  CheckCircle2,
  Globe,
  Share2,
  PhoneCall,
  Lock,
  Gift
} from 'lucide-react';
import { FashionOrderForm } from '../shared/FashionOrderForm';
import { TemplateProps } from '../types';


export default function WomensBags({ page, client }: TemplateProps) {
  // Default color list if non provided
  const colors = page.page_config?.colors && page.page_config.colors.length > 0
    ? page.page_config.colors
    : ['Standard'];


  const images = page.product_images && page.product_images.length > 0
    ? page.product_images
    : [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=85',
    ];

  // State
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || '');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lang, setLang] = useState<'ar' | 'fr'>('ar');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [likedProofs, setLikedProofs] = useState<Record<number, boolean>>({});

  const primaryColor = page.page_config?.primaryColor || '#D4A373';

  // Calculate discount percentage
  const discountPercent = page.original_price && page.original_price > page.price
    ? Math.round(((page.original_price - page.price) / page.original_price) * 100)
    : 30;

  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLike = (index: number) => {
    setLikedProofs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Color map helper for visual swatches
  const getColorHex = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('noir') || lower.includes('أسود')) return '#1E1E1E';
    if (lower.includes('beige') || lower.includes('بيج')) return '#E5D3B3';
    if (lower.includes('rose') || lower.includes('وردي')) return '#F4C2C2';
    if (lower.includes('blanc') || lower.includes('أبيض')) return '#F8F9FA';
    if (lower.includes('marron') || lower.includes('بني')) return '#6F4E37';
    if (lower.includes('rouge') || lower.includes('أحمر')) return '#8B0000';
    if (lower.includes('vert') || lower.includes('أخضر')) return '#2E5B3E';
    return primaryColor;
  };

  // Social Proof Data
  const socialProofItems = page.social_proof && page.social_proof.length > 0
    ? page.social_proof
    : [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        caption: lang === 'ar' ? 'أجمل حقيبة استلمتها! الجودة فوق الخيال والشحن كان سريع بزاف إلى وهران 😍' : 'La plus belle pochette reçue! Qualité exceptionnelle et livraison très rapide à Oran 😍'
      },
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1594223274512-ad48027321b2?auto=format&fit=crop&w=800&q=80',
        caption: lang === 'ar' ? 'التغليف فاخر والجلد عالي الجودة. شكراً لكم على المصدقية والتوصيل للعاصمة' : 'Emballage de luxe et cuir de haute qualité. Merci pour la crédibilité et la livraison à Alger'
      },
      {
        type: 'audio' as const,
        url: '#',
        caption: lang === 'ar' ? 'تسجيل صوتی من الزبونة ياسمين من قسنطينة تشكر جودة الحقيبة والمعاملة' : 'Note vocale de Yasmine (Constantine) louant la finition et le service'
      },
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
        caption: lang === 'ar' ? 'إطلالة اليوم مع حقيبتي الفاخرة الجديدة. تناسب جميع المناسبات!' : 'Look du jour avec mon nouveau sac à main chic. Idéal pour toutes les occasions!'
      }
    ];

  // Reviews Data
  const reviewItems = page.reviews && page.reviews.length > 0
    ? page.reviews
    : [
      {
        name: 'أميرة بن شريف',
        location: 'الجزائر العاصمة (Alger)',
        rating: 5,
        text: lang === 'ar'
          ? 'الحقيبة رائعة جداً! التفاصيل دقيقة والجلد ملمسه ناعم وفاخر. وصلتني في أقل من 48 ساعة وتمكنت من معاينتها قبل الدفع. أنصح بشدة!'
          : 'Sac magnifique! Les détails sont d\'une précision rare et le cuir est d\'une douceur incomparable. Reçu en 48h avec possibilité d\'inspecter avant de payer.'
      },
      {
        name: 'سارة مرابط',
        location: 'وهران (Oran)',
        rating: 5,
        text: lang === 'ar'
          ? 'اشتريت اللون البيج الذهبي وكان مطابقاً تماماً للصور. التغليف أنيق جداً يصلح كهدية فاخرة. تعامل راقي وسريع.'
          : 'J\'ai acheté la couleur Beige Doré et c\'était exactement comme sur les photos. Emballage très raffiné, parfait pour un cadeau.'
      },
      {
        name: 'مريم بولخراص',
        location: 'قسنطينة (Constantine)',
        rating: 5,
        text: lang === 'ar'
          ? 'نوعية ممتازة وحجم مثالي يسع كل أغراضي اليومية. التوصيل كان محترماً جداً وعامل التوصيل انتظر حتى تفحصت الحقيبة.'
          : 'Qualité supérieure et taille idéale pour tous mes effets personnels. Livreur très professionnel et respectueux.'
      },
      {
        name: 'فايزة حداد',
        location: 'عنابة (Annaba)',
        rating: 5,
        text: lang === 'ar'
          ? 'تصميم عصري وأنيق يضاهي الماركات العالمية مثل زارا وميشكي. فرحت بزاف بالطلب وستكون لي طلبات أخرى قريباً.'
          : 'Un design moderne et élégant comparable aux plus grandes marques internationales. Je suis ravie de mon achat.'
      }
    ];

  // FAQ Items
  const faqItems = [
    {
      qAr: 'كيف تتم عملية الشراء والدفع؟',
      qFr: 'Comment se déroule la commande et le paiement ?',
      aAr: 'الدفع يكون عند الاستلام فقط (Paiement à la livraison). بعد تأكيد طلبك، سيتصل بك فريقنا لتأكيد العنوان ثم نرسل لك الطرد مع شركة التوصيل وتدفعين بعد استلام ومعاينة الحقيبة.',
      aFr: 'Le paiement s\'effectue uniquement à la livraison. Après avoir passé votre commande, notre équipe vous contacte pour confirmer l\'adresse. Vous payez en espèces après réception et vérification.'
    },
    {
      qAr: 'هل يمكنني معاينة الحقيبة قبل الدفع لعامل التوصيل؟',
      qFr: 'Puis-je inspecter le sac avant de payer ?',
      aAr: 'نعم بكل تأكيد! يحق لك فتح الطرد وتفحص الحقيبة والتأكد من جودتها ومطابقتها للصور قبل تسليم المبلغ لموزع التوصيل.',
      aFr: 'Oui, absolument! Vous avez le droit d\'ouvrir le colis et de vérifier la qualité du sac avant de remettre l\'argent au livreur.'
    },
    {
      qAr: 'ما هي مدة التوصيل إلى ولايتي؟',
      qFr: 'Quel est le délai de livraison vers ma wilaya ?',
      aAr: 'التوصيل يستغرق من 24 إلى 48 ساعة للولايات الرئيسية والعاصمة، ومن 2 إلى 4 أيام لباقي 58 ولاية جزائرية.',
      aFr: 'La livraison prend entre 24h et 48h pour Alger et les grandes wilayas, et de 2 à 4 jours pour le reste des 58 wilayas.'
    }
  ];

  return (
    <div
      className={`min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#FCEEE9] selection:text-[#1A1A1A] ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'
        }`}
      style={{
        direction: lang === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#1A1A1A] text-[#FAF9F6] text-xs sm:text-sm py-2.5 px-4 shadow-sm border-b border-[#D4A373]/30 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center justify-center bg-[#D4A373]/20 text-[#D4A373] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#D4A373]/40">
              <Zap className="h-3 w-3 mr-1 animate-pulse text-[#D4A373]" />
              {lang === 'ar' ? 'عرض خاص' : 'Offre Spéciale'}
            </span>
            <span className="font-medium text-[#FAF9F6]/90">
              {lang === 'ar'
                ? '🚚 توصيل سريع لجميع 58 ولاية • الدفع عند الاستلام بعد المعاينة'
                : '🚚 Livraison rapide 58 Wilayas • Paiement à la livraison après inspection'}
            </span>
          </div>

          {/* Language Switcher Button */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-[#D4A373] px-3 py-1 rounded-full text-xs font-semibold transition-all border border-[#D4A373]/30 shrink-0 cursor-pointer"
            title="Changer la langue / تغيير اللغة"
          >
            <Globe className="h-3.5 w-3.5 text-[#D4A373]" />
            <span>{lang === 'ar' ? 'Français' : 'العربية'}</span>
          </button>
        </div>
      </div>

      {/* 2. BOUTIQUE HEADER / NAVBAR */}
      <header className="bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#D4A373]/20 sticky top-[37px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Brand Name */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#D4A373] p-0.5 shadow-md shadow-[#D4A373]/20">
              <div className="h-full w-full rounded-[14px] bg-[#1A1A1A] flex items-center justify-center text-[#D4A373] font-serif font-bold text-lg">
                {client.business_name ? client.business_name.charAt(0).toUpperCase() : 'B'}
              </div>
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg sm:text-xl tracking-wide text-[#1A1A1A] italic">
                {client.business_name || 'Boutique Élégance'}
              </h1>
              <p className="text-[10px] sm:text-xs text-[#D4A373] font-medium tracking-wider uppercase">
                {lang === 'ar' ? 'تشكيلة الحقائب الفاخرة 2026' : 'Collection Sacs de Luxe 2026'}
              </p>
            </div>
          </div>

          {/* Trust Ratings Pill & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#FCEEE9]/60 px-3.5 py-1.5 rounded-full border border-[#D4A373]/20">
              <div className="flex text-[#D4A373]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#D4A373] text-[#D4A373]" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1A1A1A]">4.9/5.0</span>
              <span className="text-[11px] text-gray-600 font-medium">
                ({lang === 'ar' ? '1,250+ زبونة في الجزائر' : '1250+ Clientes'})
              </span>
            </div>

            <button
              onClick={scrollToOrderForm}
              className="bg-[#1A1A1A] hover:bg-[#D4A373] text-white hover:text-[#1A1A1A] font-semibold text-xs px-5 py-2 rounded-full shadow-md shadow-black/10 transition-all flex items-center gap-1.5 cursor-pointer border border-[#D4A373]/30"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#D4A373]" />
              <span>{lang === 'ar' ? 'اطلبي الآن' : 'Commander'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 bg-gradient-to-b from-[#FCEEE9]/40 via-[#FAF9F6] to-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* GALLERY COLUMN - 7 cols */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Preview Container */}
              <div className="relative rounded-[32px] overflow-hidden bg-white border border-[#D4A373]/25 shadow-xl shadow-[#D4A373]/10 group">
                <div className="aspect-[4/3] sm:aspect-[1/1] w-full overflow-hidden bg-[#FAF9F6] relative">
                  <motion.img
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={images[activeImageIndex]}
                    alt={page.product_name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                    onClick={() => setLightboxImage(images[activeImageIndex])}
                  />

                  {/* Badges Over Image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="bg-[#1A1A1A]/90 text-[#D4A373] backdrop-blur-md text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-lg border border-[#D4A373]/30">
                      {lang === 'ar' ? '✨ جودة عالية جداً' : '✨ Haute Qualité'}
                    </span>

                    {discountPercent > 0 && (
                      <span className="bg-[#D4A373] text-[#1A1A1A] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-white/40">
                        {lang === 'ar' ? `خصم ${discountPercent}%` : `-${discountPercent}% Réduction`}
                      </span>
                    )}
                  </div>

                  {/* Zoom Button */}
                  <button
                    onClick={() => setLightboxImage(images[activeImageIndex])}
                    className="absolute bottom-4 left-4 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-[#1A1A1A] backdrop-blur-md shadow-md flex items-center justify-center transition-all cursor-pointer border border-[#D4A373]/20"
                    title={lang === 'ar' ? 'تكبير الصورة' : 'Agrandir'}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none dir-ltr">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${activeImageIndex === idx
                      ? 'border-[#D4A373] ring-2 ring-[#D4A373]/40 scale-105 shadow-md'
                      : 'border-white opacity-75 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT DETAILS COLUMN - 5 cols */}
            <div className="lg:col-span-5 space-y-6">

              {/* Category & Availability */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FCEEE9] text-[#1A1A1A] border border-[#D4A373]/30">
                    {lang === 'ar' ? 'حقيبة فاخرة للنساء' : 'Sac à main de luxe'}
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {lang === 'ar' ? 'متوفر في المخزون' : 'En Stock'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] leading-tight italic">
                  {page.product_name}
                </h2>

                <p className="text-sm font-medium text-gray-700">
                  {page.page_config?.headline ||
                    (lang === 'ar'
                      ? 'تصميم أنيق وأنوثة متناهية تجمع بين الفخامة والعملية اليومية'
                      : 'Élégance intemporelle et finition raffinée pour sublimer votre style')}
                </p>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center gap-2 pb-2 border-b border-[#D4A373]/20">
                <div className="flex text-[#D4A373]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#D4A373] text-[#D4A373]" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1A1A1A]">4.9/5</span>
                <span className="text-xs text-gray-500">
                  ({lang === 'ar' ? 'أكثر من 1,250 تقييم إيجابي' : 'Plus de 1250 avis certifiés'})
                </span>
              </div>

              {/* Price Box */}
              <div className="rounded-2xl bg-white p-4 border border-[#D4A373]/20 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">
                    {lang === 'ar' ? 'السعر الحالي / Prix actuel' : 'Prix Spécial'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-[#D4A373] font-serif">
                      {page.price.toLocaleString('fr-DZ')} <span className="text-base font-sans font-semibold text-[#1A1A1A]">د.ج</span>
                    </span>

                    {page.original_price && page.original_price > page.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {page.original_price.toLocaleString('fr-DZ')} د.ج
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FCEEE9] px-3 py-1 text-xs font-bold text-[#1A1A1A] border border-[#D4A373]/30">
                    <Gift className="h-3.5 w-3.5 text-[#D4A373]" />
                    {lang === 'ar' ? 'عرض حصري' : 'Offre Limitée'}
                  </span>
                </div>
              </div>

              {/* Colors Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1A1A1A] flex items-center justify-between">
                  <span>{lang === 'ar' ? 'اختر اللون المفضل:' : 'Choisissez la couleur:'}</span>
                  <span className="text-[#D4A373] font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((colorName) => {
                    const isSelected = selectedColor === colorName;
                    const hex = getColorHex(colorName);
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-medium border transition-all cursor-pointer ${isSelected
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md ring-2 ring-[#D4A373]'
                          : 'bg-white text-gray-700 border-[#D4A373]/20 hover:border-[#D4A373]/50'
                          }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/20 shadow-inner"
                          style={{ backgroundColor: hex }}
                        />
                        <span>{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description Snippet */}
              <div className="text-xs text-gray-700 leading-relaxed bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm">
                {page.description ||
                  (lang === 'ar'
                    ? 'مصنوعة من جلد ممتاز معالَج بعناية لمقاومة الماء والخدوش، وتحتوي على عدة جيوب داخلية منظمة مع حزام يد وحزام كتف فاخر قابل للتعديل.'
                    : 'Fabriqué en cuir synthétique haut de gamme résistant à l\'eau et aux rayures. Intérieur spacieux avec compartiments de rangement et sangle ajustable.')}
              </div>

              {/* Primary CTA Button */}
              <div className="pt-2">
                <button
                  onClick={scrollToOrderForm}
                  className="w-full relative group overflow-hidden rounded-2xl bg-[#1A1A1A] p-4 text-center text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all cursor-pointer transform active:scale-[0.99] border border-[#D4A373]/40"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#D4A373] animate-bounce" />
                    <span>{lang === 'ar' ? 'اطلبي الآن • الدفع عند الاستلام' : 'Commander Maintenant • Paiement à la livraison'}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4A373]/20 via-[#FCEEE9]/20 to-[#D4A373]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              {/* Fast Algerian Guarantees Icons */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-[#1A1A1A] pt-2">
                <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-[#D4A373]/20 shadow-sm">
                  <Truck className="h-4 w-4 text-[#D4A373] shrink-0" />
                  <span>{lang === 'ar' ? 'توصيل سريع 58 ولاية' : 'Livraison 58 Wilayas'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-[#D4A373]/20 shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-[#D4A373] shrink-0" />
                  <span>{lang === 'ar' ? 'المعاينة قبل الدفع' : 'Inspection avant paiement'}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. LUXURY FEATURES & CRAFTSMANSHIP */}
      <section className="py-12 bg-white border-y border-[#D4A373]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#D4A373] uppercase tracking-widest bg-[#FAF9F6] px-3.5 py-1 rounded-full border border-[#D4A373]/30">
              {lang === 'ar' ? 'تفاصيل الجودة والجلد' : 'Haute Couture & Finition'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-2 italic">
              {lang === 'ar' ? 'لماذا تختارين هذه الحقيبة الفاخرة؟' : 'Pourquoi choisir ce sac exclusif ?'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              {lang === 'ar'
                ? 'تم ابتكار هذا التصميم ليلائم كافة إطلالاتك اليومية والمناسبات الخاصة بأعلى معايير الأناقة.'
                : 'Conçu avec précision pour s\'adapter à toutes vos tenues et occasions spéciales.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl bg-[#FAF9F6] p-6 border border-[#D4A373]/20 text-right hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-white border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373] shadow-sm mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="font-serif font-bold text-[#1A1A1A] text-base mb-1 italic">
                {lang === 'ar' ? 'جلد فاخر مقاوم للخدش' : 'Cuir Haute Résistance'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {lang === 'ar'
                  ? 'مصنوعة من خامات راقية تحافظ على لميعها وشكلها الخارجي حتى مع الاستعمال اليومي المتكرر.'
                  : 'Matériau résistant aux rayures et à l\'eau, conserve son éclat au fil du temps.'}
              </p>
            </div>

            <div className="rounded-3xl bg-[#FAF9F6] p-6 border border-[#D4A373]/20 text-right hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-white border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373] shadow-sm mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h4 className="font-serif font-bold text-[#1A1A1A] text-base mb-1 italic">
                {lang === 'ar' ? 'إغلاق مغناطيسي ذهبي' : 'Fermeture Magnétique Dorée'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {lang === 'ar'
                  ? 'قفل ذهبي متين وعصري يمنح الحقيبة لمسة من الفخامة الأنيقة ويحمي أغراضك بأمان.'
                  : 'Serrure métallique dorée élégante et sécurisée pour protéger vos effets personnels.'}
              </p>
            </div>

            <div className="rounded-3xl bg-[#FAF9F6] p-6 border border-[#D4A373]/20 text-right hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-white border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373] shadow-sm mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h4 className="font-serif font-bold text-[#1A1A1A] text-base mb-1 italic">
                {lang === 'ar' ? 'توصيل سريع وسلس' : 'Livraison Rapide'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {lang === 'ar'
                  ? 'نوصل طردك إلى باب المنزل أو المكتب في جميع 58 ولاية مع إمكانية المعاينة قبل الدفع.'
                  : 'Livraison sécurisée à domicile sur les 58 wilayas d\'Algérie avec inspection.'}
              </p>
            </div>

            <div className="rounded-3xl bg-[#FAF9F6] p-6 border border-[#D4A373]/20 text-right hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-white border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373] shadow-sm mb-4">
                <Gift className="h-6 w-6" />
              </div>
              <h4 className="font-serif font-bold text-[#1A1A1A] text-base mb-1 italic">
                {lang === 'ar' ? 'تغليف هدية راقي' : 'Coffret Cadeau Élégant'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {lang === 'ar'
                  ? 'تصلك الحقيبة في صندوق فاخر ومحمي، مما يجعلها هدية مثالية لنفسكِ أو لمن تحبين.'
                  : 'Chaque sac est soigneusement emballé dans un coffret de présentation haut de gamme.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ORDER FORM SECTION (PLACEHOLDER RESERVED FOR REUSABLE FashionOrderForm) */}
      <section id="order-form-container" className="py-12 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#FCEEE9] text-[#1A1A1A] font-bold text-xs px-3.5 py-1.5 rounded-full border border-[#D4A373]/30 mb-3">
            <ShoppingBag className="h-4 w-4 text-[#D4A373]" />
            <span>{lang === 'ar' ? 'طلب المنتج السريع' : 'Formulaire de Commande'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] italic">
            {lang === 'ar' ? 'اكتمل اختياركِ؟ اطلبي الآن بسهولة' : 'Passez votre commande en un instant'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {lang === 'ar'
              ? 'قومي بتأكيد معلوماتكِ وسيتم التواصل معكِ هاتفياً لتسليم الطرد إلى باب منزلكِ.'
              : 'Remplissez vos coordonnées ci-dessous pour valider votre livraison.'}
          </p>
        </div>

        {/* FashionOrderForm Placeholder Insertion */}
        <FashionOrderForm
          pageId={page.id}
          clientId={client.id}
          pageSlug={client.slug}
          productName={page.product_name}
          price={page.price}
          selectedColorName={selectedColor}
          onColorChange={setSelectedColor}
          colors={colors}
          selectedSize={"standard"}
          sizes={["standard"]}
          onSizeChange={() => { }}
          primaryColor={primaryColor || "#D4A373"}
        />
      </section>

      {/* 6. INSTAGRAM STYLE SOCIAL PROOF & LOOKS */}
      <section className="py-12 bg-gradient-to-b from-white via-[#FCEEE9]/20 to-white border-t border-[#D4A373]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#D4A373] bg-[#FAF9F6] px-3.5 py-1 rounded-full border border-[#D4A373]/30">
              {lang === 'ar' ? 'إطلالات الزبونات' : 'Avis & Style Clients'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-2 italic">
              {lang === 'ar' ? 'صور وتسجيلات حقيقية لزبوناتنا' : 'Photos et Note Vocale Réelles'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {lang === 'ar'
                ? 'شاركي إطلالتكِ مع حقيبتنا الجديدة عبر انستغرام للحصول على خصومات حصرية.'
                : 'Découvrez les photos authentiques de nos clientes en Algérie.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialProofItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-[#D4A373]/20 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                {item.type === 'image' && item.url ? (
                  <div className="aspect-square relative overflow-hidden bg-[#FAF9F6]">
                    <img
                      src={item.url}
                      alt="Social proof"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-[#1A1A1A]/80 backdrop-blur-md text-[#D4A373] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#D4A373]/30">
                      <Star className="h-3 w-3 fill-[#D4A373] text-[#D4A373]" />
                      <span>{lang === 'ar' ? 'زبونة موثوقة' : 'Vérifié'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-gradient-to-br from-[#FCEEE9] to-[#FAF9F6] flex flex-col items-center justify-center text-center min-h-[220px]">
                    <div className="h-14 w-14 rounded-full bg-[#1A1A1A] text-[#D4A373] flex items-center justify-center shadow-md mb-3 border border-[#D4A373]/30">
                      <Volume2 className="h-7 w-7 animate-pulse" />
                    </div>
                    <span className="text-xs font-bold text-[#1A1A1A] mb-1">
                      {lang === 'ar' ? 'تسجيل صوتي من زبونة' : 'Note vocale cliente'}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {lang === 'ar' ? 'انقري للاستماع للتقييم' : 'Écouter l\'avis vocal'}
                    </span>
                  </div>
                )}

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    "{item.caption}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => toggleLike(idx)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${likedProofs[idx] ? 'text-[#D4A373]' : 'text-gray-400 hover:text-[#D4A373]'
                        }`}
                    >
                      <Heart className={`h-4 w-4 ${likedProofs[idx] ? 'fill-[#D4A373]' : ''}`} />
                      <span>{likedProofs[idx] ? '129' : '128'}</span>
                    </button>

                    <span className="text-[10px] font-bold text-[#D4A373] bg-[#FCEEE9] px-2 py-0.5 rounded-full border border-[#D4A373]/20">
                      #AlgeriaBoutique
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="py-12 sm:py-16 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#D4A373] bg-white px-3.5 py-1 rounded-full border border-[#D4A373]/30 shadow-sm">
              {lang === 'ar' ? 'آراء العملاء' : 'Avis Clients'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-2 italic">
              {lang === 'ar' ? 'ماذا تقول زبوناتنا في مختلف الولايات؟' : 'Ce que disent nos clientes en Algérie'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewItems.map((rev, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white p-6 border border-[#D4A373]/20 shadow-sm hover:shadow-md transition-all space-y-3 text-right"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#1A1A1A] text-sm sm:text-base">
                      {rev.name}
                    </h4>
                    {rev.location && (
                      <span className="text-xs text-[#D4A373] font-medium block">
                        📍 {rev.location}
                      </span>
                    )}
                  </div>

                  <div className="flex text-[#D4A373]">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#D4A373] text-[#D4A373]" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-serif italic">
                  "{rev.text}"
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{lang === 'ar' ? 'شراء مؤكد والدفع عند الاستلام' : 'Achat vérifié'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ALGERIAN FAQ ACCORDION */}
      <section className="py-12 bg-white border-t border-[#D4A373]/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#1A1A1A] bg-[#FAF9F6] px-3.5 py-1 rounded-full border border-[#D4A373]/30">
              {lang === 'ar' ? 'أسئلة شائعة' : 'Foire Aux Questions'}
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mt-2 italic">
              {lang === 'ar' ? 'إجابات على أكثر استفساراتكم' : 'Questions Fréquemment Posées'}
            </h3>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#D4A373]/20 bg-[#FAF9F6] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-right flex items-center justify-between gap-3 text-[#1A1A1A] font-bold text-sm sm:text-base cursor-pointer"
                  >
                    <span>{lang === 'ar' ? faq.qAr : faq.qFr}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#D4A373] transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[#D4A373]/15 pt-3">
                          {lang === 'ar' ? faq.aAr : faq.aFr}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. STICKY MOBILE BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#D4A373]/30 p-3 shadow-2xl flex items-center justify-between gap-3 dir-rtl">
        <div className="flex items-center gap-2">
          <img
            src={images[0]}
            alt=""
            className="h-11 w-11 rounded-xl object-cover border border-[#D4A373]/30 shrink-0"
          />
          <div>
            <span className="text-[11px] text-gray-500 block line-clamp-1">{page.product_name}</span>
            <span className="text-sm font-bold text-[#D4A373] font-serif">
              {page.price.toLocaleString('fr-DZ')} <span className="text-xs font-sans text-[#1A1A1A]">د.ج</span>
            </span>
          </div>
        </div>

        <button
          onClick={scrollToOrderForm}
          className="bg-[#1A1A1A] hover:bg-[#D4A373] text-white hover:text-[#1A1A1A] font-bold text-xs px-5 py-2.5 rounded-full shadow-lg flex items-center gap-1.5 shrink-0 cursor-pointer border border-[#D4A373]/40"
        >
          <ShoppingBag className="h-4 w-4 text-[#D4A373]" />
          <span>{lang === 'ar' ? 'اطلبي الآن' : 'Commander'}</span>
        </button>
      </div>

      {/* 10. LIGHTBOX MODAL FOR IMAGES */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Enlarged preview"
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl border border-[#D4A373]/30"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 11. LUXURY FOOTER */}
      <footer className="bg-[#1A1A1A] text-[#FAF9F6]/80 py-10 px-4 sm:px-8 border-t border-[#D4A373]/30 text-center pb-20 lg:pb-10">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[#D4A373] text-[#1A1A1A] font-serif font-bold flex items-center justify-center">
              {client.business_name ? client.business_name.charAt(0).toUpperCase() : 'B'}
            </div>
            <span className="font-serif font-bold text-lg text-[#FAF9F6] italic">
              {client.business_name || 'Boutique Élégance'}
            </span>
          </div>

          <p className="text-xs text-gray-400 max-w-md mx-auto">
            {lang === 'ar'
              ? 'حقائب نسائية فاخرة بتصاميم استثنائية. توصيل سريع إلى جميع 58 ولاية جزائرية مع ضمان المعاينة والدفع عند الاستلام.'
              : 'Sacs à main pour femmes de haute qualité. Livraison sur les 58 wilayas d\'Algérie avec paiement à la livraison.'}
          </p>

          <div className="pt-4 border-t border-[#D4A373]/20 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 {client.business_name || 'Boutique Élégance'}. جميع الحقوق محفوظة.</span>
            <span>📍 الجزائر العاصمة - توصيل 58 ولاية</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
