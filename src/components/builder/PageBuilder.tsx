// src/components/builder/PageBuilder.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { LandingPage, Review, SocialProof } from '../../types';
import { COLOR_PRESETS } from '../../lib/colors';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Layout, Sparkles, Image as ImageIcon,
  Palette, ShieldCheck, Heart, Phone, Eye, CheckCircle, Plus, Trash, Star, HelpCircle, Award
} from 'lucide-react';

import { uploadImage, uploadAudio, uploadVideo } from '../../lib/upload';
import { trackEvent } from '../../lib/analytics';

import SimpleTemplate from '../templates/SimpleTemplate';
import PremiumTemplate from '../templates/PremiumTemplate';
import { GadgetTemplate } from '../../../components/templates/gadget/GadgetTemplate';

const SUGGESTED_STOCK_IMAGES = [
  { name: 'ملابس أطفال', url: 'https://images.unsplash.com/photo-1519704961756-de6fda49f943?auto=format&fit=crop&q=80&w=600' },
  { name: 'ساعة ذكية', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600' },
  { name: 'مكواة بخار', url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=600' },
  { name: 'مستحضرات تجميل', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600' },
];

export default function PageBuilder() {
  const navigate = useNavigate();
  const currentUser = db.auth.getCurrentUser();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
    }
  }, [currentUser, navigate]);

  // Track builder started
  React.useEffect(() => {
    trackEvent('builder_started', {
      template_id: templateId,
    });
  }, []);

  // Form states matching 10 steps
  const [step, setStep] = useState(1);
  const [templateId, setTemplateId] = useState<'simple' | 'multivariant' | 'premium' | 'gadget'>('simple');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number>(2900);
  const [originalPrice, setOriginalPrice] = useState<number>(3900);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<{ id: string; url: string; uploading?: boolean }[]>([]);
  const [colorTheme, setColorTheme] = useState<LandingPage['color_theme']>('green');

  // Social proof
  const [proofs, setProofs] = useState<SocialProof[]>([]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([
    { name: 'جمال', location: 'الجزائر', rating: 5, text: 'ما شاء الله منتج ذو جودة عالية وتوصيل سريع جداً.' }
  ]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('الجزائر العاصمة');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // WhatsApp
  const [whatsapp, setWhatsApp] = useState(currentUser?.whatsapp || '');

  // Meta states
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState('');
  const [error, setError] = useState('');
  const [uploadingProof, setUploadingProof] = useState(false);

  // Handle local image file conversions & uploads to Supabase + Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    const clientId = currentUser?.id || 'demo-client';

    for (const file of files) {
      if (images.length >= 8) {
        setError('يمكنك إضافة 8 صور كحد أقصى');
        break;
      }
      // Validate
      if (!file.type.startsWith('image/')) {
        setError('يرجى رفع صور فقط');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 10MB');
        continue;
      }

      // Show local preview immediately while uploading
      const localPreview = URL.createObjectURL(file);
      const tempId = Date.now().toString() + Math.random();
      setImages(prev => [...prev, {
        id: tempId,
        url: localPreview,
        uploading: true
      }]);

      try {
        const result = await uploadImage(file, clientId, 'products');

        // Replace local preview with Cloudinary URL
        setImages(prev => prev.map(img =>
          img.id === tempId
            ? { ...img, url: result.cloudinaryUrl, uploading: false }
            : img
        ));
      } catch (err: any) {
        // Remove failed upload from list
        setImages(prev => prev.filter(img => img.id !== tempId));
        setError(err.message || 'فشل رفع الصورة، حاول مرة أخرى');
      }
    }
  };

  // Select stock image
  const addStockImage = (url: string) => {
    if (images.length >= 8) return;
    setImages(prev => [...prev, { id: (Date.now() + Math.random()).toString(), url, uploading: false }]);
  };

  // Delete image
  const deleteImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Add a custom review
  const handleAddReview = () => {
    if (!newReviewName.trim() || !newReviewText.trim()) return;
    const rev: Review = {
      name: newReviewName.trim(),
      location: newReviewCity,
      rating: newReviewRating,
      text: newReviewText.trim()
    };
    setReviews(prev => [...prev, rev]);
    setNewReviewName('');
    setNewReviewText('');
    setShowReviewForm(false);
  };

  // Add social proof
  const addMockAudioProof = () => {
    setProofs(prev => [
      ...prev,
      {
        type: 'audio',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        caption: 'طلب تأكيد صوتي من زبون راضٍ'
      }
    ]);
  };

  // Handle uploading social proofs (images, audio, or video) to Supabase + Cloudinary
  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio' | 'video') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const clientId = currentUser?.id || 'demo-client';

    setUploadingProof(true);
    setError('');

    try {
      let result;
      if (type === 'image') {
        result = await uploadImage(file, clientId, 'proofs');
      } else if (type === 'audio') {
        result = await uploadAudio(file, clientId);
      } else {
        result = await uploadVideo(file, clientId);
      }

      setProofs(prev => [...prev, {
        type,
        url: result.cloudinaryUrl,
        caption: '',
      }]);
    } catch (err: any) {
      setError(err.message || 'فشل رفع ملف الإثبات الاجتماعي، حاول مرة أخرى');
    } finally {
      setUploadingProof(false);
    }
  };

  const removeProof = (idx: number) => {
    setProofs(prev => prev.filter((_, i) => i !== idx));
  };

  // Navigation steps
  const STEP_NAMES: Record<number, string> = {
    1: 'اختر القالب',
    2: 'اسم المنتج',
    3: 'تحديد السعر',
    4: 'وصف المنتج',
    5: 'صور المنتج',
    6: 'لون الصفحة',
    7: 'آراء مسموعة (إثبات اجتماعي)',
    8: 'إضافة تقييمات مكتوبة',
    9: 'تواصل واتساب',
    10: 'المعاينة والإرسال'
  };

  const nextStep = () => {
    if (step === 2 && !productName.trim()) return;
    if (step === 3 && (!price || price <= 0)) return;
    if (step === 5 && images.length === 0) {
      setError('يرجى إضافة صورة واحدة على الأقل للمنتج');
      return;
    }
    setError('');
    trackEvent('builder_step_completed', {
      step_number: step,
      step_name: STEP_NAMES[step] || '',
    });
    setStep(s => Math.min(10, s + 1));
  };

  const prevStep = () => {
    setError('');
    setStep(s => Math.max(1, s - 1));
  };

  // Submit landing page to Supabase
  const handleSubmitPage = async () => {
    if (!currentUser) return;
    setSubmitting(true);
    setError('');

    const pageSlug = productName.toLowerCase()
      .replace(/[^a-z0-9\u0621-\u064A]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const finalSlug = pageSlug || `product-${Math.floor(Math.random() * 10000)}`;

    try {
      await db.pages.create({
        client_id: currentUser.id,
        slug: finalSlug,
        template_id: templateId,
        status: 'pending_review',
        product_name: productName,
        price,
        original_price: originalPrice || undefined,
        description,
        whatsapp: whatsapp || undefined,
        color_theme: colorTheme,
        product_images: images.filter(img => !img.uploading).map(img => img.url).length > 0
          ? images.filter(img => !img.uploading).map(img => img.url)
          : [SUGGESTED_STOCK_IMAGES[0].url],
        social_proof: proofs,
        reviews: reviews,
        page_config: {
          pain_points: [
            `هل تعبت من البحث عن ${productName} بجودة حقيقية وسعر معقول؟`,
            `هل تخاف من الشراء عبر الإنترنت وتلقي منتجات تالفة ومخيبة للتطلعات؟`,
            `هل مللت من تكاليف التوصيل المرتفعة والمماطلة الطويلة في الشحن؟`
          ],
          variants: templateId === 'multivariant' ? [
            { name: 'اللون والنمط المفضل', options: ['اللون الأساسي الفاخر', 'اللون البديل الأنيق'] }
          ] : undefined,
          sizes: templateId === 'multivariant' ? ['Standard'] : undefined,
          features: templateId === 'premium' ? [
            { icon: 'Award', title: 'خامة أصلية ممتازة', desc: 'نهتم بأعلى درجات التصنيع لنضمن لك دواماً وجودة ترقى لثقتكم.' },
            { icon: 'Shield', title: 'سياسة ضمان حقيقية', desc: 'نحن نضمن حق التبديل أو الاسترجاع الفوري في حال وجود أي عيب تصنيعي.' },
            { icon: 'Gift', title: 'تغليف مميز مناسب للإهداء', desc: 'نسلمك المنتج في علبة راقية ومحكمة ليكون هدية تليق بمن تحب.' }
          ] : undefined
        }
      });

      trackEvent('page_submitted', {
        template_id: templateId,
        product_name: productName,
      });

      setSubmittedSlug(finalSlug);
      setSubmitSuccess(true);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ الصفحة. يرجى تعديل الرابط أو المحاولة لاحقاً.');
    } finally {
      setSubmitting(false);
    }
  };

  // Page Mock to render Preview in Step 10
  const mockPageData: LandingPage = {
    id: 'mock-id',
    client_id: currentUser?.id || 'demo-client',
    slug: 'preview',
    template_id: templateId,
    status: 'pending_review',
    product_name: productName || 'اسم المنتج الافتراضي',
    price: price || 2900,
    original_price: originalPrice || undefined,
    description: description || 'وصف المنتج التفصيلي يظهر هنا ليعطي زبائنك كل المعلومات الضرورية.',
    whatsapp: whatsapp || undefined,
    color_theme: colorTheme,
    product_images: images.filter(img => !img.uploading).map(img => img.url).length > 0
      ? images.filter(img => !img.uploading).map(img => img.url)
      : [SUGGESTED_STOCK_IMAGES[0].url],
    social_proof: proofs,
    reviews: reviews,
    page_config: {
      pain_points: [
        `هل تعبت من البحث عن ${productName || 'هذا المنتج'} بجودة حقيقية وسعر معقول؟`,
        'هل تخاف من الشراء عبر الإنترنت وتلقي منتجات تالفة؟',
        'هل مللت من المماطلة الطويلة في شحن الطلبيات؟'
      ],
      variants: [
        { name: 'اللون', options: ['اللون الأساسي الفاخر', 'اللون البديل الأنيق'] }
      ],
      sizes: ['M', 'L', 'XL'],
      features: [
        { icon: 'Award', title: 'خامة أصلية ممتازة', desc: 'نهتم بأعلى درجات التصنيع لنضمن لك دواماً وجودة ترقى لثقتكم.' },
        { icon: 'Shield', title: 'سياسة ضمان حقيقية', desc: 'نحن نضمن حق التبديل أو الاسترجاع الفوري في حال وجود أي عيب تصنيعي.' },
        { icon: 'Gift', title: 'تغليف مميز مناسب للإهداء', desc: 'نسلمك المنتج في علبة راقية ومحكمة ليكون هدية تليق بمن تحب.' }
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const savedAmount = originalPrice ? originalPrice - price : 0;
  const savingsPct = originalPrice ? Math.round((savedAmount / originalPrice) * 100) : 0;

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6" dir="rtl">
        <div className="flex justify-center">
          <div className="bg-emerald-100 p-6 rounded-full">
            <CheckCircle className="w-20 h-20 text-emerald-600 animate-bounce" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">تم إرسال صفحتك للمراجعة بنجاح! ✅</h1>
        <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
          سيقوم فريق الإدارة بمراجعة الصفحة وتفعيلها لتصبح منشورة للجميع خلال <span className="font-bold text-emerald-600">24 ساعة</span> بحد أقصى.
        </p>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl inline-block text-right text-sm text-gray-500">
          <ul className="space-y-1">
            <li>📌 اسم المنتج: <strong className="text-gray-800">{productName}</strong></li>
            <li>💰 السعر المعروض: <strong className="text-gray-800">{price} دج</strong></li>
            <li>🔗 رابط الصفحة المقترح: <strong className="text-gray-800 font-mono">yube.dz/{currentUser?.slug}/{submittedSlug}</strong></li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/dashboard/pages')}
            className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition cursor-pointer"
          >
            الانتقال لقائمة صفحاتي
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-200 transition cursor-pointer"
          >
            لوحة التحكم الرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
      {/* Step Progress bar */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
          <span>خطوة {step} من 10</span>
          <span className="text-emerald-600 font-bold">
            {step === 1 && 'اختر القالب'}
            {step === 2 && 'اسم المنتج'}
            {step === 3 && 'تحديد السعر'}
            {step === 4 && 'وصف المنتج'}
            {step === 5 && 'صور المنتج'}
            {step === 6 && 'لون الصفحة'}
            {step === 7 && 'آراء مسموعة (إثبات اجتماعي)'}
            {step === 8 && 'إضافة تقييمات مكتوبة'}
            {step === 9 && 'تواصل واتساب'}
            {step === 10 && 'المعاينة والإرسال'}
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(step / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-100 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Steps Transition Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm min-h-[360px] flex flex-col justify-between">

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
            >
              {/* STEP 1 - Choose Template */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900">اختر قالب صفحة الهبوط المناسب لمنتجك 📐</h2>
                    <p className="text-sm text-gray-500 mt-1">القالب يحدد شكل وطريقة عرض صفحتك للزبائن</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Simple Template */}
                    <div
                      onClick={() => setTemplateId('simple')}
                      className={`rounded-2xl p-5 border-2 text-right space-y-3 cursor-pointer transition-all ${templateId === 'simple' ? 'border-emerald-500 bg-emerald-50/20 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                    >
                      <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl w-fit">
                        <Layout className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-lg text-gray-800">صفحة بسيطة (Single Page)</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">مثالية لمنتج واحد بسعر ثابت وميزات واضحة. يركز على تيسير عملية الشراء السريع.</p>
                      <button className="text-xs font-bold text-emerald-600 block mt-2">اختيار هذا القالب ←</button>
                    </div>

                    {/* Multivariant Template */}
                    <div
                      onClick={() => setTemplateId('multivariant')}
                      className={`rounded-2xl p-5 border-2 text-right space-y-3 cursor-pointer transition-all ${templateId === 'multivariant' ? 'border-emerald-500 bg-emerald-50/20 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                    >
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-lg text-gray-800">منتج بخيارات متعددة</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">ممتاز للمنتجات ذات المقاسات، الألوان أو الأشكال المتنوعة لزيادة مرونة الاختيار للزبون.</p>
                      <button className="text-xs font-bold text-blue-600 block mt-2">اختيار هذا القالب ←</button>
                    </div>

                    {/* Premium Template */}
                    <div
                      onClick={() => setTemplateId('premium')}
                      className={`rounded-2xl p-5 border-2 text-right space-y-3 cursor-pointer transition-all ${templateId === 'premium' ? 'border-emerald-500 bg-emerald-50/20 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                    >
                      <div className="p-3 bg-amber-100 text-amber-600 rounded-xl w-fit">
                        <Award className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-lg text-gray-800">صفحة النخبة المتميزة</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">للهدايا والمنتجات عالية الجودة. يبرز قسم الميزات بتصميم فاخر وأنيق جداً.</p>
                      <button className="text-xs font-bold text-amber-600 block mt-2">اختيار هذا القالب ←</button>
                    </div>

                    {/* Gadget Template */}
                    <div
                      onClick={() => setTemplateId('gadget')}
                      className={`rounded-2xl p-5 border-2 text-right space-y-3 cursor-pointer transition-all ${templateId === 'gadget' ? 'border-emerald-500 bg-emerald-50/20 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                    >
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-xl w-fit">
                        <Layout className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-lg text-gray-800">أجهزة ذكية وسماعات (Gadget)</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">تصميم تقني عصري وسلس بتباين أزرق، مثالي للأجهزة الإلكترونية والإكسسوارات الذكية.</p>
                      <button className="text-xs font-bold text-purple-600 block mt-2">اختيار هذا القالب ←</button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 - Product Name */}
              {step === 2 && (
                <div className="space-y-6 max-w-xl mx-auto py-4 text-center">
                  <h2 className="text-2xl font-black text-gray-900">ما اسم المنتج الذي تريد بيعه؟ 🏷️</h2>
                  <p className="text-sm text-gray-500">اكتب اسماً واضحاً ومغرياً يظهر كعنوان رئيسي لصفحة الهبوط</p>

                  <div className="space-y-2">
                    <input
                      type="text"
                      autoFocus
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value.slice(0, 60))}
                      placeholder="مثال: طقم أطفال الربيع الفاخر"
                      className="w-full text-center px-4 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold"
                    />
                    <span className="text-xs text-gray-400 block text-left font-mono">{productName.length}/60 حرف</span>
                  </div>
                </div>
              )}

              {/* STEP 3 - Pricing */}
              {step === 3 && (
                <div className="space-y-6 max-w-xl mx-auto py-4">
                  <h2 className="text-2xl font-black text-gray-900 text-center">حدد سعر بيع المنتج بالدينار الجزائري 💰</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-right">
                      <label className="text-sm font-bold text-gray-700">سعر البيع الحالي (مطلوب):</label>
                      <input
                        type="number"
                        required
                        value={price || ''}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        placeholder="مثال: 2900"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-500 text-center"
                      />
                    </div>
                    <div className="space-y-1 text-right">
                      <label className="text-sm font-bold text-gray-700">السعر الأصلي المكتوب فوقه خط (اختياري):</label>
                      <input
                        type="number"
                        value={originalPrice || ''}
                        onChange={(e) => setOriginalPrice(Number(e.target.value))}
                        placeholder="مثال: 3900"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-400 font-medium focus:outline-none focus:border-emerald-500 text-center"
                      />
                    </div>
                  </div>

                  {/* Real-time Savings display preview */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center mt-6">
                    <span className="text-xs text-gray-400 block mb-1">المظهر على الصفحة العامة للزبون:</span>
                    <div className="flex justify-center items-center gap-3">
                      <span className="text-3xl font-extrabold text-emerald-600">{price?.toLocaleString() || 0} دج</span>
                      {originalPrice && originalPrice > price && (
                        <>
                          <span className="text-slate-400 line-through text-lg">{originalPrice.toLocaleString()} دج</span>
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                            وفرت {savingsPct}% ({savedAmount.toLocaleString()} دج)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 - Product Description */}
              {step === 4 && (
                <div className="space-y-6 max-w-xl mx-auto py-4">
                  <h2 className="text-2xl font-black text-gray-900 text-center">صِف ميزات المنتج بجمل بسيطة ومغرية 📝</h2>
                  <p className="text-sm text-gray-500 text-center">وصف قصير يوضح للزبائن الفائدة الحقيقية لاقتناء هذا المنتج</p>

                  <div className="space-y-1.5">
                    <textarea
                      rows={4}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                      placeholder="مثال: طقم قماش تركي عالي الجودة ناعم ومريح للأطفال من سن 2 إلى 16 سنة، ملائم للخروج ومقاوم للغسل المتكرر."
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 leading-relaxed text-sm text-gray-700 text-right"
                    ></textarea>
                    <span className="text-xs text-gray-400 block text-left font-mono">{description.length}/300 حرف</span>
                  </div>
                </div>
              )}

              {/* STEP 5 - Product Photos */}
              {step === 5 && (
                <div className="space-y-6 text-right">
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900">أضف صوراً مغرية وواضحة لمنتجك 📸</h2>
                    <p className="text-sm text-gray-500 mt-1">الصور الجذابة ترفع مبيعاتك بنسبة تفوق 200%. يرجى رفع صورة واحدة على الأقل (بحد أقصى 8 صور).</p>
                  </div>

                  {/* Curated Pre-set Samples Quick Selection */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-500 block">اضغط للاستخدام السريع لصور تجريبية جاهزة (أو ارفع صورك الخاصة):</span>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_STOCK_IMAGES.map((stock, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => addStockImage(stock.url)}
                          className="px-3.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold transition cursor-pointer"
                        >
                          + {stock.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File dropzone */}
                  <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer transition relative bg-slate-50/50">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
                      <p className="text-sm text-gray-600 font-bold">اسحب صور المنتج هنا أو اضغط للتصفح من جهازك</p>
                      <p className="text-xs text-gray-400">يدعم صيغ JPG، PNG، WEBP (الأحجام العادية)</p>
                    </div>
                  </div>

                  {/* Thumbnail Previews */}
                  {images.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-500">الصور المضافة ({images.length} من 8):</span>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {images.map((img, idx) => (
                          <div key={idx} className="aspect-square rounded-xl border border-slate-200 overflow-hidden relative group bg-white">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            {img.uploading && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteImage(idx)}
                              className="absolute top-1 left-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow transition cursor-pointer z-10"
                            >
                              <Trash className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6 - Color Themes */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900">اختر طابع الألوان المناسب لماركتك 🎨</h2>
                    <p className="text-sm text-gray-500 mt-1">الألوان تضفي هوية بصرية ممتازة تليق بنوعية السلع المعروضة</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(COLOR_PRESETS).map(([key, value]) => (
                      <div
                        key={key}
                        onClick={() => setColorTheme(key as any)}
                        className={`rounded-2xl p-4 border-2 cursor-pointer text-right space-y-3 transition-all ${colorTheme === key ? 'border-emerald-500 bg-emerald-50/10 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: value.primary }}></span>
                          <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: value.accent }}></span>
                          <span className="text-xs font-bold text-gray-700">
                            {key === 'green' && 'أخضر العلم الوطني 🇩🇿'}
                            {key === 'pink' && 'وردي نسائي لطيف 🌸'}
                            {key === 'blue' && 'أزرق تقني مريح 💙'}
                            {key === 'purple' && 'بنفسجي إبداعي فاخر 💜'}
                            {key === 'orange' && 'برتقالي حيوي جذاب 🍊'}
                            {key === 'dark' && 'داكن عصري أنيق 🖤'}
                          </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg text-[10px] space-y-1">
                          <div className="h-2 rounded" style={{ backgroundColor: value.primary }}></div>
                          <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: value.accent }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7 - Social Proof */}
              {step === 7 && (
                <div className="space-y-6 text-right">
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900">أضف إثباتات اجتماعية تسويقية (اختياري) 🗣️</h2>
                    <p className="text-sm text-gray-500 mt-1">آراء الزبائن المسموعة والمرئية تمنح الثقة الكاملة للزوار وتشجعهم على الشراء دون تردد!</p>
                  </div>

                  {/* Grid of upload options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Image proof upload */}
                    <div className="relative border border-slate-200 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition bg-white flex flex-col items-center justify-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProofUpload(e, 'image')}
                        disabled={uploadingProof}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-2xl">📷</span>
                      <span className="text-xs font-bold text-gray-700">رفع صورة إثبات</span>
                    </div>

                    {/* Audio proof upload */}
                    <div className="relative border border-slate-200 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition bg-white flex flex-col items-center justify-center gap-2">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleProofUpload(e, 'audio')}
                        disabled={uploadingProof}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-2xl">🎙️</span>
                      <span className="text-xs font-bold text-gray-700">رفع تسجيل صوتي</span>
                    </div>

                    {/* Video proof upload */}
                    <div className="relative border border-slate-200 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition bg-white flex flex-col items-center justify-center gap-2">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleProofUpload(e, 'video')}
                        disabled={uploadingProof}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-2xl">🎥</span>
                      <span className="text-xs font-bold text-gray-700">رفع فيديو قصير</span>
                    </div>
                  </div>

                  {uploadingProof && (
                    <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-bold bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري رفع ملف الإثبات الاجتماعي لـ Supabase و Cloudinary...</span>
                    </div>
                  )}

                  <div className="flex justify-center border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={addMockAudioProof}
                      className="px-5 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition shadow-xs cursor-pointer"
                    >
                      + إضافة رسالة تأكيد صوتية تجريبية للتحقق 🎙️
                    </button>
                  </div>

                  {proofs.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-gray-500">الملفات والإثباتات المضافة:</span>
                      {proofs.map((pr, i) => (
                        <div key={i} className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                          <div className="flex-1 space-y-1">
                            {pr.type === 'audio' && (
                              <audio controls src={pr.url} className="h-8 w-full"></audio>
                            )}
                            {pr.type === 'image' && (
                              <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                                <img src={pr.url} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            {pr.type === 'video' && (
                              <div className="w-40 h-24 rounded-lg overflow-hidden border border-slate-200 bg-black">
                                <video src={pr.url} controls className="w-full h-full object-contain"></video>
                              </div>
                            )}
                            <input
                              type="text"
                              value={pr.caption}
                              onChange={(e) => {
                                const updated = [...proofs];
                                updated[i].caption = e.target.value;
                                setProofs(updated);
                              }}
                              placeholder="أضف تعليقاً أو اسم الزبون..."
                              className="w-full text-xs text-gray-600 bg-white border border-slate-100 rounded px-2 py-1 mt-1 text-right"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProof(i)}
                            className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-xl"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 8 - Reviews List */}
              {step === 8 && (
                <div className="space-y-6 text-right">
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900">أضف تقييمات مكتوبة تظهر في أسفل الصفحة ⭐</h2>
                    <p className="text-sm text-gray-500 mt-1">التقييمات تساعد في توثيق جودة منتجاتكم ومصداقية المتجر</p>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <span className="text-sm font-bold text-gray-700">التقييمات المضافة حالياً ({reviews.length})</span>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(true)}
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة تقييم جديد</span>
                    </button>
                  </div>

                  {showReviewForm && (
                    <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 space-y-4">
                      <h3 className="font-bold text-gray-800 text-sm">تقييم زبون جديد:</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-gray-500">اسم الزبون:</label>
                          <input
                            type="text"
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            placeholder="مثال: أم ياسين"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500">الولاية:</label>
                          <input
                            type="text"
                            value={newReviewCity}
                            onChange={(e) => setNewReviewCity(e.target.value)}
                            placeholder="مثال: وهران"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500">التقييم بالنجوم:</label>
                        <div className="flex gap-1.5 mt-1">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setNewReviewRating(num)}
                              className="text-amber-400 hover:scale-115 transition"
                            >
                              <Star className={`w-5 h-5 ${num <= newReviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500">نص التقييم:</label>
                        <textarea
                          rows={2}
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          placeholder="المنتج وصلني هايل وبزاف مليح..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs mt-1"
                        ></textarea>
                      </div>

                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-3.5 py-1.5 bg-slate-300 rounded hover:bg-slate-400 font-bold transition"
                        >
                          إلغاء
                        </button>
                        <button
                          type="button"
                          onClick={handleAddReview}
                          className="px-3.5 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 font-bold transition"
                        >
                          تأكيد الحفظ
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {reviews.map((rev, idx) => (
                      <div key={idx} className="flex justify-between items-center border border-slate-100 p-3 bg-white rounded-xl">
                        <div className="space-y-1">
                          <span className="font-bold text-gray-800 text-xs">{rev.name} ({rev.location})</span>
                          <div className="flex gap-0.5 text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">{rev.text}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReviews(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded-lg"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 9 - WhatsApp */}
              {step === 9 && (
                <div className="space-y-6 max-w-xl mx-auto py-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900">رقم واتساب للتواصل السريع مع الزبائن (اختياري) 💬</h2>
                    <p className="text-sm text-gray-500 mt-1">يظهر زر واتساب في صفحة الهبوط للزبائن الذين يريدون طرح أسئلة إضافية قبل تأكيد طلبهم</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 block text-right">رقم الهاتف:</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold" dir="ltr">📞</span>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsApp(e.target.value)}
                        placeholder="+213555123456"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-left font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 10 - Live Preview and Submit */}
              {step === 10 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900">معاينة صفحتك المنتجة 👁️</h2>
                    <p className="text-sm text-gray-500 mt-1">تفقد جودة ومظهر الصفحة قبل إرسالها لمراجعة الإدارة ونشرها للجميع</p>
                  </div>

                  {/* Inline live template display in a gorgeous responsive preview frame */}
                  <div className="border border-slate-200 rounded-[24px] shadow-sm overflow-hidden bg-white max-h-[500px] overflow-y-auto relative">
                    <div className="sticky top-0 left-0 right-0 bg-slate-900 text-white py-2 px-4 text-xs flex justify-between items-center z-50">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      </div>
                      <span className="font-mono text-[10px]" dir="ltr">yube.dz/{currentUser?.slug}/{productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</span>
                      <span className="text-[10px]">مظهر صفحتك العامة للزبائن 📱</span>
                    </div>

                    <div className="pointer-events-none scale-95 origin-top mt-2">
                      {templateId === 'simple' && <SimpleTemplate page={mockPageData} client={currentUser!} />}
                      {templateId === 'multivariant' && <MultivariantTemplate page={mockPageData} client={currentUser!} />}
                      {templateId === 'premium' && <PremiumTemplate page={mockPageData} client={currentUser!} />}
                      {templateId === 'gadget' && <GadgetTemplate page={mockPageData} client={currentUser!} />}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1 cursor-pointer text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              <span>رجوع</span>
            </button>
          ) : (
            <div className="w-10"></div>
          )}

          {step < 10 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer text-sm"
            >
              <span>متابعة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitPage}
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-sm"
            >
              {submitting ? (
                <span className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>إرسال صفحة البيع للمراجعة</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
