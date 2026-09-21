import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import { ArrowRight, Sparkles, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';

interface Slide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageUrl: string;
  bgGradient: string;
  accentColor: string;
  priceNote?: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    badge: 'NEWERA FLAGSHIP LAUNCH',
    title: 'Shop Smarter. Live Better.',
    subtitle: 'Next-Gen Smartphones & M3 MacBooks',
    description: 'Empower your world with industry-leading electronics, verified warranties, and guaranteed same-day dispatch across Nairobi.',
    primaryCtaText: 'Shop Flash Deals',
    primaryCtaLink: '/shop?deal=flash',
    secondaryCtaText: 'Explore Categories',
    secondaryCtaLink: '/categories',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop',
    bgGradient: 'from-slate-950 via-slate-900 to-indigo-950',
    accentColor: '#38BDF8',
    priceNote: 'Starting from KSh 38,999 with 0% interest terms',
  },
  {
    id: 'slide-2',
    badge: 'STUDIO SOUND EVENT',
    title: 'Acoustic Precision. Pure Immersion.',
    subtitle: 'Sony XM5 & Hi-Fi Wireless Gear',
    description: 'Hear every nuance with industry-best noise cancellation and dual-driver engineering. Official manufacturer warranty included.',
    primaryCtaText: 'Discover Audio',
    primaryCtaLink: '/shop?category=audio-sound',
    secondaryCtaText: 'View All Products',
    secondaryCtaLink: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    bgGradient: 'from-slate-950 via-slate-900 to-cyan-950',
    accentColor: '#06B6D4',
    priceNote: 'Up to 25% Off Sony, JBL & Samsung',
  },
  {
    id: 'slide-3',
    badge: 'POWER & PRODUCTIVITY',
    title: 'Performance Without Limits.',
    subtitle: 'Core Ultra 9 Laptops & 140W GaN Charging',
    description: 'Engineered for developers, designers, and creators in East Africa. Built with aerospace-grade durability and high-capacity batteries.',
    primaryCtaText: 'Shop Computing',
    primaryCtaLink: '/shop?category=computers-laptops',
    secondaryCtaText: 'Powerbanks & GaN',
    secondaryCtaLink: '/shop?category=power-charging',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
    bgGradient: 'from-slate-950 via-slate-900 to-slate-900',
    accentColor: '#F59E0B',
    priceNote: 'Free insured shipping across all 47 counties',
  },
];

export const HeroBanner: React.FC = () => {
  const { navigate } = useShop();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <section id="hero-section" className="relative overflow-hidden bg-slate-950 text-white select-none">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} transition-colors duration-1000 opacity-95`} />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Radial Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{slide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-semibold text-cyan-300">
              {slide.subtitle}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                id="hero-primary-cta"
                onClick={() => navigate(slide.primaryCtaLink)}
                className="w-full sm:w-auto px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 group active:scale-98"
              >
                <span>{slide.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => navigate(slide.secondaryCtaLink)}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-2"
              >
                <span>{slide.secondaryCtaText}</span>
              </button>
            </div>

            {/* Trust and Price Note */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              {slide.priceNote && (
                <span className="text-amber-400 font-semibold bg-amber-950/40 border border-amber-500/20 px-2.5 py-1 rounded-md">
                  {slide.priceNote}
                </span>
              )}
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Genuine Kenyan Warranty
              </span>
            </div>
          </div>

          {/* Product Image Stage (Engineered for cinematic depth and future 3D canvas) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Visual Pedestal */}
            <div className="relative w-full max-w-md aspect-4/3 sm:aspect-square rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-6 flex items-center justify-center backdrop-blur-md shadow-2xl group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 opacity-70" />

              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="relative z-10 w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating specs pill */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Fast Shipping</p>
                  <p className="text-xs font-semibold text-white">Nairobi CBD: Same Day</p>
                </div>
                <button
                  onClick={() => navigate(slide.primaryCtaLink)}
                  className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-900/60 mt-8">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, index) => (
              <button
                key={s.id}
                id={`hero-dot-${index}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 transition-all duration-300 rounded-full ${
                  activeSlide === index ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="hero-prev-btn"
              onClick={() => setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
              aria-label="Previous slide"
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="hero-next-btn"
              onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              aria-label="Next slide"
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
