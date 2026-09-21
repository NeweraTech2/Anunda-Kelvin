import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { formatKSh } from '../lib/utils.ts';
import { Order } from '../types/index.ts';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders, navigate, openHelp } = useShop();
  const [searchOrderNo, setSearchOrderNo] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(orders[0] || null);

  const filteredOrders = searchOrderNo.trim()
    ? orders.filter(
        (o: Order) =>
          o.orderNumber.toLowerCase().includes(searchOrderNo.trim().toLowerCase()) ||
          o.customerPhone.includes(searchOrderNo.trim())
      )
    : orders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div id="orders-tracking-page" className="bg-[#F8F9FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950">Track Your Orders</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time dispatch updates for Nairobi same-day and countrywide courier deliveries
            </p>
          </div>

          {/* Search order by number */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by order # or phone..."
              value={searchOrderNo}
              onChange={(e) => setSearchOrderNo(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:border-cyan-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">No Orders Yet</h2>
            <p className="text-xs text-slate-500">
              When you place an order, you can track courier dispatch, parcel transit, and delivery progress here.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Orders list (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Recent Orders ({filteredOrders.length})
              </h2>

              {filteredOrders.map((ord: Order) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                    selectedOrder?.id === ord.id
                      ? 'border-cyan-500 ring-2 ring-cyan-100 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-950">#{ord.orderNumber}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(
                        ord.status
                      )}`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1 mb-1">
                    {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                    <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                    <span className="font-extrabold text-slate-900">{formatKSh(ord.total)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Order Details (7 cols) */}
            <div className="lg:col-span-7">
              {selectedOrder ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">
                        Tracking Status
                      </span>
                      <h3 className="text-xl font-black text-slate-950 mt-0.5">
                        Order #{selectedOrder.orderNumber}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border self-start sm:self-auto ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      Status: {selectedOrder.status}
                    </span>
                  </div>

                  {/* Step Timeline */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="space-y-1.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
                          ✓
                        </div>
                        <span className="text-[11px] font-bold text-slate-900 block">Placed</span>
                      </div>

                      <div className="space-y-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            selectedOrder.status !== 'pending'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {selectedOrder.status !== 'pending' ? '✓' : '2'}
                        </div>
                        <span className="text-[11px] font-bold text-slate-900 block">Packed</span>
                      </div>

                      <div className="space-y-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {selectedOrder.status === 'delivered' ? '✓' : '3'}
                        </div>
                        <span className="text-[11px] font-bold text-slate-900 block">In Transit</span>
                      </div>

                      <div className="space-y-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            selectedOrder.status === 'delivered'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          4
                        </div>
                        <span className="text-[11px] font-bold text-slate-900 block">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Destination & Payment Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Destination</span>
                      <p className="font-semibold text-slate-900">
                        {selectedOrder.shippingAddress?.fullName}
                      </p>
                      <p className="text-slate-600">
                        {selectedOrder.shippingAddress?.streetAddress}, {selectedOrder.shippingAddress?.city || selectedOrder.shippingAddress?.area}
                      </p>
                      <p className="text-slate-600">{selectedOrder.shippingAddress?.county} County</p>
                      <p className="text-cyan-700 font-medium">{selectedOrder.customerPhone}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Payment & Carrier</span>
                      <p className="font-semibold text-slate-900">{selectedOrder.paymentMethod}</p>
                      <p className="text-emerald-700 font-semibold">Payment Status: {selectedOrder.paymentStatus}</p>
                      <p className="text-slate-600">Dispatch Hub: Nairobi Central Fulfillment</p>
                    </div>
                  </div>

                  {/* Ordered Items */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Package Contents
                    </h4>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                      {selectedOrder.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 text-xs bg-white">
                          <div className="flex items-center gap-3">
                            <img
                              src={it.product?.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=200'}
                              alt=""
                              className="w-10 h-10 object-contain rounded bg-slate-50 border border-slate-100 p-1"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{it.product?.name}</p>
                              <p className="text-[11px] text-slate-500">Quantity: {it.quantity}</p>
                            </div>
                          </div>
                          <span className="font-extrabold text-slate-900">
                            {formatKSh(it.unitPrice * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Need Help Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Need help with this shipment?</span>
                    <button
                      onClick={() => openHelp('order')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-xs font-bold transition-colors"
                    >
                      Inquire on Order #{selectedOrder.orderNumber}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-500 text-xs">
                  Select an order on the left to view tracking status.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
