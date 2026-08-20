import React from 'react';
import { MessageTemplate } from '../../types';
import { buildWhatsAppUrl, cleanPhoneNumber } from '../../utils/whatsapp';
import { MessageSquare, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface MessagePreviewProps {
  phone: string;
  selectedTemplate: MessageTemplate | null;
  templates: MessageTemplate[];
  onSelectTemplate: (template: MessageTemplate) => void;
  onOpenWhatsApp?: () => void;
  compact?: boolean;
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({
  phone,
  selectedTemplate,
  templates,
  onSelectTemplate,
  onOpenWhatsApp,
  compact = false,
}) => {
  const formattedPhone = cleanPhoneNumber(phone);
  const whatsappUrl = selectedTemplate
    ? buildWhatsAppUrl(phone, selectedTemplate.message)
    : '#';

  const handleOpenClick = (e: React.MouseEvent) => {
    if (!selectedTemplate || !phone) {
      e.preventDefault();
      return;
    }
    if (onOpenWhatsApp) {
      onOpenWhatsApp();
    }
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-slate-800 ${compact ? 'space-y-3' : 'space-y-4'}`}>
      {/* Header & Template Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Message Preview
          </span>
        </div>

        {/* Template Selector Dropdown */}
        <div className="relative">
          <select
            value={selectedTemplate?.id || ''}
            onChange={(e) => {
              const found = templates.find((t) => t.id === e.target.value);
              if (found) onSelectTemplate(found);
            }}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium cursor-pointer"
          >
            <option value="" disabled>-- Select Message Template --</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                [{tpl.lead_type === 'product_page' ? 'Product Page' : 'DM'}] {tpl.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Phone number indicator */}
      {phone && (
        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
          <span className="text-slate-500 font-medium">Destination:</span>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-700">{phone}</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              +{formattedPhone}
            </span>
          </div>
        </div>
      )}

      {/* Message Text Preview Box */}
      {selectedTemplate ? (
        <div className="relative bg-slate-50 rounded-xl p-4 border border-slate-200 text-right leading-relaxed">
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-slate-800 whitespace-pre-wrap font-sans text-right pt-4" dir="rtl">
            {selectedTemplate.message}
          </p>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-6 border border-dashed border-slate-200 text-center text-xs text-slate-500">
          Please select a message template above to preview text.
        </div>
      )}

      {/* Action Button */}
      <div className="pt-1">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpenClick}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white transition-all shadow-md ${
            selectedTemplate && phone
              ? 'bg-[#25D366] hover:bg-[#20bd5c] active:scale-[0.98] shadow-emerald-950/10 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/50'
          }`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span>Open WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-90" />
        </a>
      </div>
    </div>
  );
};
