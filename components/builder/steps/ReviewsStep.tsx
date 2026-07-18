'use client';

import { useState } from 'react';
import { Star, Plus, X } from 'lucide-react';
import type { WizardData, ReviewItem } from '../types';

export function ReviewsStep({ data, update }: { data: WizardData; update: (patch: Partial<WizardData>) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const resetForm = () => {
    setName('');
    setLocation('');
    setRating(5);
    setText('');
    setShowForm(false);
  };

  const addReview = () => {
    if (!name.trim() || !text.trim()) return;
    const newReview: ReviewItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      location: location.trim(),
      rating,
      text: text.trim(),
    };
    update({ reviews: [...data.reviews, newReview] });
    resetForm();
  };

  const removeReview = (id: string) => {
    update({ reviews: data.reviews.filter((r) => r.id !== id) });
  };

  return (
    <div className="space-y-4 py-2">
      <div>
        <h2 className="text-lg font-black text-slate-900 text-center">تقييمات الزبائن (اختياري)</h2>
        <p className="text-[11px] text-slate-400 text-center mt-1">حتى 10 تقييمات تعزز مصداقية صفحتك</p>
      </div>

      <div className="space-y-2">
        {data.reviews.map((r) => (
          <div key={r.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{r.name}{r.location ? ` · ${r.location}` : ''}</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-[10px]">{'★'.repeat(r.rating)}</span>
                <button type="button" onClick={() => removeReview(r.id)} className="text-slate-300 hover:text-red-500 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">{r.text}</p>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="bg-white border border-emerald-200 rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم"
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-400"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="الولاية (اختياري)"
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}>
                <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="نص التقييم..."
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-400 resize-none"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={addReview}
              disabled={!name.trim() || !text.trim()}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg transition"
            >
              إضافة
            </button>
            <button type="button" onClick={resetForm} className="text-xs text-slate-400 px-3">
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        data.reviews.length < 10 && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-1.5 border-2 border-dashed border-slate-200 hover:border-emerald-300 text-slate-400 hover:text-emerald-500 text-xs font-bold py-3 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة تقييم</span>
          </button>
        )
      )}
    </div>
  );
}
