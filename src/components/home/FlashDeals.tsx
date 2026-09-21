import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import { productService } from '../../services/productService.ts';
import { Product } from '../../types/index.ts';
import { ProductCard } from '../common/ProductCard.tsx';
import { calculateTimeRemaining } from '../../lib/utils.ts';
import { Zap, Clock, ArrowRight } from 'lucide-react';

export const FlashDeals: React.FC = () => {
  const { navigate } = useShop();
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Default target date: 18 hours from now
  const [targetIso] = useState<string>(() => {
    return new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString();
  });

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(targetIso));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetIso));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetIso]);

  useEffect(() => {
    productService.getFlashDeals().then((items) => {
      setDeals(items);
      setLoading(false);
    });
  }, []);

  return (
    <section id="flash-deals-section" className="py-12 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flash Deals Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  FLASH DEALS
                </h2>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
                  UP TO 27% OFF
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Limited quantity promotions ending soon. Guaranteed genuine stock.
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1 text-xs text-slate-300 mr-1">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-semibold">Ends In:</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono">
              <div className="bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1 text-center min-w-[36px]">
                <span className="text-sm font-bold text-amber-400">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-sans">Hrs</span>
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className="bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1 text-center min-w-[36px]">
                <span className="text-sm font-bold text-amber-400">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-sans">Min</span>
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className="bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1 text-center min-w-[36px]">
                <span className="text-sm font-bold text-amber-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-sans">Sec</span>
              </div>
            </div>

            <button
              id="view-all-deals-btn"
              onClick={() => navigate('/shop?deal=flash')}
              className="ml-3 hidden md:flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Deals Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl h-80 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {deals.map((deal) => (
              <ProductCard key={deal.id} product={deal} showStockBar={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
