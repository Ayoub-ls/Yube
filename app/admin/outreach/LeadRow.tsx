import React, { useState } from 'react';
import { MessageTemplate, OutreachLead } from '../../types';
import { buildWhatsAppUrl, cleanPhoneNumber, openWhatsApp } from '../../utils/whatsapp';
import { ExternalLink, Trash2, Phone, Building, Tag, MessageSquare } from 'lucide-react';

interface LeadRowProps {
  lead: OutreachLead;
  templates: MessageTemplate[];
  onDeleteLead: (id: string) => void;
  onPreviewLead: (lead: OutreachLead, selectedTemplate: MessageTemplate) => void;
}

export const LeadRow: React.FC<LeadRowProps> = ({
  lead,
  templates,
  onDeleteLead,
  onPreviewLead,
}) => {
  // Find default template matching lead type or first template
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
    <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
      {/* Business Name */}
      <td className="py-3.5 px-4 font-semibold text-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs uppercase">
            {lead.business_name.substring(0, 2)}
          </div>
          <div>
            <span className="block font-semibold text-slate-900 text-xs">{lead.business_name}</span>
            <span className="block text-[10px] text-slate-400 font-normal">
              Added {new Date(lead.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </td>

      {/* WhatsApp Number */}
      <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>{lead.whatsapp_number}</span>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
            +{cleanPhone}
          </span>
        </div>
      </td>

      {/* Type */}
      <td className="py-3.5 px-4 text-xs">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
            lead.lead_type === 'product_page'
              ? 'bg-purple-50 text-purple-600 border-purple-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}
        >
          <Tag className="w-3 h-3" />
          {lead.lead_type === 'product_page' ? 'Product Page' : 'DM Conversion'}
        </span>
      </td>

      {/* Message Template Selection */}
      <td className="py-3.5 px-4 text-xs max-w-xs">
        <div className="flex items-center gap-2">
          <select
            value={selectedTemplate?.id || ''}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
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
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
              title="Preview message"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-xs text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="py-1.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>WhatsApp</span>
            <ExternalLink className="w-3 h-3 opacity-90" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm(`Remove lead "${lead.business_name}"?`)) {
                onDeleteLead(lead.id);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title="Delete lead"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
