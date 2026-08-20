import React, { useState } from 'react';
import { MessageTemplate, OutreachLead } from '../../types';
import { cleanPhoneNumber, openWhatsApp } from '../../utils/whatsapp';
import { ExternalLink, Trash2, Phone, Tag, MessageSquare, Building } from 'lucide-react';

interface LeadCardProps {
  lead: OutreachLead;
  templates: MessageTemplate[];
  onDeleteLead: (id: string) => void;
  onPreviewLead: (lead: OutreachLead, selectedTemplate: MessageTemplate) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  templates,
  onDeleteLead,
  onPreviewLead,
}) => {
  const matchingTemplates = templates.filter((t) => t.lead_type === lead.lead_type);
  const defaultTemplate = matchingTemplates[0] || templates[0] || null;

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    defaultTemplate ? defaultTemplate.id : ''
  );

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || defaultTemplate;
  const cleanPhone = cleanPhoneNumber(lead.whatsapp_number);

  const handleOpenWhatsApp = () => {
    if (!selectedTemplate) return;
    openWhatsApp(lead.whatsapp_number, selectedTemplate.message);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs hover:border-slate-300 transition-all">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-sm uppercase">
            {lead.business_name.substring(0, 2)}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">{lead.business_name}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-0.5">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{lead.whatsapp_number}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold border border-emerald-200 px-1 rounded">
                (+{cleanPhone})
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm(`Remove lead "${lead.business_name}"?`)) {
              onDeleteLead(lead.id);
            }
          }}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Type Tag & Date */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
            lead.lead_type === 'product_page'
              ? 'bg-purple-50 text-purple-600 border-purple-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}
        >
          <Tag className="w-3 h-3" />
          {lead.lead_type === 'product_page' ? 'Product Page' : 'DM Conversion'}
        </span>

        <span className="text-[10px] text-slate-400">
          Added {new Date(lead.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Template Select & Preview Trigger */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-[11px] font-semibold text-slate-600">
          Select Message
        </label>
        <div className="flex items-center gap-2">
          <select
            value={selectedTemplate?.id || ''}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                [{tpl.lead_type === 'product_page' ? 'Product' : 'DM'}] {tpl.name}
              </option>
            ))}
          </select>

          {selectedTemplate && (
            <button
              type="button"
              onClick={() => onPreviewLead(lead, selectedTemplate)}
              className="p-2 bg-slate-100 border border-slate-200 text-slate-600 hover:text-blue-600 rounded-xl transition-colors cursor-pointer"
              title="Preview Message"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span>Open WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>
    </div>
  );
};
