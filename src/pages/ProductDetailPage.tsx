import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { productService } from '../services/productService.ts';
import { reviewService } from '../services/reviewService.ts';
import { Product, Review } from '../types/index.ts';
import { formatKSh } from '../lib/utils.ts';
import { ProductCard } from '../components/common/ProductCard.tsx';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Share2,
  Package,
  Clock,
  Phone,
  Maximize2,
  X,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

interface ProductDetailPageProps {
  productId?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { currentPath, addToCart, toggleWishlist, isInWishlist, navigate, showToast, user } = useShop();

  // Extract ID from prop or URL
  const targetId = productId || currentPath.split('/product/')[1] || 'prod-01';

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'delivery' | 'reviews'>('specs');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState(user?.fullName || '');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    productService.getProductById(targetId).then((prod: Product | null) => {
      setProduct(prod);
      if (prod) {
        productService.getProducts({ categorySlug: prod.categoryId }).then((res: { products: Product[]; total: number }) => {
          setRelatedProducts(res.products.filter((p: Product) => p.id !== prod.id).slice(0, 4));
        });
      }
      setLoading(false);
    });

    // Load reviews
    setReviewsLoading(true);
    reviewService.getProductReviews(targetId).then((revs) => {
      setReviews(revs);
      setReviewsLoading(false);
    });
  }, [targetId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Loading Product Specifications...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for may have been archived or is out of stock.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-cyan-600 transition-colors"
        >
          Return to Shop Catalog
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stockQuantity === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on NewEra Shop Kenya`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Product link copied to clipboard.',
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      showToast({
        type: 'error',
        title: 'Incomplete Review',
        message: 'Please provide your name and review feedback.',
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const created = await reviewService.submitReview({
        productId: product.id,
        userName: newReviewName.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        verifiedPurchase: true,
      });

      setReviews([created, ...reviews]);
      setShowReviewForm(false);
      setNewReviewComment('');
      showToast({
        type: 'success',
        title: 'Review Submitted',
        message: 'Thank you! Your verified feedback has been published.',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Failed to submit review',
        message: err.message || 'Please try again later.',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div id="product-detail-view" className="bg-[#F8F9FA] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('/')} className="hover:text-cyan-600">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigate('/shop')} className="hover:text-cyan-600">
            Shop
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden group">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                />

                {/* Zoom button overlay */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  aria-label="Enlarge image"
                  className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-xs rounded-xl shadow-md text-slate-700 hover:text-cyan-600 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {product.discountPercentage ? (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-xs">
                    -{product.discountPercentage}% OFF
                  </span>
                ) : null}

                {product.isFlashDeal && (
                  <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md shadow-xs">
                    FLASH DEAL
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      id={`gallery-thumb-${idx}`}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-xl border-2 p-1.5 bg-slate-50 shrink-0 transition-all ${
                        selectedImage === idx
                          ? 'border-cyan-600 ring-2 ring-cyan-100'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info & Purchase Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & Action Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md">
                      {product.brand}
                    </span>
                    <span className="text-xs text-slate-400">SKU: {product.sku}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      aria-label="Share product"
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      aria-label="Save to Wishlist"
                      className={`p-2 rounded-lg border transition-colors ${
                        inWishlist
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Dynamic Stock Status */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-800">{product.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({reviews.length || product.reviewCount} customer reviews)</span>
                  </div>

                  <span className="text-slate-300">|</span>

                  {product.stockQuantity > 5 ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>In Stock ({product.stockQuantity} units in Nairobi Hub)</span>
                    </span>
                  ) : product.stockQuantity > 0 ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>Hurry! Only {product.stockQuantity} units left!</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>Out of Stock (Backorder available)</span>
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-baseline gap-4">
                  <span className="text-3xl font-black text-slate-950">
                    {formatKSh(product.price)}
                  </span>
                  {product.previousPrice && (
                    <span className="text-base text-slate-400 line-through">
                      {formatKSh(product.previousPrice)}
                    </span>
                  )}
                  {product.discountPercentage ? (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                      You save {formatKSh(product.previousPrice! - product.price)}
                    </span>
                  ) : null}
                </div>

                {/* Short Overview */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Highlights Specs Chips */}
                {product.specifications && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                    {Object.entries(product.specifications).slice(0, 6).map(([key, val]) => (
                      <div key={key} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">{key}</span>
                        <span className="font-bold text-slate-800 truncate block">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity, Add to Cart & Buy Now Section */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden shrink-0 self-start sm:self-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="px-4 py-3 text-sm font-bold text-slate-900 min-w-[44px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      disabled={isOutOfStock || quantity >= product.stockQuantity}
                      className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    id="product-page-add-cart-btn"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-950 hover:bg-cyan-600 text-white'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : isOutOfStock ? (
                      <span>Out of Stock</span>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  {/* Buy Now button */}
                  <button
                    id="product-page-buy-now-btn"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Delivery & Warranty Guarantees */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-start gap-2 text-slate-600">
                    <Truck className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Nairobi Delivery</span>
                      <span className="text-[11px] text-slate-500">Same-day within CBD / 24h</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Official Warranty</span>
                      <span className="text-[11px] text-slate-500">{product.warranty || '1 Year Authorized'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600">
                    <RotateCcw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">7-Day Guarantee</span>
                      <span className="text-[11px] text-slate-500">Free return replacement</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specs / Description / Delivery / Reviews */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="flex border-b border-slate-200 px-6 gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-cyan-600 text-cyan-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Full Specifications
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-cyan-600 text-cyan-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Detailed Overview
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'delivery'
                  ? 'border-cyan-600 text-cyan-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Delivery & Payments
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-cyan-600 text-cyan-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'specs' && product.specifications && (
              <div className="max-w-3xl space-y-3">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Technical Details</h3>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 p-3.5 text-xs">
                      <span className="font-semibold text-slate-500">{key}</span>
                      <span className="col-span-2 font-medium text-slate-900">{String(val)}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 p-3.5 text-xs bg-slate-50">
                    <span className="font-semibold text-slate-500">Warranty</span>
                    <span className="col-span-2 font-medium text-slate-900">{product.warranty}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'desc' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>{product.description}</p>
                <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-100 text-xs text-cyan-950 space-y-2">
                  <h4 className="font-bold text-cyan-900">Official NewEra Shop Guarantee:</h4>
                  <p>
                    Every unit shipped from NewEra Shop is inspected for authentic seal integrity, correct regional electrical compliance, and manufacturer packaging.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h4 className="font-bold text-slate-900">Delivery Timelines:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                  <li><strong>Nairobi Region:</strong> Same-day delivery for orders confirmed by 2:00 PM. Flat rate KSh 350 (Free for orders over KSh 50,000).</li>
                  <li><strong>Mombasa, Kisumu, Nakuru, Eldoret:</strong> Next-day delivery via Fargo Courier & G4S.</li>
                  <li><strong>Countrywide Towns:</strong> 24–48 hours insured parcel transit.</li>
                </ul>

                <h4 className="font-bold text-slate-900 pt-3">Supported Payment Channels:</h4>
                <p className="text-xs text-slate-600">
                  Lipa na M-Pesa (Till / Paybill), Visa, Mastercard, Bank Wire Transfer, and Cash on Delivery for eligible items within Nairobi.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-center sm:text-left">
                    <span className="text-4xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
                    <div className="flex items-center text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">Based on {reviews.length} verified reviews</span>
                  </div>

                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Write a Customer Review</span>
                  </button>
                </div>

                {/* Write a Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="p-5 bg-white rounded-xl border border-cyan-200 shadow-sm space-y-4">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Leave Verified Feedback</h4>

                    {/* Star selection */}
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Your Rating:</label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= newReviewRating ? 'fill-current' : 'text-slate-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          placeholder="e.g. Kelvin Anunda"
                          className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:border-cyan-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Your Review</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Share your experience with build quality, battery life, performance, and delivery..."
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-cyan-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviewsLoading ? (
                    <div className="p-8 text-center text-xs text-slate-400">Loading reviews...</div>
                  ) : reviews.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500">
                      No reviews yet for this item. Be the first to share your experience!
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-white space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-[11px]">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-current' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <h3 className="text-xl font-bold text-slate-950">You May Also Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Image Viewer Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close image viewer"
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-3xl max-h-[80vh] flex flex-col items-center">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="max-h-[70vh] object-contain rounded-xl"
            />
            <p className="text-white text-xs mt-4 font-semibold text-center">{product.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};
