import { isSupabaseConfigured, supabase } from '../lib/supabase/client.ts';
import { Address } from '../types/index.ts';

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    fullName: 'Kelvin Anunda',
    phoneNumber: '+254 705 629 522',
    county: 'Nairobi',
    city: 'Nairobi',
    area: 'Westlands',
    streetAddress: 'Mpaka Road, Westlands Commercial Center',
    building: 'Block B, 3rd Floor',
    deliveryNotes: 'Leave with reception during business hours',
    isDefault: true,
  },
  {
    id: 'addr-02',
    fullName: 'Kelvin Anunda',
    phoneNumber: '+254 705 629 522',
    county: 'Kiambu',
    city: 'Ruiru',
    area: 'Membley',
    streetAddress: 'Estate Gate 2, House 14B',
    building: 'Residential Villa',
    deliveryNotes: 'Call before arriving',
    isDefault: false,
  },
];

export const addressService = {
  async getAddresses(userId?: string): Promise<Address[]> {
    if (isSupabaseConfigured && supabase && userId) {
      try {
        const { data, error } = await (supabase.from('addresses') as any)
          .select('*')
          .eq('user_id', userId)
          .order('is_default', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            fullName: d.full_name,
            phoneNumber: d.phone_number,
            county: d.county,
            city: d.city,
            area: d.area,
            streetAddress: d.street_address,
            isDefault: d.is_default,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch addresses error, using local dataset:', err);
      }
    }

    try {
      const saved = localStorage.getItem('newera_addresses');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }

    return DEFAULT_ADDRESSES;
  },

  async saveAddress(address: Omit<Address, 'id'>, userId?: string): Promise<Address> {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };

    if (isSupabaseConfigured && supabase && userId) {
      try {
        const { data, error } = await (supabase.from('addresses') as any)
          .insert({
            user_id: userId,
            full_name: address.fullName,
            phone_number: address.phoneNumber,
            county: address.county,
            city: address.city,
            area: address.area,
            street_address: address.streetAddress,
            is_default: address.isDefault,
          })
          .select('*')
          .single();

        if (!error && data) {
          return {
            id: data.id,
            fullName: data.full_name,
            phoneNumber: data.phone_number,
            county: data.county,
            city: data.city,
            area: data.area,
            streetAddress: data.street_address,
            isDefault: data.is_default,
          };
        }
      } catch (err) {
        console.warn('Supabase save address error:', err);
      }
    }

    try {
      const current = await this.getAddresses(userId);
      const updated = [newAddress, ...current];
      localStorage.setItem('newera_addresses', JSON.stringify(updated));
    } catch {
      // ignore
    }

    return newAddress;
  },

  async deleteAddress(addressId: string, userId?: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await (supabase.from('addresses') as any).delete().eq('id', addressId);
      } catch (err) {
        console.warn('Supabase delete address error:', err);
      }
    }

    try {
      const current = await this.getAddresses(userId);
      const filtered = current.filter((a) => a.id !== addressId);
      localStorage.setItem('newera_addresses', JSON.stringify(filtered));
    } catch {
      // ignore
    }
    return true;
  },
};
