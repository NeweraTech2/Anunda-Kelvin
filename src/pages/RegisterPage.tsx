import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, navigate, showToast } = useShop();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast({
        type: 'warning',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, phone, password);
      showToast({
        type: 'success',
        title: 'Account Created!',
        message: `Welcome to NewEra Shop, ${fullName}!`,
      });
      navigate('/account');
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Registration Failed',
        message: err.message || 'Please check your information and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-page-view" className="min-h-[80vh] bg-[#F8F9FA] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 max-w-md w-full shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-white mx-auto shadow-md">
            <span className="font-heading font-black text-xl text-cyan-400">N</span>
            <span className="font-heading font-bold text-sm text-white">E</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950">Create an Account</h1>
          <p className="text-xs text-slate-500">
            Join thousands of shoppers enjoying verified electronics with Kenyan warranty
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Kelvin Anunda"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-cyan-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-cyan-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number (For M-Pesa & SMS Updates) *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-cyan-500"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password * (Min 6 characters)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-cyan-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="register-submit-btn"
            className="w-full py-3 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already have an account? </span>
          <button
            onClick={() => navigate('/login')}
            className="font-bold text-cyan-700 hover:underline"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
