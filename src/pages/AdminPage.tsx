import React, { useState, useEffect, useMemo } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { productService } from '../services/productService.ts';
import { orderService } from '../services/orderService.ts';
import { customerService } from '../services/customerService.ts';
import { promotionService } from '../services/promotionService.ts';
import { reviewService } from '../services/reviewService.ts';
import { inquiryService } from '../services/inquiryService.ts';
import { settingsService } from '../services/settingsService.ts';
import { auditService } from '../services/auditService.ts';
import {
  Product,
  Category,
  Order,
  OrderStatus,
  PaymentStatus,
  CustomerAccount,
  Coupon,
  Promotion,
  Review,
  CustomerInquiry,
  StoreSettings,
  AuditLog,
} from '../types/index.ts';

import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar.tsx';
import { AdminHeader } from '../components/admin/AdminHeader.tsx';
import { AdminLoginModal } from '../components/admin/AdminLoginModal.tsx';
import { AdminDashboardTab } from '../components/admin/AdminDashboardTab.tsx';
import { AdminProductsTab } from '../components/admin/AdminProductsTab.tsx';
import { AdminInventoryTab } from '../components/admin/AdminInventoryTab.tsx';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab.tsx';
import { AdminCategoriesTab } from '../components/admin/AdminCategoriesTab.tsx';
import { AdminCustomersTab } from '../components/admin/AdminCustomersTab.tsx';
import { AdminPromotionsTab } from '../components/admin/AdminPromotionsTab.tsx';
import { AdminReviewsTab } from '../components/admin/AdminReviewsTab.tsx';
import { AdminInquiriesTab } from '../components/admin/AdminInquiriesTab.tsx';
import { AdminAnalyticsTab } from '../components/admin/AdminAnalyticsTab.tsx';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab.tsx';
import { AdminAuditTab } from '../components/admin/AdminAuditTab.tsx';
import { AdminDatabaseTab } from '../components/admin/AdminDatabaseTab.tsx';
import { ProductFormModal } from '../components/admin/ProductFormModal.tsx';
import { formatKSh } from '../lib/utils.ts';
import { RefreshCw } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, navigate, showToast } = useShop();

  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Entities state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerAccount[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
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
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Load all admin datasets
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [
        prodsRes,
        catsRes,
        ordersRes,
        custRes,
        coupsRes,
        promosRes,
        revsRes,
        inqsRes,
        settRes,
        logsRes,
      ] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        productService.getCategories(),
        orderService.getOrders(),
        customerService.getCustomers(),
        promotionService.getCoupons(),
        promotionService.getPromotions(),
        reviewService.getAllReviews(),
        inquiryService.getInquiries(),
        settingsService.getSettings(),
        auditService.getLogs(),
      ]);

      setProducts(prodsRes.products);
      setCategories(catsRes);
      setOrders(ordersRes);
      setCustomers(custRes);
      setCoupons(coupsRes);
      setPromotions(promosRes);
      setReviews(revsRes);
      setInquiries(inqsRes);
      setSettings(settRes);
      setAuditLogs(logsRes);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  // Derived low stock items
  const lowStockThreshold = settings.lowStockThreshold || 5;
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.active && p.stockQuantity <= lowStockThreshold);
  }, [products, lowStockThreshold]);

  // Real Notification Generator
  const notifications = useMemo(() => {
    const list: Array<{
      id: string;
      type: 'order' | 'stock' | 'inquiry';
      title: string;
      message: string;
      timestamp: string;
      tabTarget: AdminTab;
    }> = [];

    // Low stock alerts
    lowStockProducts.slice(0, 3).forEach((p) => {
      list.push({
        id: `notif-stock-${p.id}`,
        type: 'stock',
        title: `Low Stock: ${p.name}`,
        message: `Only ${p.stockQuantity} units left in warehouse. Threshold is ${lowStockThreshold}.`,
        timestamp: 'Inventory Alert',
        tabTarget: 'inventory',
      });
    });

    // Pending orders
    const pending = orders.filter((o) => o.status === 'pending');
    if (pending.length > 0) {
      list.push({
        id: 'notif-pending-orders',
        type: 'order',
        title: `${pending.length} Pending Orders Awaiting Dispatch`,
        message: `Earliest: #${pending[0].orderNumber} for ${formatKSh(pending[0].total)}.`,
        timestamp: 'Fulfillment Alert',
        tabTarget: 'orders',
      });
    }

    // New inquiries
    const newInqs = inquiries.filter((i) => i.status === 'new');
    if (newInqs.length > 0) {
      list.push({
        id: 'notif-new-inq',
        type: 'inquiry',
        title: `${newInqs.length} New Customer Support Inquiries`,
        message: `Latest: "${newInqs[0].subject}" from ${newInqs[0].fullName}.`,
        timestamp: 'Support Desk',
        tabTarget: 'inquiries',
      });
    }

    return list;
  }, [lowStockProducts, orders, inquiries, lowStockThreshold]);

  // Authentication Guard
  if (!user || user.role !== 'admin') {
    return <AdminLoginModal onSuccess={loadAdminData} />;
  }

  // --- Handlers & Actions ---

  const handleSaveProduct = async (productData: Partial<Product> & { name: string; price: number }) => {
    try {
      if (editingProduct) {
        const updated = await productService.updateProduct(editingProduct.id, productData);
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
        showToast({
          type: 'success',
          title: 'Product Updated',
          message: `${updated.name} has been updated in the catalog.`,
        });
        await auditService.logAction(
          { id: user.id, fullName: user.fullName, role: 'Super Admin' },
          'PRODUCT_UPDATED',
          'Product',
          `Updated details for ${updated.name}`,
          updated.id
        );
      } else {
        const created = await productService.createProduct({
          ...productData,
          slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          rating: 5.0,
          reviewCount: 0,
        });
        setProducts([created, ...products]);
        showToast({
          type: 'success',
          title: 'Product Published',
          message: `${created.name} is now live on the storefront.`,
        });
        await auditService.logAction(
          { id: user.id, fullName: user.fullName, role: 'Super Admin' },
          'PRODUCT_CREATED',
          'Product',
          `Created product ${created.name} (SKU: ${created.sku})`,
          created.id
        );
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Action Failed',
        message: err.message || 'Could not save product',
      });
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const sanitized = Math.max(0, Math.floor(newStock));
      await productService.updateStock(productId, sanitized);
      setProducts(products.map((p) => (p.id === productId ? { ...p, stockQuantity: sanitized } : p)));
      showToast({
        type: 'info',
        title: 'Warehouse Stock Synced',
        message: `Inventory updated to ${sanitized} units.`,
      });
      await auditService.logAction(
        { id: user.id, fullName: user.fullName, role: 'Super Admin' },
        'INVENTORY_STOCK_UPDATE',
        'Product',
        `Stock set to ${sanitized} units for product ${productId}`,
        productId
      );
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Stock Update Failed',
        message: err.message,
      });
    }
  };

  const handleUpdatePrice = async (productId: string, newPrice: number) => {
    try {
      const updated = await productService.updateProduct(productId, { price: newPrice });
      setProducts(products.map((p) => (p.id === productId ? updated : p)));
      showToast({
        type: 'success',
        title: 'Pricing Updated',
        message: `Product price set to ${formatKSh(newPrice)}.`,
      });
      await auditService.logAction(
        { id: user.id, fullName: user.fullName, role: 'Super Admin' },
        'PRICE_UPDATE',
        'Product',
        `Price updated to ${formatKSh(newPrice)}`,
        productId
      );
    } catch (err: any) {
      showToast({ type: 'error', title: 'Price Update Failed', message: err.message });
    }
  };

  const handleDeactivateProduct = async (productId: string) => {
    try {
      await productService.deactivateProduct(productId);
      setProducts(products.map((p) => (p.id === productId ? { ...p, active: false } : p)));
      showToast({
        type: 'info',
        title: 'Product Deactivated',
        message: 'Product removed from customer storefront.',
      });
      await auditService.logAction(
        { id: user.id, fullName: user.fullName, role: 'Super Admin' },
        'PRODUCT_DEACTIVATED',
        'Product',
        `Deactivated product ${productId}`,
        productId
      );
    } catch (err: any) {
      showToast({ type: 'error', title: 'Deactivation Failed', message: err.message });
    }
  };

  const handleToggleFeatured = async (productId: string, featured: boolean) => {
    try {
      const updated = await productService.updateProduct(productId, { featured });
      setProducts(products.map((p) => (p.id === productId ? updated : p)));
      showToast({
        type: 'info',
        title: 'Featured Placement',
        message: featured ? 'Promoted on homepage highlights' : 'Removed from highlights',
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Update Failed', message: err.message });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
      showToast({
        type: 'success',
        title: 'Fulfillment Status Changed',
        message: `Order transitioned to ${status.toUpperCase()}.`,
      });
      await auditService.logAction(
        { id: user.id, fullName: user.fullName, role: 'Super Admin' },
        'ORDER_STATUS_CHANGE',
        'Order',
        `Transitioned order ${orderId} to ${status}`,
        orderId
      );
    } catch (err: any) {
      showToast({ type: 'error', title: 'Status Update Failed', message: err.message });
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      await orderService.updatePaymentStatus(orderId, paymentStatus);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o)));
      showToast({
        type: 'success',
        title: 'Payment Verification Updated',
        message: `Payment state verified as ${paymentStatus.toUpperCase()}.`,
      });
      await auditService.logAction(
        { id: user.id, fullName: user.fullName, role: 'Super Admin' },
        'PAYMENT_STATUS_UPDATE',
        'Order',
        `Payment status updated to ${paymentStatus}`,
        orderId
      );
    } catch (err: any) {
      showToast({ type: 'error', title: 'Payment Update Failed', message: err.message });
    }
  };

  const handleUpdateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    try {
      await orderService.updateTrackingNumber(orderId, trackingNumber);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, trackingNumber } : o)));
      showToast({
        type: 'success',
        title: 'Courier Tracking Assigned',
        message: `Waybill tracking ${trackingNumber} saved.`,
      });
      await auditService.logAction(
        { id: user.id, fullName: user.fullName, role: 'Super Admin' },
        'TRACKING_NUMBER_ASSIGNED',
        'Order',
        `Assigned courier tracking ${trackingNumber}`,
        orderId
      );
    } catch (err: any) {
      showToast({ type: 'error', title: 'Tracking Update Failed', message: err.message });
    }
  };

  const handleCreateCategory = async (catData: Omit<Category, 'id'>) => {
    try {
      const created = await productService.createCategory(catData);
      setCategories([...categories, created]);
      showToast({
        type: 'success',
        title: 'Category Created',
        message: `${created.name} added to store taxonomy.`,
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Failed to create category', message: err.message });
    }
  };

  const handleUpdateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const updated = await productService.updateCategory(id, updates);
      setCategories(categories.map((c) => (c.id === id ? updated : c)));
      showToast({
        type: 'success',
        title: 'Category Saved',
        message: `Updated taxonomy node ${updated.name}.`,
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Failed to update category', message: err.message });
    }
  };

  const handleUpdateCustomerStatus = async (id: string, status: CustomerAccount['status']) => {
    try {
      await customerService.updateCustomerStatus(id, status);
      setCustomers(customers.map((c) => (c.id === id ? { ...c, status } : c)));
      showToast({
        type: 'info',
        title: 'Customer Access Updated',
        message: `Account status updated to ${status}.`,
      });
      await auditService.logAction(
        { id: user.id, fullName: user.fullName, role: 'Super Admin' },
        'CUSTOMER_STATUS_CHANGED',
        'Customer',
        `Set account status to ${status} for customer ${id}`,
        id
      );
    } catch (err: any) {
      showToast({ type: 'error', title: 'Update Failed', message: err.message });
    }
  };

  const handleCreateCoupon = async (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    try {
      const created = await promotionService.createCoupon(couponData);
      setCoupons([created, ...coupons]);
      showToast({
        type: 'success',
        title: 'Coupon Published',
        message: `Code ${created.code} is active for checkout discounts.`,
      });
      await auditService.logAction(
        { id: user.id, fullName: user.fullName, role: 'Super Admin' },
        'COUPON_CREATED',
        'Promotion',
        `Created coupon ${created.code}`,
        created.id
      );
    } catch (err: any) {
      showToast({ type: 'error', title: 'Failed to create coupon', message: err.message });
    }
  };

  const handleToggleCoupon = async (id: string, active: boolean) => {
    try {
      await promotionService.toggleCoupon(id, active);
      setCoupons(coupons.map((c) => (c.id === id ? { ...c, active } : c)));
      showToast({
        type: 'info',
        title: 'Coupon Status Updated',
        message: active ? 'Coupon enabled' : 'Coupon deactivated',
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Update Failed', message: err.message });
    }
  };

  const handleCreatePromotion = async (promoData: Partial<Promotion> & { title: string }) => {
    try {
      const created = await promotionService.createPromotion(promoData);
      setPromotions([created, ...promotions]);
      showToast({
        type: 'success',
        title: 'Banner Campaign Live',
        message: `Campaign banner ${created.title} published.`,
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Failed to create banner', message: err.message });
    }
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      await promotionService.deletePromotion(id);
      setPromotions(promotions.filter((p) => p.id !== id));
      showToast({
        type: 'info',
        title: 'Banner Removed',
        message: 'Campaign banner deleted from carousel.',
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Delete Failed', message: err.message });
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await reviewService.deleteReview(id);
      setReviews(reviews.filter((r) => r.id !== id));
      showToast({
        type: 'info',
        title: 'Review Moderated',
        message: 'Feedback entry removed from product page.',
      });
      await auditService.logAction(
        { id: user.id, fullName: user.fullName, role: 'Super Admin' },
        'REVIEW_DELETED',
        'Review',
        `Deleted review ${id}`,
        id
      );
    } catch (err: any) {
      showToast({ type: 'error', title: 'Failed to delete review', message: err.message });
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: CustomerInquiry['status']) => {
    try {
      await inquiryService.updateInquiryStatus(id, status);
      setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)));
      showToast({
        type: 'success',
        title: 'Support Ticket Updated',
        message: `Ticket marked as ${status.replace('_', ' ').toUpperCase()}.`,
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Failed to update inquiry', message: err.message });
    }
  };

  const handleSaveSettings = async (updates: Partial<StoreSettings>) => {
    try {
      const saved = await settingsService.updateSettings(updates);
      setSettings(saved);
      showToast({
        type: 'success',
        title: 'Store Settings Saved',
        message: 'Delivery rates and thresholds updated successfully.',
      });
      await auditService.logAction(
        { id: user.id, fullName: user.fullName, role: 'Super Admin' },
        'STORE_SETTINGS_UPDATE',
        'Settings',
        'Updated delivery tariffs and store contact configuration'
      );
    } catch (err: any) {
      showToast({ type: 'error', title: 'Settings Update Failed', message: err.message });
    }
  };

  return (
    <div id="newera-admin-system" className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Sidebar navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onNavigateStorefront={() => navigate('/')}
        counts={{
          products: products.length,
          orders: orders.length,
          lowStock: lowStockProducts.length,
          inquiries: inquiries.filter((i) => i.status === 'new').length,
          reviews: reviews.length,
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onSelectTab={setCurrentTab}
          notifications={notifications}
        />

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">Synchronizing database tables...</p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <AdminDashboardTab
                  products={products}
                  orders={orders}
                  customers={customers}
                  lowStockProducts={lowStockProducts}
                  onSelectTab={setCurrentTab}
                  onOpenAddProduct={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  onViewOrder={() => setCurrentTab('orders')}
                  onQuickUpdateStock={handleUpdateStock}
                />
              )}

              {currentTab === 'products' && (
                <AdminProductsTab
                  products={products}
                  categories={categories}
                  onOpenAddModal={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  onEditProduct={(p) => {
                    setEditingProduct(p);
                    setIsProductModalOpen(true);
                  }}
                  onDeactivateProduct={handleDeactivateProduct}
                  onUpdateStock={handleUpdateStock}
                  onUpdatePrice={handleUpdatePrice}
                  onToggleFeatured={handleToggleFeatured}
                />
              )}

              {currentTab === 'categories' && (
                <AdminCategoriesTab
                  categories={categories}
                  products={products}
                  onCreateCategory={handleCreateCategory}
                  onUpdateCategory={handleUpdateCategory}
                />
              )}

              {currentTab === 'inventory' && (
                <AdminInventoryTab
                  products={products}
                  lowStockThreshold={lowStockThreshold}
                  onUpdateStock={handleUpdateStock}
                />
              )}

              {currentTab === 'orders' && (
                <AdminOrdersTab
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onUpdatePaymentStatus={handleUpdatePaymentStatus}
                  onUpdateTrackingNumber={handleUpdateTrackingNumber}
                />
              )}

              {currentTab === 'customers' && (
                <AdminCustomersTab
                  customers={customers}
                  onUpdateStatus={handleUpdateCustomerStatus}
                />
              )}

              {currentTab === 'promotions' && (
                <AdminPromotionsTab
                  promotions={promotions}
                  coupons={coupons}
                  onCreatePromotion={handleCreatePromotion}
                  onDeletePromotion={handleDeletePromotion}
                  onCreateCoupon={handleCreateCoupon}
                  onToggleCoupon={handleToggleCoupon}
                />
              )}

              {currentTab === 'reviews' && (
                <AdminReviewsTab
                  reviews={reviews}
                  products={products}
                  onDeleteReview={handleDeleteReview}
                />
              )}

              {currentTab === 'inquiries' && (
                <AdminInquiriesTab
                  inquiries={inquiries}
                  onUpdateStatus={handleUpdateInquiryStatus}
                />
              )}

              {currentTab === 'analytics' && (
                <AdminAnalyticsTab
                  products={products}
                  orders={orders}
                  categories={categories}
                />
              )}

              {currentTab === 'settings' && (
                <AdminSettingsTab
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                />
              )}

              {currentTab === 'audit' && (
                <AdminAuditTab logs={auditLogs} />
              )}

              {currentTab === 'database' && (
                <AdminDatabaseTab />
              )}
            </>
          )}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};
