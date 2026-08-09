'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updateClientShippingConfig } from '../actions';
import { WILAYAS } from '../../../lib/wilayas';
import { Truck, Shield, HelpCircle, Save } from 'lucide-react';

const initialState = { error: undefined as string | undefined, success: undefined as boolean | undefined };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-black px-5 py-2.5 rounded-xl transition cursor-pointer shadow-sm"
    >
      <Save className="w-3.5 h-3.5" />
      <span>{pending ? 'جاري الحفظ...' : 'حفظ إعدادات الشحن'}</span>
    </button>
  );
}

export function ShippingSettingsForm({ client }: { client: any }) {
  const [state, formAction] = useFormState(updateClientShippingConfig, initialState);
  const currentConfig = client.shipping_config || {};
  const [courier, setCourier] = useState(currentConfig.courier || 'custom');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <form action={formAction} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-5 text-right" dir="rtl">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <Truck className="w-5 h-5 text-emerald-500" />
        <div>
          <h2 className="text-sm font-bold text-slate-800">إعدادات الشحن والتوصيل</h2>
          <p className="text-[10px] text-slate-400">اختر طريقة حساب مصاريف التوصيل لزبائنك</p>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold px-4 py-2.5 rounded-xl">
          تم حفظ إعدادات الشحن بنجاح ✅
        </div>
      )}

      {/* Courier Selection */}
      <div className="space-y-1.5">
        <label htmlFor="courier" className="text-xs font-bold text-slate-700">طريقة التوصيل المستخدمة</label>
        <select
          id="courier"
          name="courier"
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
        >
          <option value="custom">أسعار شحن افتراضية (حسب ولايات الجزائر)</option>
          <option value="flat">أسعار شحن موحدة (سعر ثابت للمنزل وللمكتب)</option>
          <option value="yalidine">شركة ياليدين (Yalidine Express)</option>
          <option value="zrexpress">شركة ZR Express</option>
          <option value="maystro">شركة Maystro Delivery</option>
          <option value="noest">شركة Noest (Anderson)</option>
          <option value="ecotrack">شركة Ecotrack</option>
        </select>
      </div>

      {/* Flat Rates Configuration */}
      {courier === 'flat' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-fadeIn">
          <div className="space-y-1.5">
            <label htmlFor="home_fee" className="text-xs font-bold text-slate-700">سعر التوصيل للمنزل (دج)</label>
            <input
              id="home_fee"
              name="home_fee"
              type="number"
              min="0"
              defaultValue={currentConfig.home_fee ?? 600}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="stopdesk_fee" className="text-xs font-bold text-slate-700">سعر التوصيل للمكتب (دج)</label>
            <input
              id="stopdesk_fee"
              name="stopdesk_fee"
              type="number"
              min="0"
              defaultValue={currentConfig.stopdesk_fee ?? 400}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
            />
          </div>
        </div>
      )}

      {/* Custom Wilaya Rates Configuration */}
      {courier === 'custom' && (
        <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800">تخصيص أسعار شحن الولايات</h3>
              <p className="text-[10px] text-slate-400">يمكنك تعديل سعر شحن كل ولاية على حدة. اترك الحقول فارغة لاستخدام الأسعار الافتراضية للولاية.</p>
            </div>
            
            <input
              type="text"
              placeholder="ابحث عن ولاية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-400 w-full sm:w-48 text-right"
            />
          </div>

          <div className="overflow-y-auto max-h-[350px] pr-1.5 space-y-2.5">
            {WILAYAS.filter(w => 
              w.nameAr.includes(searchQuery) || 
              w.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
              w.code.toString().includes(searchQuery)
            ).map((w) => {
              const customHome = currentConfig.wilaya_fees?.[w.code]?.home;
              const customStop = currentConfig.wilaya_fees?.[w.code]?.stopdesk;

              return (
                <div key={w.id} className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
                  <div className="font-bold text-xs text-slate-700 sm:w-1/4">
                    <span>{w.code} - {w.nameAr}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 shrink-0">توصيل للبيت:</span>
                      <input
                        name={`wilaya_home_${w.code}`}
                        type="number"
                        min="0"
                        placeholder={`${w.shippingFee} دج`}
                        defaultValue={customHome !== undefined ? customHome : ''}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-center focus:outline-none focus:border-emerald-400 bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 shrink-0">استلام من المكتب:</span>
                      <input
                        name={`wilaya_stopdesk_${w.code}`}
                        type="number"
                        min="0"
                        placeholder={`${Math.max(300, w.shippingFee - 200)} دج`}
                        defaultValue={customStop !== undefined ? customStop : ''}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-center focus:outline-none focus:border-emerald-400 bg-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Courier Credentials & Origin Wilaya */}
      {['yalidine', 'zrexpress', 'maystro', 'noest', 'ecotrack'].includes(courier) && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
            <Shield className="w-4 h-4 shrink-0" />
            <span>سيتم حساب أسعار التوصيل لزبائنك تلقائياً وبشكل مباشر من شركة التوصيل المحددة.</span>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="from_wilaya" className="text-xs font-bold text-slate-700">ولاية المصدر (الولاية التي تشحن منها طرودك)</label>
            <select
              id="from_wilaya"
              name="from_wilaya"
              defaultValue={currentConfig.from_wilaya ?? 16}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
            >
              {WILAYAS.map((w) => (
                <option key={w.id} value={w.code}>
                  {w.code} - {w.nameAr}
                </option>
              ))}
            </select>
          </div>

          {courier === 'yalidine' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="yalidine_api_id" className="text-xs font-bold text-slate-700">Yalidine API ID</label>
                <input
                  id="yalidine_api_id"
                  name="yalidine_api_id"
                  dir="ltr"
                  defaultValue={currentConfig.yalidine_api_id || ''}
                  placeholder="مثال: 928374928"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="yalidine_api_token" className="text-xs font-bold text-slate-700">Yalidine API Token</label>
                <input
                  id="yalidine_api_token"
                  name="yalidine_api_token"
                  type="password"
                  dir="ltr"
                  defaultValue={currentConfig.yalidine_api_token || ''}
                  placeholder="••••••••••••••••••••••••"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                />
              </div>
            </div>
          )}

          {courier === 'zrexpress' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="zrexpress_token" className="text-xs font-bold text-slate-700">ZR Express Token</label>
                <input
                  id="zrexpress_token"
                  name="zrexpress_token"
                  dir="ltr"
                  defaultValue={currentConfig.zrexpress_token || ''}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="zrexpress_key" className="text-xs font-bold text-slate-700">ZR Express Key</label>
                <input
                  id="zrexpress_key"
                  name="zrexpress_key"
                  type="password"
                  dir="ltr"
                  defaultValue={currentConfig.zrexpress_key || ''}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                />
              </div>
            </div>
          )}

          {courier === 'maystro' && (
            <div className="space-y-1.5">
              <label htmlFor="maystro_api_key" className="text-xs font-bold text-slate-700">Maystro API Key</label>
              <input
                id="maystro_api_key"
                name="maystro_api_key"
                type="password"
                dir="ltr"
                defaultValue={currentConfig.maystro_api_key || ''}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
              />
            </div>
          )}

          {courier === 'noest' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="noest_api_token" className="text-xs font-bold text-slate-700">Noest API Token</label>
                <input
                  id="noest_api_token"
                  name="noest_api_token"
                  type="password"
                  dir="ltr"
                  defaultValue={currentConfig.noest_api_token || ''}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="noest_guid" className="text-xs font-bold text-slate-700">Noest GUID</label>
                <input
                  id="noest_guid"
                  name="noest_guid"
                  dir="ltr"
                  defaultValue={currentConfig.noest_guid || ''}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                />
              </div>
            </div>
          )}

          {courier === 'ecotrack' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="ecotrack_token" className="text-xs font-bold text-slate-700">Ecotrack Token</label>
                <input
                  id="ecotrack_token"
                  name="ecotrack_token"
                  type="password"
                  dir="ltr"
                  defaultValue={currentConfig.ecotrack_token || ''}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ecotrack_base_url" className="text-xs font-bold text-slate-700">Ecotrack Platform URL</label>
                <input
                  id="ecotrack_base_url"
                  name="ecotrack_base_url"
                  dir="ltr"
                  defaultValue={currentConfig.ecotrack_base_url || ''}
                  placeholder="https://yourstore.ecotrack.dz"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <SaveButton />
    </form>
  );
}
