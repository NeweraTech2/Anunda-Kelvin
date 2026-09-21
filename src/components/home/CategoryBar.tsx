import React from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import { INITIAL_CATEGORIES } from '../../data/mockData.ts';
import {
  Smartphone,
  Laptop,
  Headphones,
  Tv,
  Watch,
  BatteryCharging,
  Cpu,
  Wifi,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-5 h-5" />,
  Laptop: <Laptop className="w-5 h-5" />,
  Headphones: <Headphones className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
  Watch: <Watch className="w-5 h-5" />,
  BatteryCharging: <BatteryCharging className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Wifi: <Wifi className="w-5 h-5" />,
};

export const CategoryBar: React.FC = () => {
  const { navigate } = useShop();

  return (
    <section id="category-section" className="py-12 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
              Explore Catalog
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 mt-1">
              Shop by Category
            </h2>
          </div>

          <button
            id="view-all-categories-btn"
            onClick={() => navigate('/categories')}
            className="text-xs font-bold text-slate-700 hover:text-cyan-600 flex items-center gap-1 group transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {INITIAL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              id={`cat-card-${cat.slug}`}
              onClick={() => navigate(`/shop?category=${cat.slug}`)}
              className="group flex flex-col items-center text-center p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer select-none"
            >
              {/* Image Circle with Icon */}
              <div className="relative w-14 h-14 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-cyan-600 group-hover:border-cyan-500/30 group-hover:scale-110 transition-all duration-300 mb-2.5 overflow-hidden">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                />
                <div className="relative z-10">
                  {ICON_MAP[cat.iconName] || <Cpu className="w-5 h-5" />}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors leading-snug line-clamp-2">
                {cat.name}
              </h3>

              {/* Product Count */}
              <span className="text-[10px] text-slate-400 mt-1 font-medium">
                {cat.productCount}+ items
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
