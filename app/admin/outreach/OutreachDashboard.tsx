'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LeadType, MessageTemplate, OutreachLead } from '../../types';
import {
  addLeadAction,
  deleteLeadAction,
  addTemplateAction,
  updateTemplateAction,
  deleteTemplateAction,
} from './actions';
import { AddLeadModal } from './AddLeadModal';
import { ManageTemplatesModal } from './ManageTemplatesModal';
import { LeadRow } from './LeadRow';
import { LeadCard } from './LeadCard';
import { MessagePreview } from './MessagePreview';
import { openWhatsApp } from '../../utils/whatsapp';
import {
  UserPlus,
  Search,
  MessageSquareText,
  Send,
  Users,
  ShoppingBag,
  MessageCircle,
  RotateCcw,
  Sparkles,
  X,
  Filter,
} from 'lucide-react';

interface OutreachDashboardProps {
  initialLeads: OutreachLead[];
  initialTemplates: MessageTemplate[];
}

export const OutreachDashboard: React.FC<OutreachDashboardProps> = ({
  initialLeads,
  initialTemplates,
}) => {
  const router = useRouter();

  const [leads, setLeads] = useState<OutreachLead[]>(initialLeads);
  const [templates, setTemplates] = useState<MessageTemplate[]>(initialTemplates);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | LeadType>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Preview Modal state
  const [previewLead, setPreviewLead] = useState<OutreachLead | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<MessageTemplate | null>(null);

  // page.tsx is a server component — useState(initialLeads) only seeds the
  // very first render, it won't pick up fresh data on its own. Re-sync
  // whenever router.refresh() causes the server to re-fetch and hand this
  // component new props (e.g. after another admin's changes, or our own
  // manual refresh button).
  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  useEffect(() => {
    setTemplates(initialTemplates);
  }, [initialTemplates]);

  // Lead actions — each hits Supabase via a server action, then syncs
  // local state from the (authoritative) row the DB handed back.
  const handleAddLead = async (
    leadData: Omit<OutreachLead, 'id' | 'created_at'>,
    _selectedTemplateId?: string,
    _openWhatsAppAfter?: boolean
  ) => {
    setIsSyncing(true);
    const { data, error } = await addLeadAction(leadData);
    setIsSyncing(false);
    if (error) {
      alert('تعذّرت إضافة العميل المحتمل: ' + error);
      return;
    }
    if (data) setLeads((prev) => [data, ...prev]);
  };

  const handleDeleteLead = async (id: string) => {
    const previous = leads;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (previewLead?.id === id) {
      setPreviewLead(null);
      setPreviewTemplate(null);
    }

    const { error } = await deleteLeadAction(id);
    if (error) {
      alert('تعذّر حذف العميل المحتمل: ' + error);
      setLeads(previous);
    }
  };

  // Template actions
  const handleAddTemplate = async (
    tplData: Omit<MessageTemplate, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setIsSyncing(true);
    const { data, error } = await addTemplateAction(tplData);
    setIsSyncing(false);
    if (error) {
      alert('تعذّرت إضافة القالب: ' + error);
      return;
    }
    if (data) setTemplates((prev) => [data, ...prev]);
  };

  const handleUpdateTemplate = async (
    id: string,
    updates: Partial<MessageTemplate>
  ) => {
    const { data, error } = await updateTemplateAction(id, updates);
    if (error) {
      alert('تعذّر تحديث القالب: ' + error);
      return;
    }
    if (data) setTemplates((prev) => prev.map((t) => (t.id === id ? data : t)));
  };

  const handleDeleteTemplate = async (id: string) => {
    const previous = templates;
    setTemplates((prev) => prev.filter((t) => t.id !== id));

    const { error } = await deleteTemplateAction(id);
    if (error) {
      alert('تعذّر حذف القالب: ' + error);
      setTemplates(previous);
    }
  };

  // Other admins may have added/edited leads or templates since this page
  // loaded — this re-fetches from the server component rather than
  // resetting to hardcoded sample data (there's no local-storage seed data
  // anymore, it's all in Supabase now).
  const handleRefresh = () => {
    router.refresh();
  };

  // Search and filter logic
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.whatsapp_number.includes(searchQuery);

    const matchesFilter =
      activeFilter === 'all' || lead.lead_type === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const productPageCount = leads.filter((l) => l.lead_type === 'product_page').length;
  const dmCount = leads.filter((l) => l.lead_type === 'dm').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-blue-50 text-blue-600 border border-blue-200">
              Admin Internal Tool
            </span>
            <span className="text-slate-400 text-xs font-semibold">• Yube Cold Outreach</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Yube Outreach
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your outreach leads and open WhatsApp conversations directly.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsTemplatesModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquareText className="w-4 h-4 text-blue-600" />
            <span>Templates ({templates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isSyncing ? 'جاري الحفظ...' : '+ Add Lead'}</span>
          </button>
        </div>
      </div>

      {/* Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-white border-blue-500 shadow-sm ring-2 ring-blue-500/10'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Leads</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{leads.length}</div>
        </button>

        <button
          onClick={() => setActiveFilter('product_page')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeFilter === 'product_page'
              ? 'bg-white border-purple-500 shadow-sm ring-2 ring-purple-500/10'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-purple-600 text-xs font-semibold">
            <span>Product Page Leads</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{productPageCount}</div>
        </button>

        <button
          onClick={() => setActiveFilter('dm')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeFilter === 'dm'
              ? 'bg-white border-amber-500 shadow-sm ring-2 ring-amber-500/10'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 text-xs font-semibold">
            <span>DM Conversion Leads</span>
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{dmCount}</div>
        </button>
      </div>

      {/* Main Bento Grid Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column - Leads List (Span 8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search & Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('product_page')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'product_page'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Product Page
              </button>
              <button
                onClick={() => setActiveFilter('dm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'dm'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                DM
              </button>
              <button
                onClick={handleRefresh}
                title="Refresh from server"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List Content */}
          {filteredLeads.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                      <th className="py-3.5 px-4">Business</th>
                      <th className="py-3.5 px-4">WhatsApp</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Message</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => (
                      <LeadRow
                        key={lead.id}
                        lead={lead}
                        templates={templates}
                        onDeleteLead={handleDeleteLead}
                        onPreviewLead={(l, t) => {
                          setPreviewLead(l);
                          setPreviewTemplate(t);
                        }}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="grid grid-cols-1 md:hidden gap-3">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    templates={templates}
                    onDeleteLead={handleDeleteLead}
                    onPreviewLead={(l, t) => {
                      setPreviewLead(l);
                      setPreviewTemplate(t);
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Outreach Leads Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? `No leads matching "${searchQuery}". Try clearing your search.`
                  : 'Click "+ Add Lead" to start adding potential fashion e-commerce clients.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Lead</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Bento Message Preview Panel (Span 4 on Desktop) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <MessagePreview
            phone={filteredLeads[0]?.whatsapp_number || '+213550123456'}
            selectedTemplate={templates[0] || null}
            templates={templates}
            onSelectTemplate={(t) => setPreviewTemplate(t)}
            onOpenWhatsApp={() => {
              if (filteredLeads[0] && templates[0]) {
                openWhatsApp(filteredLeads[0].whatsapp_number, templates[0].message);
              }
            }}
          />
        </div>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        templates={templates}
        onAddLead={handleAddLead}
      />

      {/* Manage Templates Modal */}
      <ManageTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        templates={templates}
        onAddTemplate={handleAddTemplate}
        onUpdateTemplate={handleUpdateTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />

      {/* Quick Preview Modal */}
      {previewLead && previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewLead.business_name}</h3>
                <p className="text-xs text-slate-500 font-mono">{previewLead.whatsapp_number}</p>
              </div>
              <button
                onClick={() => {
                  setPreviewLead(null);
                  setPreviewTemplate(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <MessagePreview
              phone={previewLead.whatsapp_number}
              selectedTemplate={previewTemplate}
              templates={templates}
              onSelectTemplate={(t) => setPreviewTemplate(t)}
              onOpenWhatsApp={() => {
                openWhatsApp(previewLead.whatsapp_number, previewTemplate.message);
                setPreviewLead(null);
                setPreviewTemplate(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
