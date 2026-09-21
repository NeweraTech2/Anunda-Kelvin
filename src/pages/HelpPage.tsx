import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import {
  HelpCircle,
  Phone,
  Truck,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  ChevronDown,
  Search,
  MessageSquare,
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'delivery' | 'payment' | 'warranty' | 'returns';
}

const FAQS: FaqItem[] = [
  {
    category: 'delivery',
    q: 'How fast is delivery within Nairobi?',
    a: 'Orders placed before 2:00 PM are dispatched for same-day delivery across Nairobi County (CBD, Westlands, Kilimani, Karen, Kasarani, Eastlands, etc.). Flat delivery rate is KSh 350, and free for orders above KSh 50,000.',
  },
  {
    category: 'delivery',
    q: 'Do you deliver to Mombasa, Kisumu, Nakuru, and other counties?',
    a: 'Yes! We deliver across all 47 Kenyan counties via insured courier partners (Fargo Courier, G4S, and Wells Fargo). Delivery to major towns takes 24 hours, and upcountry areas take 24–48 hours.',
  },
  {
    category: 'payment',
    q: 'How do I pay with Lipa na M-Pesa?',
    a: 'At checkout, select "Lipa Na M-Pesa" and confirm your Kenyan mobile number. An instant STK push notification will appear on your phone asking you to enter your M-Pesa PIN. Once entered, payment is confirmed in real-time.',
  },
  {
    category: 'payment',
    q: 'Can I pay Cash on Delivery?',
    a: 'Cash on delivery is supported for orders delivered within Nairobi County for items under KSh 50,000. For high-value electronics and upcountry parcels, payments must be processed via M-Pesa or Card prior to courier dispatch.',
  },
  {
    category: 'warranty',
    q: 'Are your products 100% genuine with official warranties?',
    a: 'Every electronic device sold on NewEra Shop is 100% genuine and comes with authorized manufacturer warranty (Apple 1-Year, Samsung 24-Month, Sony 1-Year, Dell 2-Year). You can verify the serial number directly on official manufacturer portals.',
  },
  {
    category: 'returns',
    q: 'What is your return and replacement policy?',
    a: 'We offer a 7-day hassle-free return and replacement policy for manufacturer defects or transit damage. Simply contact our support desk at +254 705 629 522 with your order number and original packaging.',
  },
];

export const HelpPage: React.FC = () => {
  const { openHelp } = useShop();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((f) => {
    const matchesCat = filterCategory === 'all' || f.category === filterCategory;
    const matchesSearch =
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="help-faq-page" className="bg-[#F8F9FA] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
            <span>Support & Knowledge Base</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950">How Can We Help You?</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Find quick answers regarding delivery across Kenya, Lipa na M-Pesa payments, and manufacturer warranties.
          </p>

          {/* Search FAQs */}
          <div className="relative max-w-lg mx-auto pt-2">
            <input
              type="text"
              placeholder="Search help topics (e.g. M-Pesa, delivery time, returns)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:border-cyan-500 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5 pointer-events-none" />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterCategory === 'all'
                ? 'bg-slate-950 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Questions
          </button>
          <button
            onClick={() => setFilterCategory('delivery')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              filterCategory === 'delivery'
                ? 'bg-slate-950 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-cyan-600" />
            <span>Delivery</span>
          </button>
          <button
            onClick={() => setFilterCategory('payment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              filterCategory === 'payment'
                ? 'bg-slate-950 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span>Payments</span>
          </button>
          <button
            onClick={() => setFilterCategory('warranty')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              filterCategory === 'warranty'
                ? 'bg-slate-950 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Warranty</span>
          </button>
          <button
            onClick={() => setFilterCategory('returns')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              filterCategory === 'returns'
                ? 'bg-slate-950 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Returns</span>
          </button>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
          {filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-100 rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 font-bold text-xs text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    openIndex === idx ? 'rotate-180 text-cyan-600' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-50 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Assistance Banner */}
        <div className="p-6 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold">Still have questions?</h3>
            <p className="text-xs text-slate-400">Our customer care desk in Nairobi is available 8:00 AM – 8:00 PM.</p>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:+254705629522"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>+254 705 629 522</span>
            </a>
            <button
              onClick={() => openHelp()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open Support Drawer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
