import React, { useState } from "react";
import { 
  Check, 
  Star, 
  Search, 
  Heart, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  DollarSign, 
  Battery, 
  Volume2, 
  Bluetooth, 
  Mic, 
  Menu, 
  X,
  Sparkles,
  ArrowRight,
  Phone,
  User,
  MapPin,
  HelpCircle,
  Play,
  Pause
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Product images list with exact primary color theme matching
const PRODUCT_IMAGES = [
  "https://placehold.co/600x600/1E3A8A/FFFFFF?text=SoundMax+Pro+Midnight",
  "https://placehold.co/600x600/111827/FFFFFF?text=SoundMax+Pro+Premium+Black",
  "https://placehold.co/600x600/6B7280/FFFFFF?text=SoundMax+Pro+Cosmic+Gray",
  "https://placehold.co/600x600/22C55E/FFFFFF?text=SoundMax+Pro+Eco+Green"
];

// Product feature list
const HERO_FEATURES = [
  "تقنية إلغاء الضوضاء النشطة الذكية (ANC)",
  "بطارية قوية تدوم حتى 40 ساعة تشغيل متواصل",
  "ميكروفون مدمج فائق الوضوح مع عزل للرياح",
  "اتصال بلوتوث 5.3 مستقر ومزدوج الأجهزة"
];

// Benefits section data
const BENEFITS = [
  {
    title: "بطارية مذهلة وشحن سريع",
    desc: "استمتع بموسيقاك طوال الأسبوع دون انقطاع. شحن لمدة 10 دقائق يمنحك 5 ساعات من الاستماع.",
    icon: Battery,
  },
  {
    title: "إلغاء ضوضاء نشط متكامل",
    desc: "اعزل نفسك تماماً عن الضجيج المحيط وركز على ما يهمك فقط بلمسة زر واحدة.",
    icon: Volume2,
  },
  {
    title: "اتصال لاسلكي فائق الثبات",
    desc: "مدى اتصال يصل إلى 15 متراً مع توافق كامل مع جميع أجهزتك الذكية بدون تأخير.",
    icon: Bluetooth,
  },
  {
    title: "ميكروفونات ذكية للمكالمات",
    desc: "صوت نقي وواضح في مكالمات العمل والاتصالات الشخصية بفضل عزل الضوضاء المحيطة.",
    icon: Mic,
  }
];

// Review data
const REVIEWS = [
  {
    name: "أحمد العتيبي",
    avatar: "https://placehold.co/100x100/1E3A8A/FFFFFF?text=أحمد",
    rating: 5,
    comment: "سماعة مذهلة بكل ما تعنيه الكلمة! جودة الصوت نقية جداً والعزل ممتاز في المكتب والشارع والبطارية تجلس معاي أيام بدون شحن. أنصح بها وبشدة!"
  },
  {
    name: "سارة الشمري",
    avatar: "https://placehold.co/100x100/22C55E/FFFFFF?text=سارة",
    rating: 5,
    comment: "مريحة جداً على الأذن وخفيفة الوزن حتى مع الاستخدام الطويل للدراسة. خدمة التوصيل كانت سريعة جداً - وصلتني للرياض خلال 24 ساعة فقط!"
  },
  {
    name: "خالد الدوسري",
    avatar: "https://placehold.co/100x100/111827/FFFFFF?text=خالد",
    rating: 5,
    comment: "قيمة ممتازة جداً مقابل السعر. ميزة الدفع عند الاستلام مريحة وأعطتني ثقة بالطلب. خامات السماعة فخمة والعلبة مريحة للتنقل."
  },
  {
    name: "فاطمة المهيري",
    avatar: "https://placehold.co/100x100/6B7280/FFFFFF?text=فاطمة",
    rating: 5,
    comment: "تصميم أنيق جداً وتنسيق الألوان رائع. العزل يخليك في عالم ثاني. جربت سماعات أغلى بكثير وما شفت فرق كبير عنها. منتج يستحق 5 نجوم."
  }
];

// Audio reviews for audio social proof section
const AUDIO_REVIEWS = [
  {
    id: 1,
    name: "ماجد العسيري",
    location: "الرياض",
    avatar: "https://placehold.co/100x100/1E3A8A/FFFFFF?text=ماجد",
    duration: 12,
    text: "التجربة فاقت التوقعات! العزل الصوتي هادئ جداً ومريح للرحلات الطويلة والمكالمات في الزحام نقية وممتازة.",
    frequencies: [15, 30, 45, 25, 60, 40, 75, 50, 35, 20, 45, 80, 55, 30, 65, 45, 20, 35, 50, 60, 40, 25, 15, 30, 45, 20]
  },
  {
    id: 2,
    name: "رائد الحربي",
    location: "جدة",
    avatar: "https://placehold.co/100x100/22C55E/FFFFFF?text=رائد",
    duration: 18,
    text: "الصوت نقي جداً، والبيس متوازن وقوي ومريح للاستماع اليومي. والبطارية خرافية جلست معي أسبوع كامل بدون شحن!",
    frequencies: [20, 40, 30, 55, 45, 70, 85, 60, 50, 35, 60, 75, 40, 50, 65, 30, 45, 55, 40, 25, 35, 50, 65, 30, 20, 15]
  },
  {
    id: 3,
    name: "لينا القحطاني",
    location: "الدمام",
    avatar: "https://placehold.co/100x100/6B7280/FFFFFF?text=لينا",
    duration: 15,
    text: "خفيفة ومريحة جداً على الأذن، الميكروفون ممتاز والمكالمات واضحة وصوتي مسموع للطرف الآخر بدون أي تشويش خارجي.",
    frequencies: [25, 45, 35, 60, 50, 80, 65, 40, 30, 55, 70, 45, 35, 60, 75, 50, 40, 55, 65, 30, 20, 35, 45, 50, 30, 25]
  }
];

// Social proof data with Geometric Balance theme elements
const SOCIAL_PROOF = [
  {
    title: "أكثر من 10,000 عميل",
    desc: "نثق برضاهم وسعداء بخدمتهم في جميع أنحاء المملكة.",
    icon: Sparkles
  },
  {
    title: "شحن سريع وآمن",
    desc: "توصيل سريع ومباشر إلى باب منزلك مع شركات شحن موثوقة.",
    icon: Truck
  },
  {
    title: "الدفع عند الاستلام",
    desc: "لا حاجة للدفع المسبق، ادفع نقداً أو بالبطاقة عند استلام منتجك.",
    icon: DollarSign
  },
  {
    title: "ضمان جودة سنتين",
    desc: "نضمن جودة منتجاتنا ونوفر خدمة استبدال واسترجاع مرنة وسهلة.",
    icon: ShieldCheck
  }
];

export default function LandingPage() {
  // Image gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Audio Social Proof states
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState<{ [key: number]: number }>({
    1: 0,
    2: 0,
    3: 0
  });

  // Web Audio synth for ambient interactive demonstration
  const playSynthesizedTone = (frequency: number, type: "sine" | "triangle" = "sine", duration: number = 0.15) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // AudioContext could be blocked by browser policy until user gesture
    }
  };

  React.useEffect(() => {
    if (playingAudioId === null) return;

    const activeAudio = AUDIO_REVIEWS.find(a => a.id === playingAudioId);
    if (!activeAudio) return;

    const interval = setInterval(() => {
      setAudioProgress(prev => {
        const current = prev[playingAudioId] || 0;
        const next = current + 0.1;
        
        // Simulating subtle high-fidelity audio tone periodically on progress increments
        if (Math.floor(next * 10) % 15 === 0) {
          const notes = [220, 261.63, 293.66, 329.63, 392.00, 440];
          const randomNote = notes[Math.floor(Math.random() * notes.length)];
          playSynthesizedTone(randomNote, "triangle", 0.35);
        }

        if (next >= activeAudio.duration) {
          setPlayingAudioId(null);
          return { ...prev, [playingAudioId]: 0 };
        }
        return { ...prev, [playingAudioId]: parseFloat(next.toFixed(1)) };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [playingAudioId]);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim() || !city.trim()) {
      setFormError("الرجاء ملء جميع الحقول المطلوبة لضمان معالجة طلبك.");
      return;
    }
    setFormError("");
    setIsSubmitted(true);
    // Smooth scroll to form section to view success message
    const orderFormEl = document.getElementById("order-form-section");
    if (orderFormEl) {
      orderFormEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#111827] selection:bg-[#1E3A8A]/10 selection:text-[#1E3A8A]" dir="rtl">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          {/* Icons Left */}
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-[#6B7280] transition-colors hover:bg-[#F9FAFB] hover:text-[#1E3A8A]" aria-label="البحث">
              <Search className="h-5 w-5" />
            </button>
            <button className="rounded-full p-2 text-[#6B7280] transition-colors hover:bg-[#F9FAFB] hover:text-red-500" aria-label="المفضلة">
              <Heart className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scrollToSection("order-form-section")}
              className="relative rounded-full p-2 text-[#6B7280] transition-colors hover:bg-[#F9FAFB] hover:text-[#1E3A8A]" 
              aria-label="سلة التسوق"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-[#22C55E]"></span>
            </button>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 text-[#6B7280] transition-colors hover:bg-[#F9FAFB] md:hidden"
              aria-label="القائمة الرئيسية"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Nav Links Center */}
          <nav className="hidden items-center gap-8 md:flex">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-semibold text-[#1E3A8A] transition-colors hover:text-[#1E3A8A]/80">الرئيسية</button>
            <button onClick={() => scrollToSection("product-details")} className="font-medium text-[#6B7280] transition-colors hover:text-[#1E3A8A]">المنتج</button>
            <button onClick={() => scrollToSection("social-proof")} className="font-medium text-[#6B7280] transition-colors hover:text-[#1E3A8A]">العروض</button>
            <button onClick={() => scrollToSection("footer")} className="font-medium text-[#6B7280] transition-colors hover:text-[#1E3A8A]">اتصل بنا</button>
          </nav>

          {/* Logo Right */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E3A8A] text-white">
              <Volume2 className="h-6 w-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#1E3A8A]">صوتيات</span>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[#E5E7EB] bg-white md:hidden"
            >
              <div className="space-y-1 px-4 py-3 pb-4">
                <button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setIsMobileMenuOpen(false); }}
                  className="block w-full py-2 text-right font-semibold text-[#1E3A8A] hover:text-[#1E3A8A]/80"
                >
                  الرئيسية
                </button>
                <button 
                  onClick={() => scrollToSection("product-details")}
                  className="block w-full py-2 text-right font-medium text-[#6B7280] hover:text-[#1E3A8A]"
                >
                  المنتج
                </button>
                <button 
                  onClick={() => scrollToSection("social-proof")}
                  className="block w-full py-2 text-right font-medium text-[#6B7280] hover:text-[#1E3A8A]"
                >
                  العروض
                </button>
                <button 
                  onClick={() => scrollToSection("footer")}
                  className="block w-full py-2 text-right font-medium text-[#6B7280] hover:text-[#1E3A8A]"
                >
                  اتصل بنا
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Left Column: Product Image Container */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl bg-[#F9FAFB] p-6 sm:p-12 border border-[#E5E7EB] flex justify-center items-center">
              <motion.img 
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={PRODUCT_IMAGES[activeImageIndex]} 
                alt="سماعات SoundMax Pro اللاسلكية" 
                className="max-h-[350px] w-auto object-contain sm:max-h-[450px]"
              />
              <div className="absolute top-4 right-4 rounded-full bg-[#22C55E] px-3 py-1 text-xs font-bold text-white shadow-sm">
                عرض خاص %40 خصم
              </div>
            </div>
            
            {/* Quick Micro-Gallery Hint */}
            <div className="mt-4 flex justify-center gap-2 text-xs text-[#6B7280]">
              <span>انقر على المعرض بالأسفل لاستكشاف المزيد من الألوان والتفاصيل</span>
            </div>
          </div>

          {/* Right Column: Product Content Info */}
          <div className="order-1 flex flex-col justify-center space-y-6 lg:order-2">
            <div>
              <span className="inline-flex items-center rounded-md bg-[#1E3A8A]/10 px-2.5 py-0.5 text-xs font-bold text-[#1E3A8A]">
                إلكترونيات فاخرة • SoundMax Series
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-5xl leading-tight">
                سماعات الرأس اللاسلكية الاحترافية <span className="text-[#1E3A8A]">SoundMax Pro</span>
              </h1>
              <p className="mt-4 text-lg text-[#6B7280] leading-relaxed">
                استمتع بتجربة صوتية استثنائية مع تقنية إلغاء الضوضاء النشطة الفائقة، وبطارية مذهلة تدوم حتى 40 ساعة من التشغيل المتواصل بتصميم مريح وعصري.
              </p>
            </div>

            {/* Pricing block */}
            <div className="flex items-baseline gap-4 rounded-xl bg-[#F9FAFB] p-4 border border-[#E5E7EB] w-fit">
              <span className="text-3xl font-black text-[#1E3A8A]">299 ر.س</span>
              <span className="text-lg text-[#6B7280] line-through">499 ر.س</span>
              <span className="inline-flex items-center rounded-full bg-[#22C55E]/10 px-2.5 py-0.5 text-xs font-bold text-[#22C55E]">
                وفر 200 ر.س (40%-)
              </span>
            </div>

            {/* Feature Checkmarks */}
            <ul className="space-y-3">
              {HERO_FEATURES.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E] mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-[#111827]">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Call to action & trust triggers */}
            <div className="space-y-4 pt-2">
              <button 
                onClick={() => scrollToSection("order-form-section")}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#1E3A8A] px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-opacity-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2 active:scale-[0.98]"
              >
                اطلب الآن
                <ArrowRight className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </button>
              
              <div className="flex items-center justify-center gap-6 text-sm font-semibold text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-[#22C55E]" />
                  شحن مجاني وسريع
                </span>
                <span className="h-4 w-[1px] bg-[#E5E7EB]"></span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-[#22C55E]" />
                  الدفع عند الاستلام
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Product Gallery Section */}
      <section className="bg-[#F9FAFB] py-12 border-y border-[#E5E7EB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
              معرض ألوان وتفاصيل سماعة SoundMax Pro
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[#6B7280]">
              اختر اللون الذي يناسب أسلوب حياتك اليومي مع الحفاظ على نفس جودة الأداء والراحة.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            {/* Active image showcase with animation */}
            <div className="relative aspect-square w-full max-w-xl mx-auto overflow-hidden rounded-2xl bg-white p-6 sm:p-12 border border-[#E5E7EB] shadow-xs flex items-center justify-center">
              <motion.img 
                key={activeImageIndex + "-gallery"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={PRODUCT_IMAGES[activeImageIndex]} 
                alt="تفاصيل المنتج" 
                className="max-h-[300px] w-auto object-contain sm:max-h-[380px]"
              />
            </div>

            {/* Thumbnail list */}
            <div className="mt-6 grid grid-cols-4 gap-4 max-w-xl mx-auto">
              {PRODUCT_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white p-2 transition-all hover:border-[#1E3A8A] ${
                    activeImageIndex === idx ? "border-[#1E3A8A] ring-2 ring-[#1E3A8A]/20" : "border-[#E5E7EB]"
                  }`}
                >
                  <img src={img} alt={`مصغر سماعة ${idx + 1}`} className="h-full w-full object-contain" />
                  {activeImageIndex === idx && (
                    <span className="absolute inset-0 bg-[#1E3A8A]/5"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Information Section */}
      <section id="product-details" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Right Column: Key Details */}
          <div className="space-y-6">
            <div className="border-b border-[#E5E7EB] pb-4">
              <span className="text-sm font-bold text-[#1E3A8A]">المواصفات الفنية</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                تفاصيل متميزة توفر لك أفضل تجربة
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] py-3">
                <span className="font-bold text-[#111827]">اسم المنتج</span>
                <span className="text-[#6B7280]">سماعات الرأس اللاسلكية SoundMax Pro</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] py-3">
                <span className="font-bold text-[#111827]">السعر الحالي</span>
                <span className="text-lg font-black text-[#1E3A8A]">299 ر.س شامل الشحن</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] py-3">
                <span className="font-bold text-[#111827]">نوع الشحن</span>
                <span className="text-[#6B7280]">USB Type-C (شحن فائق السرعة)</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] py-3">
                <span className="font-bold text-[#111827]">إصدار البلوتوث</span>
                <span className="text-[#6B7280]">v5.3 ذو المدى الممتد</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#F9FAFB] p-5 border border-[#E5E7EB]">
              <h3 className="font-bold text-[#111827]">وصف مختصر</h3>
              <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                تم تطوير سماعة SoundMax Pro بمكونات صوتية متطورة لتلائم الاحتياجات اليومية والمهنية. عزل حقيقي للأصوات الخارجية يمنحك تركيزاً فائقاً أثناء العمل، وبطارية ذات استهلاك ذكي تدوم لأيام طويلة دون الحاجة للشحن المتكرر. تصميم مرن قابل للطي يسهل الترحال والتنقل.
              </p>
            </div>
          </div>

          {/* Left Column: Benefits Grid with custom icons */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {BENEFITS.map((benefit, idx) => {
              const IconComp = benefit.icon;
              return (
                <div key={idx} className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs transition-all hover:border-[#1E3A8A] hover:shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] mb-4">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#111827]">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Audio Social Proof Section */}
      <section className="bg-white py-16 border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#22C55E]/10 px-2.5 py-0.5 text-xs font-bold text-[#22C55E]">
              <Mic className="h-3 w-3" />
              آراء صوتية مسجلة
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
              استمع لتجارب عملائنا الحقيقية
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[#6B7280]">
              اضغط على زر التشغيل للاستماع لانطباعات مستخدمي سماعة SoundMax Pro وملاحظاتهم حول عزل الصوت ومستوى الراحة والبيس.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {AUDIO_REVIEWS.map((item) => {
              const isPlaying = playingAudioId === item.id;
              const progress = audioProgress[item.id] || 0;
              
              // Format time to 0:00
              const formatTime = (time: number) => {
                const mins = Math.floor(time / 60);
                const secs = Math.floor(time % 60);
                return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
              };

              return (
                <div 
                  key={item.id} 
                  className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 transition-all duration-300 ${
                    isPlaying 
                      ? 'border-[#1E3A8A] ring-4 ring-[#1E3A8A]/5 shadow-md' 
                      : 'border-[#E5E7EB] hover:border-[#1E3A8A]/40 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header: User Profile */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.avatar} 
                          alt={item.name} 
                          className="h-10 w-10 rounded-full object-cover border border-[#E5E7EB]" 
                        />
                        <div>
                          <h3 className="text-sm font-bold text-[#111827]">{item.name}</h3>
                          <p className="text-xs text-[#6B7280]">{item.location} • مشتري مؤكد ✓</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-[#1E3A8A]/5 px-2.5 py-1 text-[11px] font-bold text-[#1E3A8A]">
                        ملاحظة صوتية
                      </span>
                    </div>

                    {/* Audio Player Core Box */}
                    <div className="rounded-xl bg-[#F9FAFB] p-4 border border-[#E5E7EB]">
                      <div className="flex items-center gap-4">
                        {/* Play/Pause Button */}
                        <button
                          onClick={() => setPlayingAudioId(isPlaying ? null : item.id)}
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-all duration-200 active:scale-95 ${
                            isPlaying 
                              ? 'bg-[#22C55E] hover:bg-[#22C55E]/90 ring-4 ring-[#22C55E]/20' 
                              : 'bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'
                          }`}
                          aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل الصوت"}
                        >
                          {isPlaying ? (
                            <Pause className="h-5 w-5 text-white" />
                          ) : (
                            <Play className="h-5 w-5 text-white translate-x-[-1px]" />
                          )}
                        </button>

                        {/* Interactive Waveform Visualizer */}
                        <div className="flex flex-1 items-center justify-between h-10 gap-[2px]">
                          {item.frequencies.map((height, idx) => {
                            // Calculate fluctuating heights when active
                            const activeFactor = isPlaying ? 0.7 + Math.sin(progress * 15 + idx) * 0.3 : 0.4;
                            const finalHeight = Math.max(12, height * activeFactor);
                            return (
                              <div
                                key={idx}
                                className={`w-[3px] rounded-full transition-all duration-100 ${
                                  isPlaying 
                                    ? progress * (item.frequencies.length / item.duration) > idx 
                                      ? 'bg-[#22C55E]' 
                                      : 'bg-[#E5E7EB]'
                                    : 'bg-gray-300'
                                }`}
                                style={{ height: `${finalHeight}%` }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Timeline & Progress Indicator */}
                      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#6B7280]">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(item.duration)}</span>
                      </div>
                    </div>

                    {/* Transcript text */}
                    <blockquote className="text-sm italic text-gray-600 leading-relaxed">
                      "{item.text}"
                    </blockquote>
                  </div>

                  {/* Micro satisfaction badge */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#E5E7EB] pt-4 text-xs font-semibold text-[#6B7280]">
                    <div className="flex gap-0.5 text-yellow-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <span>جودة صوت متميزة 5/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-[#F9FAFB] py-16 border-y border-[#E5E7EB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header & Overall stats */}
          <div className="flex flex-col items-center justify-between gap-6 border-b border-[#E5E7EB] pb-8 sm:flex-row">
            <div className="text-center sm:text-right">
              <h2 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                تقييمات عملائنا الكرام
              </h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                نحن ملتزمون بتقديم أفضل تجربة لكل عميل. آراء وتوصيات حقيقية من مستخدمي سماعاتنا.
              </p>
            </div>
            
            <div className="flex flex-col items-center rounded-xl bg-white px-6 py-4 border border-[#E5E7EB] shadow-xs">
              <span className="text-3xl font-black text-[#111827]">4.9</span>
              <div className="my-1.5 flex gap-0.5 text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <span className="text-xs font-semibold text-[#6B7280]">1200+ تقييم حقيقي</span>
            </div>
          </div>

          {/* 4 Reviews Cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {REVIEWS.map((review, idx) => (
              <div key={idx} className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs transition-transform hover:scale-[1.01]">
                <div className="space-y-4">
                  
                  {/* Rating & stars */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-yellow-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-[#6B7280]">مشتري مؤكد ✓</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-[#111827] leading-relaxed font-medium">
                    "{review.comment}"
                  </p>
                </div>

                {/* User Info footer */}
                <div className="mt-6 flex items-center gap-3 border-t border-[#E5E7EB] pt-4">
                  <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full object-cover border border-[#E5E7EB]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">{review.name}</h4>
                    <p className="text-xs text-[#6B7280]">التحقق من الشراء قبل يومين</p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Social Proof Features Section */}
      <section id="social-proof" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold text-[#1E3A8A] tracking-wider uppercase">ضمانات صوتيات للخدمة المتميزة</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
            لماذا يختارنا أكثر من 10,000 عميل؟
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOCIAL_PROOF.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center transition-all hover:border-gray-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] mb-4">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-[#111827]">✓ {item.title}</h3>
                <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Order Form Section */}
      <section id="order-form-section" className="bg-[#F9FAFB] py-16 border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
              اطلب سماعتك اليوم بكل سهولة
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              املأ الاستمارة أدناه، وسيتكفل فريق المبيعات لدينا بالاتصال بك فوراً لتأكيد العنوان والشحن المجاني.
            </p>
          </div>

          {/* Form wrapper with animations */}
          <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs sm:p-10">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="order-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  
                  {/* Status Note */}
                  <div className="rounded-xl bg-[#1E3A8A]/10 p-4 border border-[#1E3A8A]/20 text-sm text-[#1E3A8A] flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 shrink-0 text-[#1E3A8A] mt-0.5" />
                    <div>
                      <span className="font-bold">عرض محدود:</span> احصل على الشحن المجاني والدفع عند الاستلام اليوم فقط. سيصلك المنتج في علبة التعبئة الأصلية الفاخرة.
                    </div>
                  </div>

                  {formError && (
                    <div className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-600 border border-red-100">
                      {formError}
                    </div>
                  )}

                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="full-name" className="block text-sm font-bold text-[#111827] flex items-center gap-1.5">
                      <User className="h-4 w-4 text-[#1E3A8A]" />
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="full-name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="اكتب اسمك الكامل هنا..."
                      className="block w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]/50 px-4 py-3 text-sm text-[#111827] placeholder-gray-400 focus:border-[#1E3A8A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] transition-colors"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-bold text-[#111827] flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-[#1E3A8A]" />
                      رقم الهاتف <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="مثال: 05XXXXXXXX"
                      dir="ltr"
                      className="block w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]/50 px-4 py-3 text-sm text-[#111827] placeholder-gray-400 focus:border-[#1E3A8A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] transition-colors text-right"
                    />
                  </div>

                  {/* City/State Field */}
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-bold text-[#111827] flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#1E3A8A]" />
                      الولاية / المدينة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="مثال: الرياض، جدة، الدمام..."
                      className="block w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]/50 px-4 py-3 text-sm text-[#111827] placeholder-gray-400 focus:border-[#1E3A8A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] transition-colors"
                    />
                  </div>

                  {/* Large Order CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-opacity-95 active:scale-[0.99] cursor-pointer"
                    >
                      تأكيد الطلب
                    </button>
                    <p className="mt-3 text-center text-xs text-[#6B7280]">
                      سيتم التواصل معك لتأكيد الطلب خلال دقائق.
                    </p>
                  </div>

                </motion.form>
              ) : (
                <motion.div 
                  key="success-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E]">
                    <Check className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-[#111827]">تم استلام طلبك بنجاح!</h3>
                    <p className="text-sm text-[#6B7280] max-w-md mx-auto leading-relaxed">
                      شكراً لك، <span className="font-bold text-[#1E3A8A]">{fullName}</span>. يرجى إبقاء هاتفك قريباً منك لاستقبال مكالمة تأكيد العنوان قريباً.
                    </p>
                  </div>

                  <div className="mx-auto max-w-sm rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-right space-y-2.5">
                    <div className="flex justify-between text-xs border-b border-[#E5E7EB] pb-2">
                      <span className="font-bold text-[#6B7280]">تفاصيل تأكيد الطلب:</span>
                      <span className="font-bold text-[#22C55E]">طلب رقم #SMAX-2026</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">رقم الهاتف:</span>
                      <span className="font-semibold text-[#111827]" dir="ltr">{phoneNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">الوجهة:</span>
                      <span className="font-semibold text-[#111827]">{city}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-dashed border-[#E5E7EB]">
                      <span className="font-bold text-[#1E3A8A]">المجموع المستحق عند الاستلام:</span>
                      <span className="font-black text-[#1E3A8A]">299 ر.س (شامل التوصيل)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName("");
                      setPhoneNumber("");
                      setCity("");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 text-xs font-semibold text-[#6B7280] transition-colors hover:bg-[#F9FAFB]"
                  >
                    تقديم طلب جديد لسماعة أخرى
                  </button>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-white border-t border-[#E5E7EB] py-8">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-between gap-4 sm:px-6 lg:px-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E3A8A] text-white">
              <Volume2 className="h-5 w-5" />
            </div>
            <span className="text-base font-extrabold text-[#1E3A8A]">صوتيات</span>
          </div>

          <p className="text-xs text-[#6B7280]">
            حقوق الطبع والنشر © 2026 صوتيات. جميع الحقوق محفوظة.
          </p>

          <div className="flex gap-4 text-xs text-[#6B7280]">
            <a href="#" className="hover:text-[#1E3A8A] transition-colors">سياسة الخصوصية</a>
            <span>•</span>
            <a href="#" className="hover:text-[#1E3A8A] transition-colors">شروط الخدمة</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
