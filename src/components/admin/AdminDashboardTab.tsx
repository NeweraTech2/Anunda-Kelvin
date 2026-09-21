import React from 'react';
import { Product, Order, CustomerAccount } from '../../types/index.ts';
import { formatKSh } from '../../lib/utils.ts';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Boxes,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar.tsx';

interface AdminDashboardTabProps {
  products: Product[];
  orders: Order[];
  customers: CustomerAccount[];
  lowStockProducts: Product[];
  onSelectTab: (tab: AdminTab) => void;
  onOpenAddProduct: () => void;
  onViewOrder: (order: Order) => void;
  onQuickUpdateStock: (productId: string, newStock: number) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  products,
  orders,
  customers,
  lowStockProducts,
  onSelectTab,
  onOpenAddProduct,
  onViewOrder,
  onQuickUpdateStock,
}) => {
  // Real calculations
  const activeProductsCount = products.filter((p) => p.active).length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  // Real revenue calculated from non-cancelled/non-refunded orders
  const validOrders = orders.filter((o) => o.status !== 'cancelled' && o.status !== 'refunded');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 6 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-black text-slate-900 tracking-tight">
              {formatKSh(totalRevenue)}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>{validOrders.length} valid sales</span>
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onSelectTab('orders')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-cyan-500 transition-colors group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-black text-slate-900 tracking-tight">{orders.length}</p>
            <span className="text-[10px] text-cyan-600 font-semibold flex items-center gap-1 mt-0.5">
              <span>View pipeline</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => onSelectTab('orders')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-500 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-black text-amber-600 tracking-tight">{pendingOrdersCount}</p>
            <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
              Requires fulfillment
            </span>
          </div>
        </div>

        {/* Active Products */}
        <div
          onClick={() => onSelectTab('products')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-cyan-500 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Catalog
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-black text-slate-900 tracking-tight">{activeProductsCount}</p>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
              {products.length} total SKUs
            </span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => onSelectTab('inventory')}
          className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between cursor-pointer transition-colors ${
            lowStockProducts.length > 0
              ? 'bg-red-50/60 border-red-200 hover:border-red-400'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                lowStockProducts.length > 0 ? 'text-red-700' : 'text-slate-500'
              }`}
            >
              Low Stock Alert
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                lowStockProducts.length > 0
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p
              className={`text-lg font-black tracking-tight ${
                lowStockProducts.length > 0 ? 'text-red-700' : 'text-slate-900'
              }`}
            >
              {lowStockProducts.length}
            </p>
            <span className="text-[10px] text-red-600 font-semibold mt-0.5 block">
              {lowStockProducts.length > 0 ? 'Needs re-order' : 'All stocks healthy'}
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div
          onClick={() => onSelectTab('customers')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-cyan-500 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Customers
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-black text-slate-900 tracking-tight">{customers.length}</p>
            <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block">
              Registered buyers
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Low Stock Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Recent Customer Orders
              </h2>
              <p className="text-[11px] text-slate-400">Live order queue with fulfillment status</p>
            </div>
            <button
              onClick={() => onSelectTab('orders')}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No orders logged yet. Customer checkouts will display here immediately.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Order Number</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Total Amount</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-extrabold text-slate-900 block">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 block">
                          {ord.customerName}
                        </span>
                        <span className="text-[10px] text-slate-400">{ord.customerPhone}</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {formatKSh(ord.total)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'processing'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onViewOrder(ord)}
                          className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Low Stock Alerts & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Low Stock Inventory
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('inventory')}
                className="text-[11px] font-bold text-cyan-600 hover:underline"
              >
                All Inventory
              </button>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">Stock Levels Optimal</p>
                <p className="text-[10px]">No catalog items below the minimum safety threshold.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-red-100 bg-red-50/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-9 h-9 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate leading-snug">{p.name}</p>
                        <p className="text-[11px] text-red-600 font-extrabold">
                          Only {p.stockQuantity} left
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onQuickUpdateStock(p.id, p.stockQuantity + 10)}
                      className="py-1 px-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 rounded-lg text-[10px] shrink-0 transition-colors shadow-2xs"
                    >
                      +10 Stock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Quick Management Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={onOpenAddProduct}
                className="p-3 bg-slate-800 hover:bg-cyan-600 text-left rounded-xl transition-colors font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>New Product</span>
              </button>
              <button
                onClick={() => onSelectTab('promotions')}
                className="p-3 bg-slate-800 hover:bg-cyan-600 text-left rounded-xl transition-colors font-bold flex items-center gap-2"
              >
                <Boxes className="w-4 h-4 text-cyan-400" />
                <span>Add Coupon</span>
              </button>
              <button
                onClick={() => onSelectTab('orders')}
                className="p-3 bg-slate-800 hover:bg-cyan-600 text-left rounded-xl transition-colors font-bold flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                <span>Orders ({orders.length})</span>
              </button>
              <button
                onClick={() => onSelectTab('settings')}
                className="p-3 bg-slate-800 hover:bg-cyan-600 text-left rounded-xl transition-colors font-bold flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4 text-cyan-400" />
                <span>Delivery Rates</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
