import React from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import { ArrowRight, Sparkles, Laptop, Headphones } from 'lucide-react';

export const PromotionalBanners: React.FC = () => {
  const { navigate } = useShop();

  return (
    <section id="promotional-banners-section" className="py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Laptops & Workstations */}
          <div
            id="promo-banner-computing"
            onClick={() => navigate('/shop?category=computers-laptops')}
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between shadow-lg cursor-pointer border border-slate-800 transition-all duration-300 hover:shadow-2xl"
          >
            {/* Background image preview with overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 group-hover:opacity-35 transition-opacity overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="relative z-10 space-y-2.5 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-[11px] font-bold uppercase tracking-wider border border-cyan-500/30">
                <Laptop className="w-3.5 h-3.5" />
                <span>Next-Gen Workstations</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white leading-tight">
                MacBook M3 & Dell XPS Ultra
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Engineered for maximum speed, 4K OLED clarity, and seamless all-day workflows. Backed by 2-year authorized warranties.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <button
                id="promo-shop-computing-btn"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>Shop Laptops</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Banner 2: Premium Audio */}
          <div
            id="promo-banner-audio"
            onClick={() => navigate('/shop?category=audio-sound')}
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white p-6 sm:p-8 flex flex-col justify-between shadow-lg cursor-pointer border border-slate-800 transition-all duration-300 hover:shadow-2xl"
          >
            {/* Background image preview with overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 group-hover:opacity-35 transition-opacity overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="relative z-10 space-y-2.5 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-500/30">
                <Headphones className="w-3.5 h-3.5" />
                <span>Audiophile Gear</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white leading-tight">
                Studio Sound & Active Noise Cancellation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Sony XM5, Galaxy Buds3 Pro & JBL 240W PartyBoxes. Hear sound the way artists produced it.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <button
                id="promo-shop-audio-btn"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>Explore Audio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
