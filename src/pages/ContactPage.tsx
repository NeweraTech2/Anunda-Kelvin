import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { inquiryService } from '../services/inquiryService.ts';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { user, showToast } = useShop();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !message) {
      showToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please provide your name, phone, and message.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await inquiryService.submitInquiry({
        fullName,
        email: email || `${phone.replace(/\D/g, '')}@guest.newerashop.co.ke`,
        phone,
        subject: subject || 'General Contact Inquiry',
        category: 'general',
        message,
      });

      setSubmitted(true);
      showToast({
        type: 'success',
        title: 'Message Dispatched',
        message: 'Our Nairobi support team will respond promptly.',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Submission Error',
        message: 'Please call us directly at +254 705 629 522.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page" className="bg-[#F8F9FA] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-950">Contact NewEra Shop</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Get in touch with Kenya’s modern electronics marketplace team. We are here to assist with inquiries, corporate tenders, and order tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
                Direct Channels
              </h2>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Phone & WhatsApp Support</span>
                  <a href="tel:+254705629522" className="text-cyan-700 font-semibold hover:underline">
                    +254 705 629 522
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">Instant customer assistance</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Official Support Email</span>
                  <a href="mailto:support@newerashop.co.ke" className="text-slate-600 hover:text-slate-900">
                    support@newerashop.co.ke
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">Response within 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Fulfillment Center</span>
                  <p className="text-slate-600">Nairobi Central Business District, Kenya</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Same-day collection & dispatch</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Operational Hours</span>
                  <p className="text-slate-600">Monday – Saturday: 8:00 AM – 8:00 PM</p>
                  <p className="text-slate-600">Sunday: 10:00 AM – 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you, {fullName}. Our Nairobi technical customer desk has received your message and will reach out to you via {phone}.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-base font-bold text-slate-950">Send Us an Inquiry</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Kelvin Anunda"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number (Mobile) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject / Topic
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Bulk laptop quotation / Warranty query"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you need assistance with..."
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-3 px-6 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
