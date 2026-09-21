import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { productService } from '../services/productService.ts';
import { Product, Category } from '../types/index.ts';
import { ProductCard } from '../components/common/ProductCard.tsx';
import { INITIAL_CATEGORIES } from '../data/mockData.ts';
import { formatKSh } from '../lib/utils.ts';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  PackageOpen,
  Search,
  Sparkles,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { searchQuery, setSearchQuery } = useShop();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'all';
  });

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [priceInputMin, setPriceInputMin] = useState<string>('');
  const [priceInputMax, setPriceInputMax] = useState<string>('');
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('deal') === 'flash';
  });

  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price_asc' | 'price_desc' | 'rating'>(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('sort');
    if (s === 'newest' || s === 'rating' || s === 'price_asc' || s === 'price_desc') return s;
    return 'featured';
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Extract unique brands
  const brands = ['all', 'Apple', 'Samsung', 'Sony', 'Dell', 'Anker', 'Logitech', 'JBL', 'TP-Link', 'Xiaomi', 'HP', 'Lenovo'];

  // Price range quick presets (in KSh)
  const pricePresets = [
    { label: 'Under 10,000', min: undefined, max: 10000 },
    { label: '10,000 - 30,000', min: 10000, max: 30000 },
    { label: '30,000 - 70,000', min: 30000, max: 70000 },
    { label: '70,000 - 150,000', min: 70000, max: 150000 },
    { label: 'Above 150,000', min: 150000, max: undefined },
  ];

  // Load products based on filter changes
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1); // Reset to page 1 on filter alteration
    productService
      .getProducts({
        categorySlug: selectedCategory,
        searchQuery: searchQuery,
        brand: selectedBrand,
        minPrice,
        maxPrice,
        minRating,
        inStockOnly,
        onSaleOnly,
        sortBy,
      })
      .then((res: { products: Product[]; total: number }) => {
        setProducts(res.products);
        setTotalCount(res.total);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery, selectedBrand, minPrice, maxPrice, minRating, inStockOnly, onSaleOnly, sortBy]);

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = priceInputMin.trim() ? Number(priceInputMin.trim()) : undefined;
    const maxVal = priceInputMax.trim() ? Number(priceInputMax.trim()) : undefined;
    setMinPrice(minVal);
    setMaxPrice(maxVal);
  };

  const handleSelectPricePreset = (presetMin?: number, presetMax?: number) => {
    setMinPrice(presetMin);
    setMaxPrice(presetMax);
    setPriceInputMin(presetMin ? String(presetMin) : '');
    setPriceInputMax(presetMax ? String(presetMax) : '');
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPriceInputMin('');
    setPriceInputMax('');
    setMinRating(undefined);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('featured');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    minRating !== undefined ||
    inStockOnly ||
    onSaleOnly ||
    searchQuery !== '';

  // Pagination calculation
  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, products.length);

  return (
    <div id="shop-page-container" className="bg-[#F8F9FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs / Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <span>Home</span>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Shop Catalog</span>
              {selectedCategory !== 'all' && (
                <>
                  <span>/</span>
                  <span className="text-cyan-600 font-semibold capitalize">
                    {selectedCategory.replace('-', ' ')}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing {products.length > 0 ? `${startIdx}–${endIdx} of ${products.length}` : '0'} verified electronics and tech products with Kenyan warranty
            </p>
          </div>

          {/* Sort Control & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-filter-btn"
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-xs"
            >
              <Filter className="w-4 h-4 text-cyan-600" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Sort:</span>
              <select
                id="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 mr-1">Active:</span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                <span>Cat: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                <span>Brand: {selectedBrand}</span>
                <button onClick={() => setSelectedBrand('all')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minPrice !== undefined || maxPrice !== undefined) && (
              <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                <span>
                  Price: {minPrice ? formatKSh(minPrice) : '0'} – {maxPrice ? formatKSh(maxPrice) : 'Max'}
                </span>
                <button
                  onClick={() => {
                    setMinPrice(undefined);
                    setMaxPrice(undefined);
                    setPriceInputMin('');
                    setPriceInputMax('');
                  }}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minRating !== undefined && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                <span>Rating: {minRating}★ & above</span>
                <button onClick={() => setMinRating(undefined)} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onSaleOnly && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg font-semibold">
                <span>Deals Only</span>
                <button onClick={() => setOnSaleOnly(false)} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg font-semibold">
                <span>In Stock Only</span>
                <button onClick={() => setInStockOnly(false)} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 text-xs bg-cyan-100 text-cyan-900 px-2.5 py-1 rounded-lg font-semibold">
                <span>Keyword: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              id="reset-all-filters-btn"
              onClick={handleResetFilters}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-600" />
                <span>Filter Products</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-slate-500 hover:text-red-600"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Categories
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Categories
                </button>
                {INITIAL_CATEGORIES.map((cat: Category) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-slate-900 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70">{cat.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Brand
              </h4>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                      selectedBrand === b
                        ? 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b === 'all' ? 'All Brands' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Price Range (KSh)
              </h4>

              {/* Presets */}
              <div className="space-y-1">
                {pricePresets.map((p, idx) => {
                  const isSelected = minPrice === p.min && maxPrice === p.max;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPricePreset(p.min, p.max)}
                      className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                        isSelected
                          ? 'bg-cyan-100 text-cyan-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Min / Max inputs */}
              <form onSubmit={handleApplyCustomPrice} className="pt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min KSh"
                    value={priceInputMin}
                    onChange={(e) => setPriceInputMin(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:border-cyan-500 focus:outline-hidden"
                  />
                  <input
                    type="number"
                    placeholder="Max KSh"
                    value={priceInputMax}
                    onChange={(e) => setPriceInputMax(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:border-cyan-500 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-slate-900 hover:bg-cyan-600 text-white rounded text-xs font-semibold transition-colors"
                >
                  Apply Price
                </button>
              </form>
            </div>

            {/* Customer Rating Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Customer Rating
              </h4>
              <div className="space-y-1">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setMinRating(minRating === stars ? undefined : stars)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      minRating === stars
                        ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < stars ? 'fill-current' : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="text-slate-700 ml-1 font-semibold">{stars}★ & above</span>
                    </div>
                    {minRating === stars && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Toggles */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Special Offers & Stock
              </h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>Discounted Deals Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-slate-200" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div id="shop-empty-state" className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Matching Products Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find products matching your current filters. Try changing your search query or clearing some filters.
                </p>
                <button
                  id="empty-reset-filters-btn"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-cyan-600 transition-colors shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors ${
                              currentPage === pageNum
                                ? 'bg-slate-950 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Mobile Filter Slide-out Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-600" />
                <span>Filters & Sorting</span>
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="p-4 flex-1 overflow-y-auto space-y-5 text-xs">
              {/* Category */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                      selectedCategory === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {INITIAL_CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs flex justify-between ${
                        selectedCategory === c.slug ? 'bg-slate-900 text-white font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="opacity-60">{c.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-2">Brand</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`px-2 py-1 rounded text-xs text-center border capitalize ${
                        selectedBrand === b
                          ? 'border-cyan-600 bg-cyan-50 text-cyan-900 font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {b === 'all' ? 'All' : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-2">Price Range (KSh)</h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceInputMin}
                    onChange={(e) => setPriceInputMin(e.target.value)}
                    className="p-1.5 border border-slate-300 rounded text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceInputMax}
                    onChange={(e) => setPriceInputMax(e.target.value)}
                    className="p-1.5 border border-slate-300 rounded text-xs"
                  />
                </div>
                <button
                  onClick={handleApplyCustomPrice}
                  className="w-full py-1.5 bg-slate-900 text-white rounded text-xs font-semibold"
                >
                  Apply Price
                </button>
              </div>

              {/* Rating */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-2">Customer Rating</h4>
                <div className="space-y-1">
                  {[4, 3].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(minRating === r ? undefined : r)}
                      className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between ${
                        minRating === r ? 'bg-amber-100 font-bold text-amber-900' : 'text-slate-700'
                      }`}
                    >
                      <span>{r}★ & above</span>
                      {minRating === r && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-cyan-600"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                    className="rounded text-cyan-600"
                  />
                  <span>Discounted Deals Only</span>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold"
              >
                Show {products.length} Products
              </button>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="w-full py-1.5 text-xs text-red-600 font-semibold"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
