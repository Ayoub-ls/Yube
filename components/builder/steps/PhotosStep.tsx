'use client';

import { useRef } from 'react';
import { ImagePlus, X, Loader2, ArrowLeftRight } from 'lucide-react';
import { uploadImageToCloudinary } from '../../../lib/upload';
import type { WizardData, PendingImage } from '../types';

interface PhotosStepProps {
  data: WizardData;
  update: (patch: Partial<WizardData>) => void;
  // Functional updater specifically for the images array — needed
  // because uploads happen inside an async loop, and reading `data.images`
  // directly inside that loop after the first `await` would use a stale
  // snapshot from before any earlier upload in the same batch finished.
  updateImages: (updater: (imgs: PendingImage[]) => PendingImage[]) => void;
  // When true, shows a small "color name" input under each thumbnail —
  // only used by themes with color-variant image switching (e.g. Rita).
  showColorLabels?: boolean;
}

export function PhotosStep({ data, update, updateImages, showColorLabels }: PhotosStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remainingSlots = 8 - data.images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 10 * 1024 * 1024) continue;

      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const previewUrl = URL.createObjectURL(file);

      updateImages((imgs) => [...imgs, { id, previewUrl, uploading: true }]);

      try {
        const result = await uploadImageToCloudinary(file, 'yube/products');
        updateImages((imgs) =>
          imgs.map((img) => (img.id === id ? { ...img, uploadedUrl: result.url, uploading: false } : img))
        );
      } catch (err) {
        console.error(err);
        updateImages((imgs) =>
          imgs.map((img) => (img.id === id ? { ...img, uploading: false, error: true } : img))
        );
      }
    }
  };

  const removeImage = (id: string) => {
    updateImages((imgs) => imgs.filter((img) => img.id !== id));
  };

  const updateColorLabel = (id: string, colorLabel: string) => {
    updateImages((imgs) => imgs.map((img) => (img.id === id ? { ...img, colorLabel } : img)));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    updateImages((imgs) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= imgs.length) return imgs;
      const reordered = [...imgs];
      [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
      return reordered;
    });
  };

  return (
    <div className="space-y-3 py-2">
      <h2 className="text-lg font-black text-slate-900 text-center mb-1">أضف صور منتجك</h2>
      <p className="text-[11px] text-slate-400 text-center mb-3">
        {showColorLabels
          ? 'أضيفي صورة لكل لون متوفر، واكتبي اسم اللون تحت كل صورة'
          : 'من صورة واحدة إلى 8 صور — الصورة الأولى هي الرئيسية'}
      </p>

      <div className={showColorLabels ? 'grid grid-cols-2 xs:grid-cols-3 gap-3' : 'grid grid-cols-2 xs:grid-cols-4 gap-2'}>
        {data.images.map((img, index) => (
          <div key={img.id} className="space-y-1.5">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
              {img.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
              {img.error && (
                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">فشل الرفع</span>
                </div>
              )}
              {index === 0 && !img.uploading && !img.error && !showColorLabels && (
                <span className="absolute bottom-1 right-1 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">رئيسية</span>
              )}
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1 left-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition"
              >
                <X className="w-3 h-3" />
              </button>
              {data.images.length > 1 && !showColorLabels && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index === 0 ? 1 : -1)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition opacity-0 group-hover:opacity-100"
                  title="تبديل الترتيب"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                </button>
              )}
            </div>
            {showColorLabels && (
              <input
                value={img.colorLabel || ''}
                onChange={(e) => updateColorLabel(img.id, e.target.value)}
                placeholder="اسم اللون (مثال: بوردو)"
                className="w-full text-[10px] border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-emerald-400"
              />
            )}
          </div>
        ))}

        {data.images.length < 8 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-300 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-emerald-500 transition"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-[9px] font-bold">إضافة</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
