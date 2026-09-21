import React from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Smartphone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, openHelp } = useShop();

  return (
    <footer id="site-footer" className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      {/* Trust Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Delivery</h4>
              <p className="text-[11px] text-slate-400">Nairobi Same-Day & Countrywide</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Genuine</h4>
              <p className="text-[11px] text-slate-400">Official Brand Warranties</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">7-Day Returns</h4>
              <p className="text-[11px] text-slate-400">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">M-Pesa Verified</h4>
              <p className="text-[11px] text-slate-400">Instant Lipa Na M-Pesa Checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 5-Column Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: About NewEra */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm">
                NE
              </div>
              <span className="font-heading font-extrabold text-lg text-white tracking-tight">
                NEWERA SHOP
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kenya’s premier modern tech marketplace. Engineered for speed, authenticity, and peace of mind with verified electronics, smartphones, laptops, and sound systems.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-white transition-colors cursor-pointer">
                <Facebook className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-white transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-white transition-colors cursor-pointer">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-white transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Col 2: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/help')} className="hover:text-cyan-400 transition-colors">
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-cyan-400 transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/orders')} className="hover:text-cyan-400 transition-colors">
                  Track My Order
                </button>
              </li>
              <li>
                <button onClick={() => openHelp('return')} className="hover:text-cyan-400 transition-colors">
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button onClick={() => openHelp('warranty')} className="hover:text-cyan-400 transition-colors">
                  Warranty Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-cyan-400 transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/categories')} className="hover:text-cyan-400 transition-colors">
                  Category Directory
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop?deal=flash')} className="hover:text-cyan-400 transition-colors">
                  Flash Tech Deals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop?sort=newest')} className="hover:text-cyan-400 transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop?sort=rating')} className="hover:text-cyan-400 transition-colors">
                  Best Rated Electronics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Information & Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/help')} className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/help')} className="hover:text-cyan-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/help')} className="hover:text-cyan-400 transition-colors">
                  Delivery Information
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/help')} className="hover:text-cyan-400 transition-colors">
                  Lipa na M-Pesa & Card Payment
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="hover:text-cyan-400 transition-colors text-slate-500">
                  Admin System Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Direct */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <a
                href="tel:+254705629522"
                className="flex items-start gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
              >
                <Phone className="w-4 h-4 shrink-0 mt-0.5" />
                <span>+254 705 629 522</span>
              </a>

              <a
                href="mailto:support@newerashop.co.ke"
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                <span>support@newerashop.co.ke</span>
              </a>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                <span>Nairobi Central Business District, Kenya</span>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                <span>Mon – Sat: 8:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Logos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} NewEra Shop Kenya. All rights reserved. Stage 1 Architectural Foundation.
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-slate-400">Secure Payments:</span>
          <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
            Lipa Na M-Pesa
          </span>
          <span className="bg-slate-900 border border-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded text-[10px]">
            Visa
          </span>
          <span className="bg-slate-900 border border-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded text-[10px]">
            Mastercard
          </span>
          <span className="bg-slate-900 border border-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded text-[10px]">
            Cash on Delivery
          </span>
        </div>
      </div>
    </footer>
  );
};
