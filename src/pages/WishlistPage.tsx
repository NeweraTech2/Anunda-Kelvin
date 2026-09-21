import React from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { formatKSh } from '../lib/utils.ts';
import { Product, WishlistItem } from '../types/index.ts';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, addToCart, navigate, showToast } = useShop();

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    showToast({
      type: 'success',
      title: 'Moved to Cart',
      message: `${product.name} moved to your cart.`,
    });
  };

  if (wishlist.length === 0) {
    return (
      <div id="wishlist-empty-view" className="min-h-[70vh] bg-[#F8F9FA] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 max-w-md w-full text-center space-y-5 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Your Wishlist is Empty</h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Save electronics, laptops, and audio gear you love to purchase later or track pricing changes.
            </p>
          </div>
          <button
            id="wishlist-explore-btn"
            onClick={() => navigate('/shop')}
            className="w-full py-3.5 px-6 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="wishlist-page-view" className="bg-[#F8F9FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950">My Saved Wishlist</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved for later
            </p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800"
          >
            Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((item: WishlistItem) => {
            const product = item.product;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between shadow-xs space-y-3"
              >
                <div
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="relative aspect-square w-full rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md text-slate-400 hover:text-red-600 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">
                    {product.brand}
                  </span>
                  <h3
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="text-xs font-bold text-slate-900 hover:text-cyan-600 cursor-pointer line-clamp-2"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-sm font-black text-slate-950">
                      {formatKSh(product.price)}
                    </span>
                    {product.previousPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatKSh(product.previousPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full py-2 px-3 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
