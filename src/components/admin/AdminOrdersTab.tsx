import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../../types/index.ts';
import { formatKSh } from '../../lib/utils.ts';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface AdminOrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  onUpdateTrackingNumber: (orderId: string, tracking: string) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onUpdateTrackingNumber,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchNumber = o.orderNumber.toLowerCase().includes(q);
        const matchName = o.customerName.toLowerCase().includes(q);
        const matchPhone = o.customerPhone.toLowerCase().includes(q);
        const matchReceipt = o.mpesaReceiptNumber?.toLowerCase().includes(q);
        if (!matchNumber && !matchName && !matchPhone && !matchReceipt) return false;
      }

      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) return false;

      return true;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const handleOpenOrder = (ord: Order) => {
    setSelectedOrder(ord);
    setTrackingInput(ord.trackingNumber || '');
  };

  const handleSaveTracking = (orderId: string) => {
    if (trackingInput.trim()) {
      onUpdateTrackingNumber(orderId, trackingInput.trim());
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, trackingNumber: trackingInput.trim() });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, phone or M-Pesa receipt..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-cyan-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs">
          {/* Order Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Payment Status */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Payment States</option>
            <option value="paid">Paid</option>
            <option value="pending">Payment Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-extrabold uppercase tracking-wider text-slate-900">
            Fulfillment Queue ({filteredOrders.length} Orders)
          </span>
          <span className="text-slate-400 font-medium">Click on any row to open dispatch dossier</span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No matching orders located</p>
            <p>Try clearing filters or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Contact</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment Method & Status</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => handleOpenOrder(ord)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-slate-900 block">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 block">{ord.customerName}</span>
                      <span className="text-[10px] text-slate-500">{ord.customerPhone}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700">
                        {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-black text-slate-900">{formatKSh(ord.total)}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold uppercase text-[10px] text-slate-600">
                          {ord.paymentMethod === 'mpesa'
                            ? 'M-PESA'
                            : ord.paymentMethod === 'cash_on_delivery'
                            ? 'COD'
                            : ord.paymentMethod}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>
                      {ord.mpesaReceiptNumber && (
                        <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                          Ref: {ord.mpesaReceiptNumber}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'processing'
                            ? 'bg-purple-100 text-purple-800'
                            : ord.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenOrder(ord);
                        }}
                        className="py-1 px-2.5 bg-slate-100 hover:bg-cyan-600 hover:text-white text-slate-700 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Top header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600">
                  Order Fulfillment Dossier
                </span>
                <h2 className="text-xl font-black text-slate-950">#{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-slate-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Workflow Controls */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Update Order Workflow</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as OrderStatus;
                    onUpdateOrderStatus(selectedOrder.id, newStatus);
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                  }}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="pending">PENDING (Awaiting Review)</option>
                  <option value="processing">PROCESSING (Packaging in Warehouse)</option>
                  <option value="shipped">SHIPPED (Handed to Courier)</option>
                  <option value="delivered">DELIVERED (Customer Handover Complete)</option>
                  <option value="cancelled">CANCELLED</option>
                  <option value="returned">RETURNED</option>
                  <option value="refunded">REFUNDED</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Verification</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => {
                    const newPay = e.target.value as PaymentStatus;
                    onUpdatePaymentStatus(selectedOrder.id, newPay);
                    setSelectedOrder({ ...selectedOrder, paymentStatus: newPay });
                  }}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="paid">PAID (Settlement Verified)</option>
                  <option value="pending">PENDING (Awaiting Payment)</option>
                  <option value="failed">FAILED</option>
                  <option value="refunded">REFUNDED</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                <label className="block font-bold text-slate-700 mb-1">
                  Fargo / Speedaf Courier Tracking Reference
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="e.g. FRG-NBO-84920"
                    className="flex-1 p-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:border-cyan-500 focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleSaveTracking(selectedOrder.id)}
                    className="px-4 py-2 bg-slate-950 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Save Tracking
                  </button>
                </div>
              </div>
            </div>

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-extrabold uppercase text-[10px] text-slate-400 block tracking-wider">
                  Customer Contacts
                </span>
                <p className="font-extrabold text-slate-900 text-sm">{selectedOrder.customerName}</p>
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.customerPhone}</span>
                </p>
                {selectedOrder.customerEmail && (
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedOrder.customerEmail}</span>
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-extrabold uppercase text-[10px] text-slate-400 block tracking-wider">
                  Delivery Destination
                </span>
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>
                    {selectedOrder.shippingAddress.county}, {selectedOrder.shippingAddress.city}
                  </span>
                </p>
                <p className="text-slate-600">{selectedOrder.shippingAddress.streetAddress}</p>
                {selectedOrder.shippingAddress.deliveryNotes && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-1">
                    Note: {selectedOrder.shippingAddress.deliveryNotes}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-2">
              <span className="font-extrabold uppercase text-[10px] text-slate-400 block tracking-wider">
                Order Items ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.productImage}
                        alt=""
                        className="w-10 h-10 object-contain rounded bg-slate-50 border border-slate-200 p-0.5"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{it.productName}</span>
                        <span className="text-[10px] text-slate-400">
                          Qty: {it.quantity} × {formatKSh(it.price)}
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">
                      {formatKSh(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>{formatKSh(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping Tariff:</span>
                <span>{formatKSh(selectedOrder.shippingFee)}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-{formatKSh(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-950 font-black text-sm pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span>{formatKSh(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
