'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calculator, TrendingUp, ArrowLeft } from 'lucide-react';

const YUBE_CVR = 5; // نسبة التحويل مع Yube
const YUBE_CLOSING = 5; // Yube here refers to a 5% *uplift multiplier*, not an absolute rate — see note below.

function formatDZD(value: number) {
  return Math.round(value).toLocaleString('en-US') + ' دج';
}

export default function RevenueCalculator() {
  const [clicks, setClicks] = useState('1000');
  const [cvr, setCvr] = useState('2');
  const [closing, setClosing] = useState('50');
  const [price, setPrice] = useState('3500');

  const { currentRevenue, potentialRevenue, diff, diffPct } = useMemo(() => {
    const c = parseFloat(clicks) || 0;
    const cv = parseFloat(cvr) || 0;
    const cl = parseFloat(closing) || 0;
    const p = parseFloat(price) || 0;

    // نسبة التحويل والإغلاق الحاليتين للمستخدم
    const currentOrders = c * (cv / 100);
    const currentConfirmed = currentOrders * (cl / 100);
    const current = currentConfirmed * p;

    // مع Yube: نفترض تحسّن معدلي التحويل والإغلاق بنسبة 5 نقاط مئوية إضافية لكل منهما
    const potentialCvr = cv + YUBE_CVR;
    const potentialClosing = cl + YUBE_CLOSING;
    const potentialOrders = c * (potentialCvr / 100);
    const potentialConfirmed = potentialOrders * (potentialClosing / 100);
    const potential = potentialConfirmed * p;

    const d = potential - current;
    const dPct = current > 0 ? (d / current) * 100 : 0;

    return {
      currentRevenue: current,
      potentialRevenue: potential,
      diff: d,
      diffPct: dPct,
    };
  }, [clicks, cvr, closing, price]);

  return (
    <section id="calculator" className="py-16 xs:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-10 xs:mb-12">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] xs:text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/20">
          <Calculator className="w-3.5 h-3.5" />
          حاسبة الأرباح الضائعة
        </span>
        <h2 className="text-2xl xs:text-3xl font-black text-white">شحال تخسر شهرياً بدون ما تدري؟</h2>
        <p className="text-slate-400 text-xs xs:text-sm max-w-md mx-auto">
          دخّل أرقامك الحالية وشوف بنفسك الفرق اللي يقدر يصنعه تحسين صفحتك ونظام المتابعة.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 xs:p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Inputs */}
        <div className="space-y-5 text-right">
          <div className="space-y-1.5">
            <label className="text-xs xs:text-sm font-bold text-slate-300">عدد النقرات على الرابط شهرياً</label>
            <input
              type="number"
              min="0"
              value={clicks}
              onChange={(e) => setClicks(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm font-bold text-right focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs xs:text-sm font-bold text-slate-300">معدل التحويل الحالي (CVR %)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={cvr}
              onChange={(e) => setCvr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm font-bold text-right focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs xs:text-sm font-bold text-slate-300">نسبة تأكيد الطلبيات (Closing %)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={closing}
              onChange={(e) => setClosing(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm font-bold text-right focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs xs:text-sm font-bold text-slate-300">سعر المنتج (دج)</label>
            <input
              type="number"
              min="0"
              step="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm font-bold text-right focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4 flex flex-col justify-center">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-right space-y-1">
            <p className="text-[11px] xs:text-xs text-slate-500 font-bold">إيراداتك الحالية شهرياً</p>
            <p className="text-xl xs:text-2xl font-black text-slate-300">{formatDZD(currentRevenue)}</p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-right space-y-1 relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="relative flex items-center justify-end gap-1.5">
              <p className="text-[11px] xs:text-xs text-emerald-400 font-bold">إيراداتك المحتملة مع Yube</p>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="relative text-xl xs:text-2xl font-black text-emerald-400">{formatDZD(potentialRevenue)}</p>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] xs:text-xs text-slate-400 font-bold">
              يعني رح تربح تقريباً{' '}
              <span className="text-white font-black">{formatDZD(Math.max(diff, 0))}</span>{' '}
              زيادة شهرياً
              {diffPct > 0 && (
                <span className="text-emerald-400"> (+{Math.round(diffPct)}%)</span>
              )}
            </p>
          </div>

          <Link
            href="/auth/signup"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs xs:text-sm px-4 py-3 xs:py-3.5 rounded-xl xs:rounded-2xl shadow-lg shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 xs:gap-2"
          >
            <span>ابدأ تجربتك المجانية وحقق هذا الرقم</span>
            <ArrowLeft className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
          </Link>
          <p className="text-center text-[10px] xs:text-[11px] text-slate-600">
            هذا تقدير تقريبي مبني على أرقامك، النتائج الفعلية تختلف حسب المنتج والحملة.
          </p>
        </div>
      </div>
    </section>
  );
}
