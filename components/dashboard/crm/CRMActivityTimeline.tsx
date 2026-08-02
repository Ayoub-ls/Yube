import React from 'react';
import { ActivityItem, ActivityType } from '@/src/types/crm';
import {
  PlusCircle,
  PhoneCall,
  PhoneOff,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Truck,
  FileText,
  Bell,
  Clock
} from 'lucide-react';

interface CRMActivityTimelineProps {
  activities: ActivityItem[];
}

const CRMActivityTimeline: React.FC<CRMActivityTimelineProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'created':
        return { icon: PlusCircle, bg: 'bg-blue-100 text-blue-700', border: 'border-blue-300' };
      case 'called':
        return { icon: PhoneCall, bg: 'bg-amber-100 text-amber-700', border: 'border-amber-300' };
      case 'no_answer':
        return { icon: PhoneOff, bg: 'bg-orange-100 text-orange-700', border: 'border-orange-300' };
      case 'whatsapp':
        return { icon: MessageSquare, bg: 'bg-teal-100 text-teal-700', border: 'border-teal-300' };
      case 'confirmed':
        return { icon: CheckCircle2, bg: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-300' };
      case 'cancelled':
        return { icon: XCircle, bg: 'bg-rose-100 text-rose-700', border: 'border-rose-300' };
      case 'delivered':
        return { icon: Truck, bg: 'bg-blue-100 text-blue-700', border: 'border-blue-300' };
      case 'note_added':
        return { icon: FileText, bg: 'bg-slate-100 text-slate-700', border: 'border-slate-300' };
      case 'reminder_set':
        return { icon: Bell, bg: 'bg-purple-100 text-purple-700', border: 'border-purple-300' };
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('ar-DZ')} - ${d.toLocaleTimeString('ar-DZ', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  return (
    <div className="w-full space-y-3">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-600" />
        <span>سجل النشاطات والمكالمات ({activities.length})</span>
      </h3>

      <div className="relative pr-4 border-r-2 border-slate-200 space-y-4">
        {activities.map((act) => {
          const config = getActivityIcon(act.type);
          const Icon = config.icon;
          return (
            <div key={act.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -right-[23px] top-0.5 p-1 rounded-full border ${config.bg} ${config.border} shadow-2xs`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Activity Card */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{act.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {formatDate(act.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{act.description}</p>
                <div className="text-[10px] text-slate-400 font-semibold pt-0.5">
                  المسؤول: <span className="text-slate-700">{act.actor}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CRMActivityTimeline;
