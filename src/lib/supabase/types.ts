export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'customer' | 'admin' | 'staff';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: 'customer' | 'admin' | 'staff';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'customer' | 'admin' | 'staff';
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_name: string;
          image_url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon_name: string;
          image_url: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon_name?: string;
          image_url?: string;
          display_order?: number;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          short_description: string | null;
          price: number;
          previous_price: number | null;
          discount_percentage: number | null;
          category_id: string;
          brand: string;
          sku: string;
          stock_quantity: number;
          rating: number;
          review_count: number;
          featured: boolean;
          active: boolean;
          specifications: Json | null;
          warranty: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          short_description?: string | null;
          price: number;
          previous_price?: number | null;
          discount_percentage?: number | null;
          category_id: string;
          brand: string;
          sku: string;
          stock_quantity?: number;
          rating?: number;
          review_count?: number;
          featured?: boolean;
          active?: boolean;
          specifications?: Json | null;
          warranty?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          short_description?: string | null;
          price?: number;
          previous_price?: number | null;
          discount_percentage?: number | null;
          category_id?: string;
          brand?: string;
          sku?: string;
          stock_quantity?: number;
          rating?: number;
          review_count?: number;
          featured?: boolean;
          active?: boolean;
          specifications?: Json | null;
          warranty?: string | null;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string;
          is_primary: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text: string;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          url?: string;
          alt_text?: string;
          is_primary?: boolean;
          display_order?: number;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          quantity?: number;
          updated_at?: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          product_id?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: Json;
          subtotal: number;
          shipping_fee: number;
          discount_amount: number;
          total: number;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          payment_method: 'mpesa' | 'card' | 'cash_on_delivery' | 'bank_transfer';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          mpesa_receipt_number: string | null;
          tracking_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: Json;
          subtotal: number;
          shipping_fee?: number;
          discount_amount?: number;
          total: number;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          payment_method: 'mpesa' | 'card' | 'cash_on_delivery' | 'bank_transfer';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          mpesa_receipt_number?: string | null;
          tracking_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          mpesa_receipt_number?: string | null;
          tracking_number?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image: string;
          price: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image: string;
          price: number;
          quantity: number;
          created_at?: string;
        };
        Update: {
          price?: number;
          quantity?: number;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          amount: number;
          method: string;
          status: string;
          provider_transaction_id: string | null;
          mpesa_phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          amount: number;
          method: string;
          status: string;
          provider_transaction_id?: string | null;
          mpesa_phone?: string | null;
          created_at?: string;
        };
        Update: {
          status?: string;
          provider_transaction_id?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          user_name: string;
          rating: number;
          comment: string;
          verified_purchase: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          user_name: string;
          rating: number;
          comment: string;
          verified_purchase?: boolean;
          created_at?: string;
        };
        Update: {
          rating?: number;
          comment?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone_number: string;
          county: string;
          city: string;
          area: string;
          street_address: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone_number: string;
          county: string;
          city: string;
          area: string;
          street_address: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          full_name?: string;
          phone_number?: string;
          county?: string;
          city?: string;
          area?: string;
          street_address?: string;
          is_default?: boolean;
        };
      };
      customer_inquiries: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          subject: string;
          category: string;
          order_number: string | null;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone: string;
          subject: string;
          category: string;
          order_number?: string | null;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          status?: string;
        };
      };
      promotions: {
        Row: {
          id: string;
          title: string;
          subtitle: string;
          description: string;
          button_text: string;
          button_link: string;
          image_url: string;
          badge: string | null;
          bg_color: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle: string;
          description: string;
          button_text: string;
          button_link: string;
          image_url: string;
          badge?: string | null;
          bg_color?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          subtitle?: string;
          description?: string;
          button_text?: string;
          button_link?: string;
          image_url?: string;
          active?: boolean;
        };
      };
    };
  };
}
