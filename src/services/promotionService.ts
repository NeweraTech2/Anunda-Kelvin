import { Promotion, Coupon } from '../types/index.ts';
import { INITIAL_PROMOTIONS } from '../data/mockData.ts';

let LOCAL_PROMOTIONS: Promotion[] = [...INITIAL_PROMOTIONS];

let LOCAL_COUPONS: Coupon[] = [
  {
    id: 'coup-01',
    code: 'NEWERA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 20000,
    maxDiscount: 5000,
    usageLimit: 500,
    usageCount: 42,
    active: true,
    expiresAt: '2026-12-31T23:59:59Z',
  },
  {
    id: 'coup-02',
    code: 'KARIBU5',
    discountType: 'percentage',
    discountValue: 5,
    minOrderValue: 5000,
    maxDiscount: 2000,
    usageLimit: 1000,
    usageCount: 189,
    active: true,
    expiresAt: '2026-12-31T23:59:59Z',
  },
  {
    id: 'coup-03',
    code: 'TECHMEGA',
    discountType: 'fixed',
    discountValue: 2500,
    minOrderValue: 50000,
    usageLimit: 100,
    usageCount: 19,
    active: true,
    expiresAt: '2026-06-30T23:59:59Z',
  },
];

export const promotionService = {
  async getPromotions(): Promise<Promotion[]> {
    return LOCAL_PROMOTIONS;
  },

  async createPromotion(promo: Partial<Promotion> & { title: string }): Promise<Promotion> {
    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      title: promo.title,
      subtitle: promo.subtitle || 'Exclusive Tech Offer',
      description: promo.description || 'Limited time pricing across genuine electronics',
      buttonText: promo.buttonText || 'Shop Deals',
      buttonLink: promo.buttonLink || '/shop',
      imageUrl: promo.imageUrl || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200',
      badge: promo.badge || 'Limited Time',
      bgColor: promo.bgColor || 'from-slate-900 via-slate-800 to-cyan-950',
      accentColor: promo.accentColor || 'text-cyan-400',
      active: promo.active ?? true,
      startDate: promo.startDate || new Date().toISOString(),
      endDate: promo.endDate,
    };
    LOCAL_PROMOTIONS.unshift(newPromo);
    return newPromo;
  },

  async updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion> {
    const idx = LOCAL_PROMOTIONS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Promotion not found');
    LOCAL_PROMOTIONS[idx] = { ...LOCAL_PROMOTIONS[idx], ...updates };
    return LOCAL_PROMOTIONS[idx];
  },

  async deletePromotion(id: string): Promise<boolean> {
    LOCAL_PROMOTIONS = LOCAL_PROMOTIONS.filter((p) => p.id !== id);
    return true;
  },

  async getCoupons(): Promise<Coupon[]> {
    return LOCAL_COUPONS;
  },

  async createCoupon(coupon: Omit<Coupon, 'id' | 'usageCount'>): Promise<Coupon> {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      code: coupon.code.toUpperCase().trim(),
      usageCount: 0,
    };
    LOCAL_COUPONS.unshift(newCoupon);
    return newCoupon;
  },

  async toggleCoupon(id: string, active: boolean): Promise<boolean> {
    const c = LOCAL_COUPONS.find((item) => item.id === id);
    if (c) {
      c.active = active;
      return true;
    }
    return false;
  },
};
