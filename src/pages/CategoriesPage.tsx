import React from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { INITIAL_CATEGORIES } from '../data/mockData.ts';
import { Category } from '../types/index.ts';
import { ArrowRight, Layers, Smartphone, Laptop, Headphones, Tv, Watch, BatteryCharging, Cpu, Wifi } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6" />,
  Laptop: <Laptop className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Tv: <Tv className="w-6 h-6" />,
  Watch: <Watch className="w-6 h-6" />,
  BatteryCharging: <BatteryCharging className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Wifi: <Wifi className="w-6 h-6" />,
};

export const CategoriesPage: React.FC = () => {
  const { navigate } = useShop();

  return (
    <div id="categories-page" className="min-h-screen bg-[#F8F9FA] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 mb-8 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Product Department</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950">Browse All Categories</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Explore authentic tech collections across phones, computing, sound systems, electronics, and smart IoT devices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_CATEGORIES.map((cat: Category) => (
            <div
              key={cat.id}
              id={`category-directory-card-${cat.slug}`}
              onClick={() => navigate(`/shop?category=${cat.slug}`)}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/90 backdrop-blur-xs flex items-center justify-center text-white">
                    {ICON_MAP[cat.iconName] || <Cpu className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-bold tracking-tight text-white/90">
                    {cat.productCount}+ Products
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600 group-hover:text-cyan-700">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
