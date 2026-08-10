import React, { useState } from 'react';
import { Sparkles, Headphones, Clock, Search, X } from 'lucide-react';
import { SupportCard } from './SupportCard';
import { SupportOption } from './types';

interface SupportMenuProps {
  phoneNumber?: string;
  dir?: 'rtl' | 'ltr';
  onOptionSelect?: (option: SupportOption, whatsappUrl: string) => void;
  onClose?: () => void;
}

export const DEFAULT_SUPPORT_OPTIONS: SupportOption[] = [
  {
    id: 'landing-page',
    iconName: 'Layout',
    title: 'مشكلة في صفحة الهبوط',
    subtitle: 'قوالب، تصميم، صور، خطوط',
    description: 'إذا كانت لديك مشكلة في القالب أو التصميم أو رفع الصور أو أي جزء من صفحة الهبوط.',
    buttonText: 'فتح المحادثة',
    whatsappMessage: 'السلام عليكم، لدي مشكلة في صفحة الهبوط الخاصة بي.',
  },
  {
    id: 'crm',
    iconName: 'KanbanSquare',
    title: 'مشكلة في الـ CRM',
    subtitle: 'الطلبات، العملاء، التتبع',
    description: 'إذا واجهت مشكلة في الطلبات أو المتابعة أو العملاء.',
    buttonText: 'طلب المساعدة',
    whatsappMessage: 'السلام عليكم، لدي مشكلة في نظام CRM.',
  },
  {
    id: 'fb-ads',
    iconName: 'Megaphone',
    title: 'خدمات إعلانات Facebook',
    subtitle: 'استشارات وتحسين الحملات',
    description: 'نساعدك في:',
    bulletPoints: [
      'صناعة الفيديوهات الإعلانية',
      'كتابة الزوايا التسويقية',
      'هيكلة الحملات',
      'الاستهداف',
      'تحسين ROAS',
    ],
    buttonText: 'احجز استشارة',
    whatsappMessage: 'السلام عليكم، أريد الاستفادة من خدمات إعلانات Facebook.',
    badge: 'موصى به',
  },
  {
    id: 'general',
    iconName: 'MessageCircle',
    title: 'تحدث مع فريق Yube',
    subtitle: 'مساعدة عامة وتساؤلات',
    description: 'إذا لم تجد ما تبحث عنه.',
    buttonText: 'ابدأ المحادثة',
    whatsappMessage: 'السلام عليكم، أحتاج إلى مساعدة.',
  },
];

export const SupportMenu: React.FC<SupportMenuProps> = ({
  phoneNumber = '213555123456',
  dir = 'rtl',
  onOptionSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '') || '213555123456';

  const handleSelectOption = (option: SupportOption) => {
    const encodedMsg = encodeURIComponent(option.whatsappMessage);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    if (onOptionSelect) {
      onOptionSelect(option, whatsappUrl);
    } else {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const filteredOptions = DEFAULT_SUPPORT_OPTIONS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.bulletPoints && item.bulletPoints.some((p) => p.toLowerCase().includes(query)))
    );
  });

  return (
    <div className="flex flex-col h-full max-h-[85vh] md:max-h-[80vh] overflow-hidden bg-white/95 backdrop-blur-xl text-slate-800 rounded-t-[32px] md:rounded-[40px]">
      {/* Top Header Section */}
      <div className="relative p-6 md:p-8 pb-4 text-center border-b border-slate-100/80 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="flex items-center justify-between mb-3">
          {/* Yube Brand & Status Indicator */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-blue-900 tracking-tight text-base"><img src="/logo-full.png" className='w-[100px]' alt="Yube" /></span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  متصل الآن
                </span>
              </div>
            </div>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق النافذة"
              className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Title & Subtitle matching Frosted Glass design */}
        <div className="mt-2 text-center">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1 flex items-center justify-center gap-2">
            <span>كيف يمكننا مساعدتك؟</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-spin-slow shrink-0" />
          </h1>
          <p className="text-slate-500 flex items-center justify-center text-xs sm:text-base md:text-lg font-medium gap-1">
            فريق <img src="/logo-full.png" className="w-[70px] sm:w-[90px] inline-block align-middle" alt="Yube" /> جاهز لمساعدتك.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mt-4 max-w-md mx-auto">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن نوع المساعدة..."
            className="w-full pr-10 pl-4 py-2 text-xs md:text-sm bg-slate-50/80 border border-slate-200 rounded-2xl shadow-2xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded-md"
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {/* Cards Scrollable Grid Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {filteredOptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOptions.map((option) => (
              <SupportCard
                key={option.id}
                option={option}
                phoneNumber={phoneNumber}
                onSelect={handleSelectOption}
                dir={dir}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-slate-500 text-sm">لم نجد خيارات مطابقة لمبحثك "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs text-blue-600 font-bold underline hover:text-blue-700"
            >
              عرض جميع الخيارات
            </button>
          </div>
        )}
      </div>

      {/* Footer Badge inside Modal */}
      <div className="bg-slate-50/80 p-5 border-t border-slate-100 flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="text-slate-600 text-sm font-medium">🚀 فريق Yube يرد عادة خلال أقل من 10 دقائق.</span>
      </div>
    </div>
  );
};
