import { isSupabaseConfigured, supabase } from '../lib/supabase/client.ts';
import { CustomerInquiry } from '../types/index.ts';

const LOCAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-01',
    fullName: 'David Kamau',
    email: 'kamau.d@gmail.com',
    phone: '+254 712 345 678',
    subject: 'Bulk delivery inquiry for offices in Upper Hill',
    category: 'delivery',
    message: 'Hello, we would like to order 5 units of Apple MacBook Pro for our engineering team. Can delivery be scheduled this Thursday morning?',
    status: 'new',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inq-02',
    fullName: 'Esther Moraa',
    email: 'moraa.e@yahoo.com',
    phone: '+254 722 987 654',
    subject: 'Warranty coverage check',
    category: 'product',
    orderNumber: 'NEW-2026-8492',
    message: 'Is the Sony WH-1000XM5 covered by official Sony East Africa warranty in Nairobi? Thank you!',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
];

export const inquiryService = {
  async submitInquiry(inquiry: Omit<CustomerInquiry, 'id' | 'status' | 'createdAt'>): Promise<{ success: boolean; id: string }> {
    const newInquiry: CustomerInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('customer_inquiries') as any)
          .insert({
            full_name: inquiry.fullName,
            email: inquiry.email,
            phone: inquiry.phone,
            subject: inquiry.subject,
            category: inquiry.category,
            order_number: inquiry.orderNumber || null,
            message: inquiry.message,
            status: 'new',
          })
          .select('id')
          .single();

        if (!error && data) {
          return { success: true, id: (data as any).id };
        }
      } catch (err) {
        console.warn('Supabase inquiry insert error, using local queue:', err);
      }
    }

    LOCAL_INQUIRIES.unshift(newInquiry);
    return { success: true, id: newInquiry.id };
  },

  async getInquiries(): Promise<CustomerInquiry[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('customer_inquiries') as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return (data as any[]).map((d: any) => ({
            id: d.id,
            fullName: d.full_name,
            email: d.email,
            phone: d.phone,
            subject: d.subject,
            category: d.category as CustomerInquiry['category'],
            orderNumber: d.order_number || undefined,
            message: d.message,
            status: d.status as CustomerInquiry['status'],
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch inquiries error:', err);
      }
    }
    return LOCAL_INQUIRIES;
  },

  async updateInquiryStatus(id: string, status: CustomerInquiry['status']): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await (supabase.from('customer_inquiries') as any)
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update inquiry error:', err);
      }
    }

    const item = LOCAL_INQUIRIES.find((i) => i.id === id);
    if (item) {
      item.status = status;
    }
    return true;
  },
};
