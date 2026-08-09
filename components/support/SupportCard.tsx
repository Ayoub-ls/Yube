import React from 'react';
import { 
  Layout, 
  KanbanSquare, 
  Megaphone, 
  MessageCircle, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { SupportOption } from './types';

interface SupportCardProps {
  option: SupportOption;
  phoneNumber?: string;
  onSelect: (option: SupportOption) => void;
  dir?: 'rtl' | 'ltr';
}

const getIcon = (iconName: SupportOption['iconName']) => {
  switch (iconName) {
    case 'Layout':
      return <Layout className="w-6 h-6 text-white" />;
    case 'KanbanSquare':
      return <KanbanSquare className="w-6 h-6 text-white" />;
    case 'Megaphone':
      return <Megaphone className="w-6 h-6 text-white" />;
    case 'MessageCircle':
      return <MessageCircle className="w-6 h-6 text-white" />;
    default:
      return <MessageCircle className="w-6 h-6 text-white" />;
  }
};

const getIconBg = (iconName: SupportOption['iconName']) => {
  switch (iconName) {
    case 'Layout':
      return 'bg-gradient-to-tr from-blue-700 to-blue-500 shadow-md shadow-blue-500/20';
    case 'KanbanSquare':
      return 'bg-gradient-to-tr from-indigo-700 to-indigo-500 shadow-md shadow-indigo-500/20';
    case 'Megaphone':
      return 'bg-gradient-to-tr from-amber-600 to-amber-500 shadow-md shadow-amber-500/20';
    case 'MessageCircle':
      return 'bg-gradient-to-tr from-emerald-600 to-emerald-500 shadow-md shadow-emerald-500/20';
    default:
      return 'bg-gradient-to-tr from-blue-700 to-blue-500 shadow-md shadow-blue-500/20';
  }
};

export const SupportCard: React.FC<SupportCardProps> = ({
  option,
  onSelect,
  dir = 'rtl',
}) => {
  const isRtl = dir === 'rtl';

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`${option.title}: ${option.buttonText}`}
      onClick={() => onSelect(option)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(option);
        }
      }}
      className="group relative flex flex-col justify-between p-6 rounded-[32px] bg-slate-50/90 border border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/50 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer overflow-hidden"
    >
      {/* Background soft ambient blur accent */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div>
        {/* Card Header: 12x12 Icon Box + Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getIconBg(option.iconName)}`}>
            {getIcon(option.iconName)}
          </div>
          {option.badge && (
            <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-blue-100 text-blue-700 shrink-0">
              {option.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-lg mb-1.5 leading-snug group-hover:text-blue-600 transition-colors">
          {option.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed mb-4">
          {option.description}
        </p>

        {/* Bullet Points if present */}
        {option.bulletPoints && option.bulletPoints.length > 0 && (
          <div className="mb-4 bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              {option.bulletPoints.map((point, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="leading-tight">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Button Section */}
      <button
        type="button"
        tabIndex={-1}
        className="w-full mt-2 py-3 px-4 bg-white border border-slate-200 text-blue-600 font-bold text-sm rounded-2xl shadow-xs group-hover:shadow-md group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <span>{option.buttonText}</span>
        {isRtl ? (
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        )}
      </button>
    </div>
  );
};
