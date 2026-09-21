import React, { useState, useMemo } from 'react';
import { Product, Order, Category } from '../../types/index.ts';
import { formatKSh } from '../../lib/utils.ts';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Boxes,
  PieChart,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface AdminAnalyticsTabProps {
  products: Product[];
  orders: Order[];
  categories: Category[];
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  products,
  orders,
  categories,
}) => {
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    const now = new Date().getTime();
    return orders.filter((o) => {
      const orderTime = new Date(o.createdAt).getTime();
      if (dateRange === 'today') {
        const oneDay = 24 * 60 * 60 * 1000;
        return now - orderTime <= oneDay;
      }
      if (dateRange === 'week') {
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        return now - orderTime <= oneWeek;
      }
      if (dateRange === 'month') {
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        return now - orderTime <= oneMonth;
      }
      return true;
    });
  }, [orders, dateRange]);

  // Real calculations
  const validOrders = filteredOrders.filter(
    (o) => o.status !== 'cancelled' && o.status !== 'refunded'
  );

  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = filteredOrders.length;
  const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Sales by Category
  const categorySales = useMemo(() => {
    const salesMap: Record<string, { count: number; revenue: number }> = {};
    categories.forEach((c) => {
      salesMap[c.slug] = { count: 0, revenue: 0 };
    });

    validOrders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const cat = prod?.categoryId || 'general';
        if (!salesMap[cat]) {
          salesMap[cat] = { count: 0, revenue: 0 };
        }
        salesMap[cat].count += item.quantity;
        salesMap[cat].revenue += item.price * item.quantity;
      });
    });

    return Object.entries(salesMap)
      .map(([slug, data]) => {
        const catObj = categories.find((c) => c.slug === slug);
        return {
          slug,
          name: catObj?.name || slug,
          units: data.count,
          revenue: data.revenue,
          percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [categories, validOrders, products, totalRevenue]);

  // Order Status Distribution
  const statusCounts = useMemo(() => {
    const dist: Record<string, number> = {
      delivered: 0,
      shipped: 0,
      processing: 0,
      pending: 0,
      cancelled: 0,
    };
    filteredOrders.forEach((o) => {
      dist[o.status] = (dist[o.status] || 0) + 1;
    });
    return dist;
  }, [filteredOrders]);

  // Top Selling Products
  const topProducts = useMemo(() => {
    const salesCount: Record<string, { qty: number; revenue: number; product: Product }> = {};

    validOrders.forEach((o) => {
      o.items.forEach((item) => {
        const p = products.find((prod) => prod.id === item.productId);
        if (p) {
          if (!salesCount[p.id]) {
            salesCount[p.id] = { qty: 0, revenue: 0, product: p };
          }
          salesCount[p.id].qty += item.quantity;
          salesCount[p.id].revenue += item.price * item.quantity;
        }
      });
    });

    return Object.values(salesCount)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [validOrders, products]);

  return (
    <div className="space-y-6">
      {/* Top Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Commercial Business Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Real calculations strictly computed from verified database transactions
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              dateRange === 'today' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('week')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              dateRange === 'week' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              dateRange === 'month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateRange('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              dateRange === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Verified Gross Revenue
          </span>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {formatKSh(totalRevenue)}
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            {validOrders.length} successful checkouts
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Total Orders in Period
          </span>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {totalOrdersCount}
          </p>
          <span className="text-xs text-slate-500 font-medium mt-1 block">
            Including pending & delivered
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Average Order Value (AOV)
          </span>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {formatKSh(averageOrderValue)}
          </p>
          <span className="text-xs text-cyan-600 font-semibold mt-1 block">
            Mean transaction volume
          </span>
        </div>
      </div>

      {/* Main Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Revenue by Category
            </h3>
            <span className="text-[11px] text-slate-400">Category share</span>
          </div>

          <div className="space-y-3">
            {categorySales.map((cat) => (
              <div key={cat.slug} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{cat.name}</span>
                  <span className="text-slate-900">{formatKSh(cat.revenue)} ({cat.percentage}%)</span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Fulfillment Status Ratio
            </h3>
            <span className="text-[11px] text-slate-400">Pipeline health</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Delivered</span>
              <p className="text-xl font-black text-emerald-900 mt-1">{statusCounts.delivered || 0}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-800 uppercase">Shipped</span>
              <p className="text-xl font-black text-blue-900 mt-1">{statusCounts.shipped || 0}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
              <span className="text-[10px] font-bold text-purple-800 uppercase">Processing</span>
              <p className="text-xl font-black text-purple-900 mt-1">{statusCounts.processing || 0}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Pending</span>
              <p className="text-xl font-black text-amber-900 mt-1">{statusCounts.pending || 0}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
              <span className="text-[10px] font-bold text-red-800 uppercase">Cancelled</span>
              <p className="text-xl font-black text-red-900 mt-1">{statusCounts.cancelled || 0}</p>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Best-Selling Hardware Products
            </h3>
            <span className="text-[11px] text-slate-400">By sales revenue</span>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Checkouts recorded will rank here automatically.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {topProducts.map((item, idx) => (
                <div key={item.product.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-5 font-black text-slate-400">{idx + 1}.</span>
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-200 p-0.5"
                    />
                    <div>
                      <span className="font-extrabold text-slate-900 block">{item.product.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        SKU: {item.product.sku} • {item.qty} units sold
                      </span>
                    </div>
                  </div>

                  <span className="font-black text-slate-900 text-sm">
                    {formatKSh(item.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
