import React, { useState } from 'react';
import { Product } from '../../types/index.ts';
import { formatKSh } from '../../lib/utils.ts';
import { useShop } from '../../context/ShopContext.tsx';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showStockBar?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showStockBar = false }) => {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView, navigate } = useShop();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discount = product.discountPercentage || 0;
  const hasMultipleImages = product.images.length > 1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Stock indicator calculation
  const stockRatio = Math.min(100, Math.max(15, (product.stockQuantity / 30) * 100));

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => {
        setIsHovered(true);
        if (hasMultipleImages) setCurrentImgIndex(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImgIndex(0);
      }}
      className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-cyan-500/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer h-full"
    >
      {/* Badges Bar */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {discount > 0 && (
          <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs tracking-tight">
            -{discount}%
          </span>
        )}
        {product.isFlashDeal && (
          <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-xs tracking-wider">
            Deal
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-cyan-600 text-white text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded tracking-wider">
            New
          </span>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs ${
            inWishlist
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-white/90 hover:bg-white text-slate-600 hover:text-red-500 border border-slate-200/70'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        <button
          id={`quickview-btn-${product.id}`}
          onClick={handleQuickView}
          aria-label="Quick view product details"
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-cyan-600 border border-slate-200/70 flex items-center justify-center transition-colors shadow-xs opacity-0 group-hover:opacity-100 sm:flex hidden"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.images[currentImgIndex] || product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />

        {product.stockQuantity <= 3 && product.stockQuantity > 0 && (
          <div className="absolute bottom-2 left-2 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
            Only {product.stockQuantity} left!
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="uppercase tracking-wider text-slate-400">{product.brand}</span>
            {product.categoryName && (
              <span className="truncate max-w-[120px]">{product.categoryName}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Stock progress for deals */}
        {showStockBar && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] font-medium text-slate-500">
              <span>Stock: {product.stockQuantity} available</span>
              <span className="text-cyan-700 font-semibold">Fast selling</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${stockRatio}%` }}
              />
            </div>
          </div>
        )}

        {/* Pricing & Add to Cart button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-950 tracking-tight">
              {formatKSh(product.price)}
            </span>
            {product.previousPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatKSh(product.previousPrice)}
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            disabled={product.stockQuantity === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
              product.stockQuantity === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-cyan-600 text-white active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
