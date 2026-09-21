import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { productService } from '../services/productService.ts';
import { Product } from '../types/index.ts';
import { HeroBanner } from '../components/home/HeroBanner.tsx';
import { CategoryBar } from '../components/home/CategoryBar.tsx';
import { FlashDeals } from '../components/home/FlashDeals.tsx';
import { PromotionalBanners } from '../components/home/PromotionalBanners.tsx';
import { TrustBadges } from '../components/home/TrustBadges.tsx';
import { ProductCard } from '../components/common/ProductCard.tsx';
import { ArrowRight, Sparkles, TrendingUp, Award, HelpCircle, Phone } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, openHelp } = useShop();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [feat, news, best] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getNewArrivals(),
          productService.getBestSellers(),
        ]);
        setFeaturedProducts(feat);
        setNewArrivals(news);
        setBestSellers(best);
      } catch (e) {
        console.error('Error loading homepage product feeds:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div id="homepage-container" className="space-y-0">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Trust Strip */}
      <TrustBadges />

      {/* 3. Categories Bar */}
      <CategoryBar />

      {/* 4. Flash Deals Section */}
      <FlashDeals />

      {/* 5. Featured Products Grid (Section 9) */}
      <section id="featured-products-section" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hand-Picked Tech</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 mt-1">
                Featured Products
              </h2>
            </div>

            <button
              id="view-all-featured-btn"
              onClick={() => navigate('/shop')}
              className="text-xs font-bold text-slate-700 hover:text-cyan-600 flex items-center gap-1 group transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Promotional Campaign Banners (Section 12) */}
      <PromotionalBanners />

      {/* 7. New Arrivals (Section 10) */}
      <section id="new-arrivals-section" className="py-12 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Latest Catalog Additions</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 mt-1">
                New Arrivals
              </h2>
            </div>

            <button
              id="view-all-new-btn"
              onClick={() => navigate('/shop?sort=newest')}
              className="text-xs font-bold text-slate-700 hover:text-cyan-600 flex items-center gap-1 group transition-colors"
            >
              <span>View Latest</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. Best Sellers (Section 11) */}
      <section id="best-sellers-section" className="py-12 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
                <Award className="w-3.5 h-3.5" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 mt-1">
                Top Rated & Best Sellers
              </h2>
            </div>

            <button
              id="view-all-bestsellers-btn"
              onClick={() => navigate('/shop?sort=rating')}
              className="text-xs font-bold text-slate-700 hover:text-cyan-600 flex items-center gap-1 group transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-200 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 9. Customer Support Callout Box */}
      <section id="support-callout-section" className="py-12 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950 border border-slate-800 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Kenya Dedicated Tech Support
              </span>
              <h3 className="text-2xl font-bold text-white">
                Have questions before ordering?
              </h3>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                Our Nairobi team assists with product specifications, compatibility checks, M-Pesa payments, and corporate orders.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href="tel:+254705629522"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+254 705 629 522</span>
              </a>
              <button
                onClick={() => openHelp()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Open Help Desk</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
