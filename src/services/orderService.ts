import { isSupabaseConfigured, supabase } from '../lib/supabase/client.ts';
import { Order, OrderStatus, PaymentStatus, CartItem, Address, PaymentMethod } from '../types/index.ts';

// In-memory / session store fallback when Supabase is not connected
let LOCAL_ORDERS: Order[] = [
  {
    id: 'ord-84920',
    orderNumber: 'NEW-2026-8492',
    userId: 'usr-customer-01',
    customerName: 'Kelvin Anunda',
    customerEmail: 'anundakelvin7@gmail.com',
    customerPhone: '+254 705 629 522',
    shippingAddress: {
      id: 'addr-01',
      fullName: 'Kelvin Anunda',
      phoneNumber: '+254 705 629 522',
      county: 'Nairobi',
      city: 'Nairobi',
      area: 'Westlands',
      streetAddress: 'Mpaka Road, Westlands Commercial Center',
      building: 'Block B, 3rd Floor',
      isDefault: true,
    },
    items: [
      {
        id: 'item-01',
        productId: 'prod-01',
        productName: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800',
        price: 38999,
        quantity: 1,
      },
    ],
    subtotal: 38999,
    shippingFee: 0,
    discountAmount: 0,
    total: 38999,
    status: 'delivered',
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    mpesaReceiptNumber: 'QK82910482',
    trackingNumber: 'FRG-NBO-84920',
    estimatedDeliveryDate: 'Within 24 Hours',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export interface CreateOrderParams {
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export const orderService = {
  /**
   * Create an order in Supabase with snapshot prices for integrity
   */
  async createOrder(params: CreateOrderParams): Promise<Order> {
    const orderNumber = `NEW-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrderId = `ord-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const orderItems = params.items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      orderId: newOrderId,
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800',
      price: item.product.price, // Captured price snapshot
      quantity: item.quantity,
    }));

    const newOrder: Order = {
      id: newOrderId,
      orderNumber,
      userId: params.userId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      shippingAddress: params.shippingAddress,
      items: orderItems,
      subtotal: params.subtotal,
      shippingFee: params.shippingFee,
      discountAmount: params.discountAmount,
      total: params.total,
      status: 'pending',
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
      mpesaReceiptNumber: params.paymentMethod === 'mpesa' ? `QK${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      trackingNumber: `FRG-NBO-${Math.floor(10000 + Math.random() * 90000)}`,
      estimatedDeliveryDate: 'Within 24-48 Hours',
      createdAt: nowIso,
    };

    // If Supabase is connected, persist to Supabase orders & order_items tables
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: orderRecord, error: orderErr } = await (supabase.from('orders') as any)
          .insert({
            order_number: orderNumber,
            user_id: params.userId || null,
            customer_name: params.customerName,
            customer_email: params.customerEmail,
            customer_phone: params.customerPhone,
            shipping_address: params.shippingAddress,
            subtotal: params.subtotal,
            shipping_fee: params.shippingFee,
            discount_amount: params.discountAmount,
            total: params.total,
            status: 'pending',
            payment_method: params.paymentMethod,
            payment_status: 'pending',
            mpesa_receipt_number: newOrder.mpesaReceiptNumber || null,
            tracking_number: newOrder.trackingNumber || null,
          })
          .select('id')
          .single();

        if (orderErr) {
          console.warn('Supabase order creation warning:', orderErr);
        } else if (orderRecord?.id) {
          newOrder.id = orderRecord.id;

          // Insert order items with price snapshots
          const itemsPayload = params.items.map((item) => ({
            order_id: orderRecord.id,
            product_id: item.product.id,
            product_name: item.product.name,
            product_image: item.product.images[0] || '',
            price: item.product.price,
            quantity: item.quantity,
          }));

          await (supabase.from('order_items') as any).insert(itemsPayload);
        }
      } catch (err) {
        console.warn('Supabase order insertion error, preserving in-memory order:', err);
      }
    }

    LOCAL_ORDERS.unshift(newOrder);
    try {
      localStorage.setItem('newera_orders', JSON.stringify(LOCAL_ORDERS));
    } catch {
      // ignore
    }

    return newOrder;
  },

  /**
   * Get all orders or orders for a specific user
   */
  async getOrders(userId?: string): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = (supabase.from('orders') as any)
          .select(`
            *,
            order_items (*)
          `)
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (!error && data && Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            orderNumber: d.order_number,
            userId: d.user_id || undefined,
            customerName: d.customer_name,
            customerEmail: d.customer_email,
            customerPhone: d.customer_phone,
            shippingAddress: d.shipping_address,
            subtotal: Number(d.subtotal),
            shippingFee: Number(d.shipping_fee || 0),
            discountAmount: Number(d.discount_amount || 0),
            total: Number(d.total),
            status: d.status as OrderStatus,
            paymentMethod: d.payment_method,
            paymentStatus: d.payment_status,
            mpesaReceiptNumber: d.mpesa_receipt_number || undefined,
            trackingNumber: d.tracking_number || undefined,
            estimatedDeliveryDate: 'Within 24-48 Hours',
            createdAt: d.created_at,
            items: (d.order_items || []).map((i: any) => ({
              id: i.id,
              productId: i.product_id,
              productName: i.product_name,
              productImage: i.product_image,
              price: Number(i.price),
              quantity: Number(i.quantity),
            })),
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch orders error, using local dataset:', err);
      }
    }

    try {
      const saved = localStorage.getItem('newera_orders');
      if (saved) {
        LOCAL_ORDERS = JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    if (userId) {
      return LOCAL_ORDERS.filter((o) => o.userId === userId || !o.userId);
    }
    return LOCAL_ORDERS;
  },

  /**
   * Get single order by order number or ID
   */
  async getOrderByNumber(orderNumberOrId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    const found = orders.find(
      (o) => o.orderNumber.toLowerCase() === orderNumberOrId.toLowerCase() || o.id === orderNumberOrId
    );
    return found || null;
  },

  /**
   * Update status of an order
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await (supabase.from('orders') as any)
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId);

        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update order status error:', err);
      }
    }

    LOCAL_ORDERS = LOCAL_ORDERS.map((o) => (o.id === orderId ? { ...o, status } : o));
    try {
      localStorage.setItem('newera_orders', JSON.stringify(LOCAL_ORDERS));
    } catch {
      // ignore
    }
    return true;
  },

  /**
   * Update payment status of an order (Admin Section 22)
   */
  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await (supabase.from('orders') as any)
          .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
          .eq('id', orderId);

        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update payment status error:', err);
      }
    }

    LOCAL_ORDERS = LOCAL_ORDERS.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o));
    try {
      localStorage.setItem('newera_orders', JSON.stringify(LOCAL_ORDERS));
    } catch {
      // ignore
    }
    return true;
  },

  /**
   * Update courier tracking number
   */
  async updateTrackingNumber(orderId: string, trackingNumber: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await (supabase.from('orders') as any)
          .update({ tracking_number: trackingNumber, updated_at: new Date().toISOString() })
          .eq('id', orderId);

        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update tracking number error:', err);
      }
    }

    LOCAL_ORDERS = LOCAL_ORDERS.map((o) => (o.id === orderId ? { ...o, trackingNumber } : o));
    try {
      localStorage.setItem('newera_orders', JSON.stringify(LOCAL_ORDERS));
    } catch {
      // ignore
    }
    return true;
  },
};
