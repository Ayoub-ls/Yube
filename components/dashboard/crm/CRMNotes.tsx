import React, { useState } from 'react';
import { NoteItem } from '@/src/types/crm';
import { MessageSquare, Send, Tag, User, Clock } from 'lucide-react';

interface CRMNotesProps {
  notes: NoteItem[];
  onAddNote: (noteText: string, tag?: string) => void;
}

const NOTE_TAG_OPTIONS = [
  'ملاحظة عامة',
  'تفاصيل العنوان',
  'تأكيد المقاس',
  'تعديل اللون',
  'طلب تأجيل',
  'ملاحظة التوصيل'
];

const CRMNotes: React.FC<CRMNotesProps> = ({ notes, onAddNote }) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedTag, setSelectedTag] = useState(NOTE_TAG_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText.trim(), selectedTag);
    setNewNoteText('');
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('ar-DZ')} - ${d.toLocaleTimeString('ar-DZ', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-600" />
          <span>الملاحظات الداخلية ({notes.length})</span>
        </h3>
      </div>

      {/* Note Creation Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
        <textarea
          rows={2}
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="أضف ملاحظة جديدة حول تفضيلات الزبون أو الاتصال..."
          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none"
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none cursor-pointer text-slate-700"
            >
              {NOTE_TAG_OPTIONS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!newNoteText.trim()}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>حفظ الملاحظة</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto pl-1">
        {notes.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center bg-white rounded-xl border border-slate-100">
            لا توجد ملاحظات سابقة لهذا الطلب.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{note.author}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(note.timestamp)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {note.text}
              </p>

              {note.tag && (
                <div className="pt-1">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">
                    {note.tag}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CRMNotes;
