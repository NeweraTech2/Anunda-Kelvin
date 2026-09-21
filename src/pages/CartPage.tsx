import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { formatKSh } from '../lib/utils.ts';
import { CartItem } from '../types/index.ts';
import {
  Trash2,
  Heart,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Tag,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal, toggleWishlist, navigate, showToast } =
    useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const deliveryFee = cartTotal > 50000 || cart.length === 0 ? 0 : 350;
  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const grandTotal = Math.max(0, cartTotal - discountAmount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NEWERA10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      showToast({
        type: 'success',
        title: 'Coupon Applied!',
        message: '10% discount deducted from your order.',
      });
    } else if (promoCode.trim().toUpperCase() === 'KARIBU5') {
      setDiscountPercent(5);
      setPromoApplied(true);
      showToast({
        type: 'success',
        title: 'Welcome Coupon Applied!',
        message: '5% discount deducted from your order.',
      });
    } else {
      showToast({
        type: 'error',
        title: 'Invalid Coupon',
        message: 'Try code "NEWERA10" for 10% off.',
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div id="cart-empty-view" className="min-h-[70vh] bg-[#F8F9FA] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 max-w-md w-full text-center space-y-5 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Looks like you haven't added any tech items to your shopping cart yet. Discover flagship smartphones, audio gear, and laptops now.
            </p>
          </div>
          <button
            id="cart-empty-explore-btn"
            onClick={() => navigate('/shop')}
            className="w-full py-3.5 px-6 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-page-view" className="bg-[#F8F9FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950">Shopping Cart</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your items and proceed to secure checkout ({cart.length} item{cart.length > 1 ? 's' : ''})
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            {cart.map((item: CartItem) => (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xs"
              >
                {/* Image */}
                <div
                  onClick={() => navigate(`/product/${item.product.id}`)}
                  className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-100 p-2 shrink-0 flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    <span className="text-cyan-700">{item.product.brand}</span>
                    <span>•</span>
                    <span>SKU: {item.product.sku}</span>
                  </div>
                  <h3
                    onClick={() => navigate(`/product/${item.product.id}`)}
                    className="text-sm font-bold text-slate-900 hover:text-cyan-600 cursor-pointer line-clamp-1 mt-0.5"
                  >
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-black text-slate-950">
                      {formatKSh(item.product.price)}
                    </span>
                    {item.product.previousPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatKSh(item.product.previousPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-900 min-w-[32px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right shrink-0 min-w-[90px] hidden sm:block">
                  <span className="text-sm font-extrabold text-slate-950 block">
                    {formatKSh(item.product.price * item.quantity)}
                  </span>
                  <span className="text-[10px] text-slate-400">Total</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => toggleWishlist(item.product)}
                    title="Save to wishlist"
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    title="Remove item"
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Back to shop */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/shop')}
                className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1.5"
              >
                <span>← Continue Shopping</span>
              </button>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
              <h2 className="text-base font-extrabold text-slate-950 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Promo code */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600 block">
                  Have a Promo Code or Voucher?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. NEWERA10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg uppercase font-mono focus:outline-hidden focus:border-cyan-500"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-900 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <span className="text-[10px] text-emerald-600 font-bold block">
                    ✓ Promo applied: {discountPercent}% discount
                  </span>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatKSh(cartTotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatKSh(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <div className="flex items-center gap-1">
                    <span>Courier Delivery</span>
                    {deliveryFee === 0 && (
                      <span className="text-[10px] text-cyan-600 font-bold bg-cyan-50 px-1.5 py-0.5 rounded">
                        FREE
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-900">
                    {deliveryFee === 0 ? 'KSh 0' : formatKSh(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-slate-950 pt-3 border-t border-slate-200">
                  <span>Total Due</span>
                  <span className="text-cyan-700">{formatKSh(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-6 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust markers */}
              <div className="space-y-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Secure Lipa Na M-Pesa & Card Transaction</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Nairobi Express Dispatch / 47 Counties</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>7-Day Replacement Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
