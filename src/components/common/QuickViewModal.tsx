import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import { formatKSh } from '../../lib/utils.ts';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, ArrowRight, Check } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist, navigate } = useShop();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleViewFullDetails = () => {
    closeQuickView();
    navigate(`/product/${quickViewProduct.id}`);
  };

  return (
    <div id="quickview-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        id="quickview-modal"
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="close-quickview-btn"
          onClick={closeQuickView}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6">
          {/* Gallery Column */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square w-full bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-100">
              <img
                src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              {quickViewProduct.discountPercentage ? (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  -{quickViewProduct.discountPercentage}% OFF
                </span>
              ) : null}
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    id={`thumb-btn-${idx}`}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg border-2 p-1 bg-slate-50 shrink-0 transition-all ${
                      selectedImage === idx ? 'border-cyan-600 ring-2 ring-cyan-100' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="uppercase tracking-wider text-cyan-600 font-semibold">{quickViewProduct.brand}</span>
                <span>•</span>
                <span>SKU: {quickViewProduct.sku}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-950 leading-tight">
                {quickViewProduct.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {quickViewProduct.rating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">
                  ({quickViewProduct.reviewCount} customer ratings)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-extrabold text-slate-950">
                  {formatKSh(quickViewProduct.price)}
                </span>
                {quickViewProduct.previousPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatKSh(quickViewProduct.previousPrice)}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {quickViewProduct.shortDescription || quickViewProduct.description}
              </p>

              {/* Specs preview */}
              {quickViewProduct.specifications && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                  <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">Highlights:</div>
                  {Object.entries(quickViewProduct.specifications).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-slate-600">
                      <span className="text-slate-500">{key}:</span>
                      <span className="font-medium text-slate-800 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden shrink-0">
                  <button
                    id="quickview-decrease-qty"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-semibold text-slate-900 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    id="quickview-increase-qty"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  id="quickview-add-cart-btn"
                  onClick={handleAddToCart}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 hover:bg-cyan-600 text-white shadow-md active:scale-98'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart • {formatKSh(quickViewProduct.price * quantity)}</span>
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  id="quickview-wishlist-btn"
                  onClick={() => toggleWishlist(quickViewProduct)}
                  aria-label="Wishlist toggle"
                  className={`p-2.5 rounded-lg border flex items-center justify-center transition-colors ${
                    inWishlist
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'border-slate-300 hover:border-red-300 text-slate-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Trust markers */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-cyan-600" />
                  Fast delivery across Kenya
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {quickViewProduct.warranty || 'Official Warranty'}
                </span>
              </div>

              {/* View Full Product Link */}
              <button
                id="view-full-product-page-btn"
                onClick={handleViewFullDetails}
                className="w-full text-center text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center justify-center gap-1 py-1"
              >
                <span>View Full Product Specifications & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
