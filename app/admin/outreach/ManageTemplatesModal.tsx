import React, { useState, useRef } from 'react';
import { LeadType, MessageTemplate } from '../../types';
import { renderTemplateMessage } from '../../utils/whatsapp';
import { X, Plus, Edit2, Trash2, Save, FileText, Braces } from 'lucide-react';

interface ManageTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: MessageTemplate[];
  onAddTemplate: (data: Omit<MessageTemplate, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateTemplate: (id: string, updates: Partial<MessageTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
}

export const ManageTemplatesModal: React.FC<ManageTemplatesModalProps> = ({
  isOpen,
  onClose,
  templates,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [leadType, setLeadType] = useState<LeadType>('product_page');
  const [message, setMessage] = useState('');
  const messageRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  // Inserts {{businessName}} at wherever the admin's cursor currently is in
  // the textarea (or at the end, if nothing is focused yet), rather than
  // always appending to the end of the message.
  const insertBusinessNameVariable = () => {
    const textarea = messageRef.current;
    const variable = '{{businessName}}';

    if (!textarea) {
      setMessage((prev) => prev + variable);
      return;
    }

    const start = textarea.selectionStart ?? message.length;
    const end = textarea.selectionEnd ?? message.length;
    const next = message.slice(0, start) + variable + message.slice(end);
    setMessage(next);

    // Restore focus and place the cursor right after the inserted variable.
    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + variable.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const startEdit = (tpl: MessageTemplate) => {
    setEditingId(tpl.id);
    setIsAddingNew(false);
    setName(tpl.name);
    setLeadType(tpl.lead_type);
    setMessage(tpl.message);
  };

  const startAdd = () => {
    setEditingId(null);
    setIsAddingNew(true);
    setName('');
    setLeadType('product_page');
    setMessage('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      alert('Please provide a template name and message text.');
      return;
    }

    if (isAddingNew) {
      onAddTemplate({
        name: name.trim(),
        lead_type: leadType,
        message: message.trim(),
      });
      setIsAddingNew(false);
    } else if (editingId) {
      onUpdateTemplate(editingId, {
        name: name.trim(),
        lead_type: leadType,
        message: message.trim(),
      });
      setEditingId(null);
    }

    setName('');
    setMessage('');
  };

  const cancelForm = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Message Templates</h3>
              <p className="text-xs text-slate-500">Create & edit reusable WhatsApp cold messages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Actions */}
          {!isAddingNew && !editingId && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {templates.length} Active Templates
              </span>
              <button
                type="button"
                onClick={startAdd}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Template</span>
              </button>
            </div>
          )}

          {/* Add / Edit Form */}
          {(isAddingNew || editingId) && (
            <form onSubmit={handleSave} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-blue-600">
                  {isAddingNew ? 'Create New Template' : 'Edit Template'}
                </span>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="text-slate-400 hover:text-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Product Page - Intro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Lead Type Category
                  </label>
                  <select
                    value={leadType}
                    onChange={(e) => setLeadType(e.target.value as LeadType)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="product_page">Product Page</option>
                    <option value="dm">DM Conversion</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Message Content (Arabic / Darija supported)
                  </label>
                  <button
                    type="button"
                    onClick={insertBusinessNameVariable}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Insert at cursor position"
                  >
                    <Braces className="w-3 h-3" />
                    Insert {'{{businessName}}'}
                  </button>
                </div>
                <textarea
                  ref={messageRef}
                  required
                  rows={5}
                  dir="rtl"
                  placeholder="سلام خويا..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-800 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 dir-rtl text-right"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {'{{businessName}}'} gets replaced with each lead's business name when the message is sent — put it anywhere in the text above.
                </p>
                {message.includes('{{') && (
                  <div className="mt-2 bg-emerald-50/60 border border-emerald-200 rounded-lg p-2.5">
                    <span className="block text-[10px] uppercase font-bold text-emerald-700 tracking-wider mb-1 text-left">
                      Preview (example: "Elegance Boutique DZ")
                    </span>
                    <p className="text-[11px] text-slate-700 whitespace-pre-wrap font-sans text-right" dir="rtl">
                      {renderTemplateMessage(message, 'Elegance Boutique DZ')}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 text-xs cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Template</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Templates */}
          <div className="space-y-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-xs">{tpl.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        tpl.lead_type === 'product_page'
                          ? 'bg-purple-50 text-purple-600 border-purple-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}
                    >
                      {tpl.lead_type === 'product_page' ? 'Product Page' : 'DM Conversion'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(tpl)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                      title="Edit template"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {templates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete template "${tpl.name}"?`)) {
                            onDeleteTemplate(tpl.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                        title="Delete template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-right leading-relaxed">
                  <p className="text-xs text-slate-800 font-sans whitespace-pre-wrap text-right" dir="rtl">
                    {tpl.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
