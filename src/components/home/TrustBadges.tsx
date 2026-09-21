import React from 'react';
import { Truck, ShieldCheck, PhoneCall, RotateCcw, Smartphone } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <section id="trust-badges-section" className="py-8 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Nairobi Same-Day</h4>
              <p className="text-[10px] text-slate-500">Order by 2PM for express drop</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Genuine</h4>
              <p className="text-[10px] text-slate-500">Official brand warranties</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">7-Day Returns</h4>
              <p className="text-[10px] text-slate-500">Direct replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Lipa na M-Pesa</h4>
              <p className="text-[10px] text-slate-500">Instant safe mobile checkout</p>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">+254 705 629 522</h4>
              <p className="text-[10px] text-slate-500">Support 8am–8pm daily</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
