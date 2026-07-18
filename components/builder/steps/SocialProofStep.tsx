'use client';

import { useRef, useState } from 'react';
import { Image as ImageIcon, Music, Video, X, Loader2, Plus } from 'lucide-react';
import { uploadImageToCloudinary, uploadMediaToSupabase } from '../../../lib/upload';
import type { WizardData, SocialProofItem } from '../types';

interface SocialProofStepProps {
  data: WizardData;
  updateSocialProof: (updater: (items: SocialProofItem[]) => SocialProofItem[]) => void;
  clientId: string;
}

const TABS = [
  { id: 'image' as const, label: 'صور', icon: ImageIcon, accept: 'image/*' },
  { id: 'audio' as const, label: 'مقاطع صوتية', icon: Music, accept: 'audio/mp3,audio/mpeg,audio/m4a,.mp3,.m4a' },
  { id: 'video' as const, label: 'فيديو', icon: Video, accept: 'video/mp4,.mp4' },
];

export function SocialProofStep({ data, updateSocialProof, clientId }: SocialProofStepProps) {
  const [activeTab, setActiveTab] = useState<'image' | 'audio' | 'video'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const items = data.socialProof.filter((item) => item.type === activeTab);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (file.size > 25 * 1024 * 1024) continue; // 25MB cap for audio/video

      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const previewUrl = activeTab === 'image' ? URL.createObjectURL(file) : undefined;

      updateSocialProof((prev) => [
        ...prev,
        { id, type: activeTab, previewUrl, caption: '', uploading: true },
      ]);

      try {
        const url =
          activeTab === 'image'
            ? (await uploadImageToCloudinary(file, 'yube/proofs')).url
            : await uploadMediaToSupabase(file, clientId, activeTab);

        updateSocialProof((prev) =>
          prev.map((item) => (item.id === id ? { ...item, url, uploading: false } : item))
        );
      } catch (err) {
        console.error(err);
        updateSocialProof((prev) =>
          prev.map((item) => (item.id === id ? { ...item, uploading: false, error: true } : item))
        );
      }
    }
  };

  const removeItem = (id: string) => {
    updateSocialProof((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    updateSocialProof((prev) => prev.map((item) => (item.id === id ? { ...item, caption } : item)));
  };

  return (
    <div className="space-y-4 py-2">
      <div>
        <h2 className="text-lg font-black text-slate-900 text-center">أدلة الثقة (اختياري)</h2>
        <p className="text-[11px] text-slate-400 text-center mt-1">صور، تسجيلات صوتية، أو فيديوهات تعزز ثقة الزبائن</p>
      </div>

      <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-lg transition ${
                active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
            <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              {item.uploading ? (
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              ) : item.type === 'image' && (item.previewUrl || item.url) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.previewUrl || item.url} alt="" className="w-full h-full object-cover" />
              ) : item.type === 'audio' ? (
                <Music className="w-4 h-4 text-slate-400" />
              ) : (
                <Video className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <input
              value={item.caption}
              onChange={(e) => updateCaption(item.id, e.target.value)}
              placeholder="وصف قصير (اختياري)"
              className="flex-1 text-xs bg-transparent focus:outline-none"
            />
            {item.error && <span className="text-[9px] text-red-500 font-bold shrink-0">فشل</span>}
            <button type="button" onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-1.5 border-2 border-dashed border-slate-200 hover:border-emerald-300 text-slate-400 hover:text-emerald-500 text-xs font-bold py-3 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة {TABS.find((t) => t.id === activeTab)?.label}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={TABS.find((t) => t.id === activeTab)?.accept}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
