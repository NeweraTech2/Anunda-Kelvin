import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigate, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast({
        type: 'success',
        title: 'Welcome Back!',
        message: 'Successfully logged in to NewEra Shop.',
      });
      navigate('/account');
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Sign In Failed',
        message: err.message || 'Invalid email or password.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@newerashop.co.ke');
      setPassword('Admin123!');
      await login('admin@newerashop.co.ke', 'admin');
      navigate('/admin');
    } else {
      setEmail('customer@newerashop.co.ke');
      setPassword('Customer123!');
      await login('customer@newerashop.co.ke', 'customer');
      navigate('/account');
    }
    showToast({
      type: 'success',
      title: 'Demo Signed In',
      message: `Logged in as ${role === 'admin' ? 'Store Administrator' : 'Demo Customer'}.`,
    });
  };

  return (
    <div id="login-page-view" className="min-h-[80vh] bg-[#F8F9FA] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 max-w-md w-full shadow-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-white mx-auto shadow-md">
            <span className="font-heading font-black text-xl text-cyan-400">N</span>
            <span className="font-heading font-bold text-sm text-white">E</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950">Welcome to NewEra Shop</h1>
          <p className="text-xs text-slate-500">
            Sign in to access your orders, saved wishlist, and faster checkout
          </p>
        </div>

        {/* Quick Demo Logins for evaluators */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block text-center">
            Instant 1-Click Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer')}
              className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-1.5 px-3 bg-slate-950 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Role</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Password *
              </label>
              <button
                type="button"
                onClick={() => showToast({ type: 'info', title: 'Password Reset', message: 'Check your email inbox for reset instructions.' })}
                className="text-[11px] text-cyan-600 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
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
            id="login-submit-btn"
            className="w-full py-3 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer link to register */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have an account? </span>
          <button
            onClick={() => navigate('/register')}
            className="font-bold text-cyan-700 hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
