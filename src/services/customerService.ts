import { isSupabaseConfigured, supabase } from '../lib/supabase/client.ts';
import { CustomerAccount } from '../types/index.ts';

let LOCAL_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'usr-001',
    email: 'anundakelvin7@gmail.com',
    fullName: 'Kelvin Anunda',
    phone: '+254 705 629 522',
    status: 'active',
    role: 'customer',
    ordersCount: 2,
    totalSpent: 88998,
    createdAt: '2026-01-15T08:30:00Z',
  },
  {
    id: 'usr-002',
    email: 'grace.atieno@gmail.com',
    fullName: 'Grace Atieno',
    phone: '+254 712 345 678',
    status: 'active',
    role: 'customer',
    ordersCount: 1,
    totalSpent: 42999,
    createdAt: '2026-02-01T11:20:00Z',
  },
  {
    id: 'usr-003',
    email: 'dennis.kip@outlook.com',
    fullName: 'Dennis Kipchumba',
    phone: '+254 733 998 877',
    status: 'active',
    role: 'customer',
    ordersCount: 3,
    totalSpent: 125997,
    createdAt: '2026-02-14T14:10:00Z',
  },
  {
    id: 'usr-004',
    email: 'faith.wanjiku@yahoo.com',
    fullName: 'Faith Wanjiku',
    phone: '+254 720 112 233',
    status: 'active',
    role: 'customer',
    ordersCount: 1,
    totalSpent: 189999,
    createdAt: '2026-03-02T09:45:00Z',
  },
];

export const customerService = {
  async getCustomers(): Promise<CustomerAccount[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('users') as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            email: d.email,
            fullName: d.full_name || 'Customer',
            phone: d.phone,
            status: d.status || 'active',
            role: d.role || 'customer',
            ordersCount: d.orders_count || 0,
            totalSpent: d.total_spent || 0,
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase getCustomers warning:', err);
      }
    }
    return LOCAL_CUSTOMERS;
  },

  async updateCustomerStatus(id: string, status: CustomerAccount['status']): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await (supabase.from('users') as any)
          .update({ status })
          .eq('id', id);

        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update customer status error:', err);
      }
    }

    const customer = LOCAL_CUSTOMERS.find((c) => c.id === id);
    if (customer) {
      customer.status = status;
    }
    return true;
  },
};
