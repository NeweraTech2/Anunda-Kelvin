import React from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            id={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-slate-900/95 text-white border-cyan-500/30 shadow-cyan-950/20'
                : isError
                ? 'bg-red-900/95 text-white border-red-500/30 shadow-red-950/20'
                : isWarning
                ? 'bg-amber-900/95 text-white border-amber-500/30'
                : 'bg-slate-900/95 text-white border-slate-700/50'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{toast.message}</p>
              )}
            </div>
            <button
              id={`close-${toast.id}`}
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
