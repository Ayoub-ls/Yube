import React, { useState } from 'react';
import { LeadType, MessageTemplate, OutreachLead } from '../../types';
import { cleanPhoneNumber, openWhatsApp } from '../../utils/whatsapp';
import { X, Plus, UserPlus, Phone, Tag, Building, ArrowRight } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: MessageTemplate[];
  onAddLead: (
    leadData: Omit<OutreachLead, 'id' | 'created_at'>,
    selectedTemplateId?: string,
    openWhatsAppAfter?: boolean
  ) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  templates,
  onAddLead,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [leadType, setLeadType] = useState<LeadType>('product_page');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  if (!isOpen) return null;

  // Filter templates relevant to lead type or allow all
  const filteredTemplates = templates.filter((t) => t.lead_type === leadType);
  const availableTemplates = filteredTemplates.length > 0 ? filteredTemplates : templates;
  
  // Currently chosen template
  const chosenTemplate = templates.find((t) => t.id === selectedTemplateId) || availableTemplates[0] || null;

  const handleSubmit = (e: React.FormEvent, shouldOpenWhatsApp: boolean) => {
    e.preventDefault();

    if (!businessName.trim() || !whatsappNumber.trim()) {
      alert('Please fill in both Business Name and WhatsApp Number.');
      return;
    }

    const leadPayload = {
      business_name: businessName.trim(),
      whatsapp_number: whatsappNumber.trim(),
      lead_type: leadType,
    };

    onAddLead(leadPayload, chosenTemplate?.id, shouldOpenWhatsApp);

    if (shouldOpenWhatsApp && chosenTemplate) {
      openWhatsApp(whatsappNumber.trim(), chosenTemplate.message);
    }

    // Reset form
    setBusinessName('');
    setWhatsappNumber('');
    setLeadType('product_page');
    setSelectedTemplateId('');
    onClose();
  };

  const formattedPreviewPhone = whatsappNumber ? cleanPhoneNumber(whatsappNumber) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Add New Lead</h3>
              <p className="text-xs text-slate-500">Enter lead details to initiate WhatsApp outreach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Business Name <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elegance Fashion DZ"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
            />
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                WhatsApp Number <span className="text-blue-600">*</span>
              </span>
              {formattedPreviewPhone && (
                <span className="text-[11px] font-mono text-emerald-700 font-bold">
                  Formatted: +{formattedPreviewPhone}
                </span>
              )}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 0550123456 or +213550123456"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-500">
              Supports local Algerian numbers (05/06/07) automatically converted to +213.
            </p>
          </div>

          {/* Lead Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Lead Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLeadType('product_page');
                  const match = templates.find((t) => t.lead_type === 'product_page');
                  if (match) setSelectedTemplateId(match.id);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  leadType === 'product_page'
                    ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${leadType === 'product_page' ? 'bg-purple-600' : 'bg-slate-300'}`} />
                Product Page
              </button>

              <button
                type="button"
                onClick={() => {
                  setLeadType('dm');
                  const match = templates.find((t) => t.lead_type === 'dm');
                  if (match) setSelectedTemplateId(match.id);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  leadType === 'dm'
                    ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${leadType === 'dm' ? 'bg-amber-600' : 'bg-slate-300'}`} />
                DM Conversion
              </button>
            </div>
          </div>

          {/* Message Template Selection */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">
              Select Message Template <span className="text-slate-400 font-normal">(Manual Selection)</span>
            </label>
            <select
              value={chosenTemplate?.id || ''}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  [{tpl.lead_type === 'product_page' ? 'Product Page' : 'DM'}] {tpl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Message Preview Box */}
          {chosenTemplate && (
            <div className="space-y-1 bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-right leading-relaxed">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-left">
                Template Preview ({chosenTemplate.name})
              </span>
              <p className="text-[11px] text-slate-800 whitespace-pre-wrap font-sans text-right pt-1" dir="rtl">
                {chosenTemplate.message}
              </p>
            </div>
          )}
        </form>

        {/* Modal Footer Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          >
            Save Lead Only
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5c] text-white flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-[0.98]"
          >
            <span>Save & Open WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
