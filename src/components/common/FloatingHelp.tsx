import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import { inquiryService } from '../../services/inquiryService.ts';
import {
  MessageSquare,
  X,
  Phone,
  Truck,
  RotateCcw,
  CreditCard,
  Send,
  CheckCircle2,
  Package,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const FloatingHelp: React.FC = () => {
  const { isHelpOpen, openHelp, closeHelp, navigate, user, showToast } = useShop();
  const [selectedTopic, setSelectedTopic] = useState<'menu' | 'form' | 'success'>('menu');
  const [inquiryCategory, setInquiryCategory] = useState<
    'order' | 'delivery' | 'payment' | 'return' | 'product' | 'general'
  >('general');
  const [fullName, setFullName] = useState(user ? user.fullName : '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectAction = (type: string) => {
    if (type === 'track') {
      closeHelp();
      navigate('/orders');
      return;
    }
    if (type === 'whatsapp') {
      window.open(
        'https://wa.me/254705629522?text=Hello%20NewEra%20Shop%20Support,%20I%20need%20assistance',
        '_blank'
      );
      return;
    }
    if (type === 'call') {
      window.location.href = 'tel:+254705629522';
      return;
    }

    // Set topic for form
    setInquiryCategory(type as any);
    setSelectedTopic('form');
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !message) {
      showToast({
        type: 'warning',
        title: 'Missing information',
        message: 'Please provide your name, phone number, and inquiry message.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await inquiryService.submitInquiry({
        fullName,
        email: email || `${phone.replace(/\D/g, '')}@guest.newerashop.co.ke`,
        phone,
        subject: `Assistance with ${inquiryCategory}`,
        category: inquiryCategory,
        orderNumber: orderNumber || undefined,
        message,
      });

      if (res.success) {
        setSelectedTopic('success');
        showToast({
          type: 'success',
          title: 'Inquiry Received',
          message: 'Our Nairobi support desk will get back to you shortly.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Please reach us directly at +254 705 629 522.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        id="floating-need-help-btn"
        onClick={() => (isHelpOpen ? closeHelp() : openHelp())}
        aria-label="Need Help Customer Support"
        className="fixed bottom-6 left-6 z-40 bg-slate-950 hover:bg-cyan-600 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 border border-cyan-500/30 group"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950"></span>
        </div>
        <span className="font-bold text-xs tracking-tight">Need Help?</span>
      </button>

      {/* Support Drawer / Popup */}
      {isHelpOpen && (
        <div
          id="help-drawer-overlay"
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-end sm:items-center justify-start p-4 sm:p-6"
        >
          <div
            id="help-drawer-content"
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300"
          >
            {/* Header */}
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-none">NewEra Support Center</h3>
                  <p className="text-[11px] text-cyan-400 mt-1">Direct Line: +254 705 629 522</p>
                </div>
              </div>
              <button
                id="close-help-drawer-btn"
                onClick={closeHelp}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto">
              {selectedTopic === 'menu' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    How can our customer care desk assist you today? Select an option or contact us directly.
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      id="help-action-track"
                      onClick={() => handleSelectAction('track')}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-slate-50 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-600">
                          Track My Order
                        </div>
                        <div className="text-[11px] text-slate-500">Live order status and dispatch updates</div>
                      </div>
                    </button>

                    <button
                      id="help-action-shopping"
                      onClick={() => handleSelectAction('product')}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-slate-50 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-600">
                          Shopping Assistance & Product Advice
                        </div>
                        <div className="text-[11px] text-slate-500">Specs, compatibility, and recommendations</div>
                      </div>
                    </button>

                    <button
                      id="help-action-payment"
                      onClick={() => handleSelectAction('payment')}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-slate-50 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-600">
                          Payment Inquiry (M-Pesa / Card)
                        </div>
                        <div className="text-[11px] text-slate-500">Confirm payment receipt or invoice</div>
                      </div>
                    </button>

                    <button
                      id="help-action-delivery"
                      onClick={() => handleSelectAction('delivery')}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-slate-50 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-600">
                          Delivery Inquiry
                        </div>
                        <div className="text-[11px] text-slate-500">Nairobi same-day and countrywide courier</div>
                      </div>
                    </button>

                    <button
                      id="help-action-return"
                      onClick={() => handleSelectAction('return')}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-slate-50 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-600">
                          Return / Refund / Warranty
                        </div>
                        <div className="text-[11px] text-slate-500">7-day replacement & brand warranty claims</div>
                      </div>
                    </button>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                    <button
                      id="help-call-btn"
                      onClick={() => handleSelectAction('call')}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Call Now</span>
                    </button>
                    <button
                      id="help-whatsapp-btn"
                      onClick={() => handleSelectAction('whatsapp')}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>WhatsApp Us</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedTopic === 'form' && (
                <form onSubmit={handleSubmitInquiry} className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                      Inquiry: {inquiryCategory}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedTopic('menu')}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Back to options
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kelvin Anunda"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Order # (Optional)
                      </label>
                      <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="NEW-2026-XXXX"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Message / Question *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your inquiry or order query..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-slate-950 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {selectedTopic === 'success' && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Inquiry Logged Successfully</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Thank you! Our customer care representative will contact you via {phone} or WhatsApp within 15–30 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTopic('menu');
                      closeHelp();
                    }}
                    className="mt-2 px-4 py-2 bg-slate-950 text-white rounded-lg text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
