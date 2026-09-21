export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName: string;
  icon?: string;
  imageUrl: string;
  productCount: number;
  featured?: boolean;
  active?: boolean;
  displayOrder?: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number; // in KSh
  previousPrice?: number;
  discountPercentage?: number;
  categoryId: string;
  categoryName?: string;
  brand: string;
  sku: string;
  stockQuantity: number;
  rating: number; // 0 to 5
  reviewCount: number;
  featured: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashDeal?: boolean;
  flashDealEnd?: string; // ISO date string
  active: boolean;
  images: string[]; // URLs
  specifications?: Record<string, string>;
  warranty?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedVariant?: string;
  addedAt: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  county: string;
  city: string; // e.g. Nairobi, Mombasa, Kisumu
  area: string; // e.g. Westlands, CBD, Kilimani
  streetAddress: string;
  building?: string;
  deliveryNotes?: string;
  isDefault: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded';
export type PaymentMethod = 'mpesa' | 'card' | 'cash_on_delivery' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  mpesaReceiptNumber?: string;
  trackingNumber?: string;
  estimatedDeliveryDate: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'admin' | 'staff';
  createdAt: string;
}

export interface CustomerInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  category: 'order' | 'delivery' | 'payment' | 'return' | 'product' | 'general';
  orderNumber?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  badge?: string;
  bgColor?: string;
  accentColor?: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  expiresAt?: string;
}

export interface CustomerAccount {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  status: 'active' | 'restricted' | 'suspended';
  role: 'customer' | 'admin' | 'staff';
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  currency: string;
  nairobiStandardDelivery: number;
  nairobiExpressDelivery: number;
  upcountryDelivery: number;
  freeDeliveryThreshold: number;
  lowStockThreshold: number;
  allowCashOnDelivery: boolean;
  allowMpesa: boolean;
  allowCard: boolean;
  orderNotificationEmail: boolean;
  lowStockAlertEmail: boolean;
}

export interface ProductFilters {
  categorySlug?: string;
  searchQuery?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  sortBy?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  limit?: number;
  page?: number;
}
