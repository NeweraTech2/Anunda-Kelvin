import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import { authService } from '../../services/authService.ts';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess }) => {
  const { login, navigate, showToast } = useShop();
  const [email, setEmail] = useState('admin@newerashop.co.ke');
  const [password, setPassword] = useState('Admin@2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Authenticate with admin credentials
      await login(email.trim(), password);
      showToast({
        type: 'success',
        title: 'Admin Session Authenticated',
        message: 'Welcome to the NewEra Business Management Portal.',
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Access restricted.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      await authService.resetPassword(email);
      setResetSent(true);
      showToast({
        type: 'info',
        title: 'Recovery Email Sent',
        message: 'Instructions have been dispatched to your authorized inbox.',
      });
    } catch (err: any) {
      setError(err.message || 'Password reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle tech background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 relative z-10 shadow-2xl shadow-cyan-950/40">
        {/* Brand header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-cyan-500/20 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            NewEra <span className="text-cyan-400">Admin Portal</span>
          </h1>
          <p className="text-xs text-slate-400">
            Authorized management and executive business controls
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {resetSent ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-700/80 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Recovery Instructions Sent</h3>
            <p className="text-xs text-slate-400">
              We have forwarded password recovery guidelines to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setShowForgot(false);
              }}
              className="text-xs font-bold text-cyan-400 hover:underline"
            >
              Return to Login
            </button>
          </div>
        ) : showForgot ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs focus:border-cyan-500 focus:outline-hidden"
                  placeholder="admin@newerashop.co.ke"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Sending Instructions...' : 'Send Password Reset'}
            </button>

            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel and return to sign in
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Quick Demo Pre-fill helper banner */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                <span>Demo Super Admin Mode</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@newerashop.co.ke');
                  setPassword('Admin@2026!');
                }}
                className="text-cyan-400 font-bold hover:underline"
              >
                Autofill
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Authenticate & Enter Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-300 py-1"
            >
              ← Back to Customer Storefront
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
