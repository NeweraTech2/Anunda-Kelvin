import React, { useState } from 'react';
import { StoreSettings } from '../../types/index.ts';
import {
  Settings,
  Save,
  Truck,
  DollarSign,
  AlertTriangle,
  Building,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react';

interface AdminSettingsTabProps {
  settings: StoreSettings;
  onSaveSettings: (settings: Partial<StoreSettings>) => Promise<void>;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await onSaveSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl text-xs">
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-bold">Store configurations successfully synchronized.</span>
        </div>
      )}

      {/* 1. Store Identity & Contact */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Building className="w-4 h-4 text-cyan-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Store Identity & Headquarters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Business Name</label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Official Currency Code</label>
            <input
              type="text"
              required
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Support Phone / WhatsApp</label>
            <input
              type="text"
              required
              value={formData.storePhone}
              onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
            <input
              type="email"
              required
              value={formData.storeEmail}
              onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Physical Dispatch Address</label>
            <input
              type="text"
              required
              value={formData.storeAddress}
              onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 2. Shipping & Delivery Rates */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Truck className="w-4 h-4 text-cyan-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Kenya Courier Shipping Tariffs
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nairobi Standard Delivery (KSh)
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.nairobiStandardDelivery}
              onChange={(e) =>
                setFormData({ ...formData, nairobiStandardDelivery: Number(e.target.value) })
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl font-bold focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nairobi Express 3-Hour Delivery (KSh)
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.nairobiExpressDelivery}
              onChange={(e) =>
                setFormData({ ...formData, nairobiExpressDelivery: Number(e.target.value) })
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl font-bold focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Upcountry Kenya Delivery (KSh)
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.upcountryDelivery}
              onChange={(e) =>
                setFormData({ ...formData, upcountryDelivery: Number(e.target.value) })
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl font-bold focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block font-semibold text-slate-700 mb-1">
              Free Delivery Order Threshold (KSh)
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.freeDeliveryThreshold}
              onChange={(e) =>
                setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl font-bold focus:border-cyan-500 focus:outline-hidden"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Orders equal to or above this subtotal enjoy 100% free delivery across Nairobi.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Inventory & Payment Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <AlertTriangle className="w-4 h-4 text-cyan-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Stock Guards & Payment Channels
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Low Stock Warning Threshold (units)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.lowStockThreshold}
              onChange={(e) =>
                setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })
              }
              className="w-full max-w-xs p-2.5 border border-slate-200 rounded-xl font-bold focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowMpesa}
                onChange={(e) => setFormData({ ...formData, allowMpesa: e.target.checked })}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span className="font-semibold text-slate-800">Enable Lipa Na M-PESA</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowCashOnDelivery}
                onChange={(e) =>
                  setFormData({ ...formData, allowCashOnDelivery: e.target.checked })
                }
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span className="font-semibold text-slate-800">Enable Cash on Delivery (COD)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowCard}
                onChange={(e) => setFormData({ ...formData, allowCard: e.target.checked })}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span className="font-semibold text-slate-800">Enable Credit / Debit Cards</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-slate-950 hover:bg-cyan-600 text-white font-extrabold rounded-xl transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating Settings...' : 'Save Settings'}</span>
        </button>
      </div>
    </form>
  );
};
