import { StoreSettings } from '../types/index.ts';

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'NewEra Shop Kenya',
  storePhone: '+254 705 629 522',
  storeEmail: 'support@newerashop.co.ke',
  storeAddress: 'Delta Corner Tower B, Ring Road Westlands, Nairobi, Kenya',
  currency: 'KSh',
  nairobiStandardDelivery: 250,
  nairobiExpressDelivery: 500,
  upcountryDelivery: 450,
  freeDeliveryThreshold: 50000,
  lowStockThreshold: 5,
  allowCashOnDelivery: true,
  allowMpesa: true,
  allowCard: true,
  orderNotificationEmail: true,
  lowStockAlertEmail: true,
};

let CURRENT_SETTINGS: StoreSettings = { ...DEFAULT_SETTINGS };

try {
  const saved = localStorage.getItem('newera_store_settings');
  if (saved) {
    CURRENT_SETTINGS = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  }
} catch {
  // ignore
}

export const settingsService = {
  async getSettings(): Promise<StoreSettings> {
    return CURRENT_SETTINGS;
  },

  async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    CURRENT_SETTINGS = {
      ...CURRENT_SETTINGS,
      ...updates,
    };
    try {
      localStorage.setItem('newera_store_settings', JSON.stringify(CURRENT_SETTINGS));
    } catch {
      // ignore
    }
    return CURRENT_SETTINGS;
  },
};
