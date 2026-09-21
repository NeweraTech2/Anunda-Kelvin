import React, { useState } from 'react';
import { Promotion, Coupon } from '../../types/index.ts';
import { formatKSh } from '../../lib/utils.ts';
import {
  Tag,
  Plus,
  Percent,
  Check,
  X,
  Trash2,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AdminPromotionsTabProps {
  promotions: Promotion[];
  coupons: Coupon[];
  onCreatePromotion: (promo: Partial<Promotion> & { title: string }) => Promise<void>;
  onDeletePromotion: (id: string) => Promise<void>;
  onCreateCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => Promise<void>;
  onToggleCoupon: (id: string, active: boolean) => Promise<void>;
}

export const AdminPromotionsTab: React.FC<AdminPromotionsTabProps> = ({
  promotions,
  coupons,
  onCreatePromotion,
  onDeletePromotion,
  onCreateCoupon,
  onToggleCoupon,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'coupons' | 'campaigns'>('coupons');

  // Coupon modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(5000);
  const [maxDiscount, setMaxDiscount] = useState<number>(2000);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Campaign modal
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignSubtitle, setCampaignSubtitle] = useState('');
  const [campaignBadge, setCampaignBadge] = useState('Hot Deal');
  const [campaignImage, setCampaignImage] = useState('https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200');

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    try {
      await onCreateCoupon({
        code: code.trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue),
        maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
        usageLimit: Number(usageLimit),
        active: true,
      });
      setShowCouponModal(false);
      setCode('');
    } catch (err: any) {
      setCouponError(err.message || 'Failed to create coupon');
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle.trim()) return;

    await onCreatePromotion({
      title: campaignTitle.trim(),
      subtitle: campaignSubtitle.trim() || 'Exclusive Deal',
      badge: campaignBadge.trim(),
      imageUrl: campaignImage.trim(),
      active: true,
    });
    setShowCampaignModal(false);
    setCampaignTitle('');
    setCampaignSubtitle('');
  };

  return (
    <div className="space-y-4">
      {/* Top Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === 'coupons'
                ? 'bg-slate-950 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Discount Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveSubTab('campaigns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === 'campaigns'
                ? 'bg-slate-950 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Promotional Banners ({promotions.length})
          </button>
        </div>

        {activeSubTab === 'coupons' ? (
          <button
            onClick={() => setShowCouponModal(true)}
            className="py-2 px-4 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        ) : (
          <button
            onClick={() => setShowCampaignModal(true)}
            className="py-2 px-4 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Banner</span>
          </button>
        )}
      </div>

      {/* Subtab 1: Coupons */}
      {activeSubTab === 'coupons' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-900">
              Active Checkout Vouchers & Codes
            </span>
            <span className="text-slate-400 font-medium">Applied at checkout step</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min Order</th>
                  <th className="py-3 px-4">Usage / Limit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Toggle Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-1 rounded text-xs">
                        {c.code}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-black text-cyan-700">
                        {c.discountType === 'percentage'
                          ? `${c.discountValue}% OFF`
                          : `${formatKSh(c.discountValue)} OFF`}
                      </span>
                      {c.maxDiscount && (
                        <span className="text-[10px] text-slate-400 block">
                          Cap: {formatKSh(c.maxDiscount)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {formatKSh(c.minOrderValue)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">
                        {c.usageCount} / {c.usageLimit || '∞'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          c.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {c.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onToggleCoupon(c.id, !c.active)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                          c.active
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {c.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Campaigns */}
      {activeSubTab === 'campaigns' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {promotions.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="h-40 relative bg-slate-900 overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt=""
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-cyan-500 text-slate-950 rounded w-fit mb-1">
                    {p.badge}
                  </span>
                  <h3 className="font-black text-base">{p.title}</h3>
                  <p className="text-xs text-slate-300">{p.subtitle}</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="text-slate-500 font-semibold">{p.buttonLink}</span>
                <button
                  onClick={() => onDeletePromotion(p.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remove Campaign"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Create New Coupon Code</h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {couponError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{couponError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH20"
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono uppercase font-black focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (KSh)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Value {discountType === 'percentage' ? '(%)' : '(KSh)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Order (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Cap (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Usage Limit</label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-950 hover:bg-cyan-600 text-white font-extrabold rounded-xl transition-colors shadow-xs"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Add Promotion Banner</h3>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Mega Tech Weekend"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={campaignSubtitle}
                  onChange={(e) => setCampaignSubtitle(e.target.value)}
                  placeholder="e.g. Up to 35% off genuine smartphones"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={campaignBadge}
                  onChange={(e) => setCampaignBadge(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={campaignImage}
                  onChange={(e) => setCampaignImage(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-950 hover:bg-cyan-600 text-white font-extrabold rounded-xl transition-colors shadow-xs"
                >
                  Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
