import React from 'react';
import { StatsSummary } from '@/src/types/crm';
import {
  ShoppingBag,
  Clock,
  PhoneCall,
  CheckCircle2,
  XCircle,
  Truck,
  TrendingUp,
  Banknote,
  CalendarClock,
  Zap
} from 'lucide-react';

interface CRMStatsProps {
  stats: StatsSummary;
  onFilterStatus?: (status: string) => void;
}

const CRMStats: React.FC<CRMStatsProps> = ({ stats, onFilterStatus }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ar-DZ').format(amount) + ' د.ج';
  };

  const statCards = [
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders.toString(),
      subtext: 'من جميع صفحات الهبوط',
      icon: ShoppingBag,
      color: 'text-slate-700 bg-slate-100',
      borderColor: 'border-slate-200',
      onClick: () => onFilterStatus?.('all')
    },
    {
      title: 'قيد الانتظار',
      value: stats.pendingCount.toString(),
      subtext: 'تحتاج اتصال بأسرع وقت',
      icon: Clock,
      color: 'text-amber-700 bg-amber-50',
      borderColor: 'border-amber-200/70',
      statusKey: 'pending',
      onClick: () => onFilterStatus?.('pending')
    },
    {
      title: 'جاري الاتصال',
      value: stats.callingCount.toString(),
      subtext: 'مكالمات ومحاولات الآن',
      icon: PhoneCall,
      color: 'text-orange-700 bg-orange-50',
      borderColor: 'border-orange-200/70',
      statusKey: 'calling',
      onClick: () => onFilterStatus?.('calling')
    },
    {
      title: 'الطلبات المؤكدة',
      value: stats.confirmedCount.toString(),
      subtext: 'جاهزة للشحن والتوصيل',
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50',
      borderColor: 'border-emerald-200/70',
      statusKey: 'confirmed',
      onClick: () => onFilterStatus?.('confirmed')
    },
    {
      title: 'الطلبات الملغاة',
      value: stats.cancelledCount.toString(),
      subtext: 'رفض أو تعذر الوصول',
      icon: XCircle,
      color: 'text-rose-700 bg-rose-50',
      borderColor: 'border-rose-200/70',
      statusKey: 'cancelled',
      onClick: () => onFilterStatus?.('cancelled')
    },
    {
      title: 'تم التوصيل',
      value: stats.deliveredCount.toString(),
      subtext: 'تم تسليمها واستلام المبلغ',
      icon: Truck,
      color: 'text-blue-700 bg-blue-50',
      borderColor: 'border-blue-200/70',
      statusKey: 'delivered',
      onClick: () => onFilterStatus?.('delivered')
    },
    {
      title: 'نسبة التأكيد %',
      value: `${stats.closingRate}%`,
      subtext: 'مؤشر أداء فريق الاتصال',
      icon: TrendingUp,
      color: 'text-emerald-800 bg-emerald-100/70',
      borderColor: 'border-emerald-300',
      highlight: true
    },
    {
      title: 'الإيرادات المؤكدة',
      value: formatCurrency(stats.totalRevenue),
      subtext: 'قيمة الطلبات المؤكدة',
      icon: Banknote,
      color: 'text-slate-900 bg-amber-50',
      borderColor: 'border-amber-200',
      highlight: true
    },
    {
      title: 'متابعات معلقة',
      value: stats.pendingFollowUps.toString(),
      subtext: 'تذكير محدد بوقته اليوم',
      icon: CalendarClock,
      color: 'text-purple-700 bg-purple-50',
      borderColor: 'border-purple-200/70'
    },
    {
      title: 'متوسط وقت التأكيد',
      value: `${stats.avgConfirmationTimeMinutes} دقيقة`,
      subtext: 'سرعة الاستجابة من الاستلام',
      icon: Zap,
      color: 'text-indigo-700 bg-indigo-50',
      borderColor: 'border-indigo-200/70'
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.onClick}
              className={`p-3 sm:p-3.5 rounded-2xl bg-white border ${card.borderColor
                } shadow-xs transition-all duration-200 ${card.onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
                } ${card.highlight ? 'ring-1 ring-amber-400/30' : ''}`}
            >
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[10px] sm:text-xs font-medium text-slate-500 line-clamp-1">{card.title}</span>
                <div className={`p-1 sm:p-1.5 rounded-xl ${card.color} shrink-0`}>
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
              <div className="text-sm xs:text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate" title={card.value}>
                {card.value}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 line-clamp-1">{card.subtext}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CRMStats;
