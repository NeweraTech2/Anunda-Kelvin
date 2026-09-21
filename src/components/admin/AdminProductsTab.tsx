import React, { useState, useMemo } from 'react';
import { Product, Category } from '../../types/index.ts';
import { formatKSh } from '../../lib/utils.ts';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Tag,
  Check,
  X,
} from 'lucide-react';

interface AdminProductsTabProps {
  products: Product[];
  categories: Category[];
  onOpenAddModal: () => void;
  onEditProduct: (product: Product) => void;
  onDeactivateProduct: (productId: string) => void;
  onUpdateStock: (productId: string, stock: number) => void;
  onUpdatePrice: (productId: string, price: number) => void;
  onToggleFeatured: (productId: string, featured: boolean) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  categories,
  onOpenAddModal,
  onEditProduct,
  onDeactivateProduct,
  onUpdateStock,
  onUpdatePrice,
  onToggleFeatured,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'stock'>('newest');

  // Inline editing state for quick changes
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockInputVal, setStockInputVal] = useState<number>(0);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceInputVal, setPriceInputVal] = useState<number>(0);

  // Deactivate confirmation modal
  const [productToDeactivate, setProductToDeactivate] = useState<Product | null>(null);

  // Unique brands
  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort();
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchSku) return false;
        }

        // Category
        if (selectedCat !== 'all' && p.categoryId !== selectedCat) {
          return false;
        }

        // Brand
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }

        // Stock status
        if (stockFilter === 'in_stock' && (p.stockQuantity < 5 || !p.active)) return false;
        if (stockFilter === 'low_stock' && (p.stockQuantity >= 5 || p.stockQuantity === 0 || !p.active)) return false;
        if (stockFilter === 'out_of_stock' && (p.stockQuantity > 0 || !p.active)) return false;
        if (stockFilter === 'inactive' && p.active) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'stock') return a.stockQuantity - b.stockQuantity;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, search, selectedCat, selectedBrand, stockFilter, sortBy]);

  const handleSaveStock = (productId: string) => {
    onUpdateStock(productId, stockInputVal);
    setEditingStockId(null);
  };

  const handleSavePrice = (productId: string) => {
    onUpdatePrice(productId, priceInputVal);
    setEditingPriceId(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU or brand..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-cyan-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Brand */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Stock filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (5+ units)</option>
            <option value="low_stock">Low Stock (&lt; 5 units)</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="inactive">Deactivated</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock">Stock Level</option>
          </select>

          <button
            onClick={onOpenAddModal}
            className="py-2 px-4 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-extrabold uppercase tracking-wider text-slate-900">
            Catalog Listing ({filteredProducts.length} Items)
          </span>
          <span className="text-slate-400 font-medium">Click on stock or price to quick-edit</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No matching products found</p>
            <p>Try resetting search filters or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Product & SKU</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Price (KSh)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.stockQuantity < 5 && p.stockQuantity > 0;
                  const isOut = p.stockQuantity === 0;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        !p.active ? 'opacity-60 bg-slate-50/50' : ''
                      }`}
                    >
                      {/* Product & SKU */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800'}
                            alt=""
                            className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-extrabold text-slate-900 block truncate leading-tight">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                              SKU: {p.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-700">{p.brand}</span>
                      </td>

                      {/* Price (Inline Editable) */}
                      <td className="py-3 px-4">
                        {editingPriceId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={priceInputVal}
                              onChange={(e) => setPriceInputVal(Number(e.target.value))}
                              className="w-24 p-1 text-xs border border-cyan-500 rounded font-bold"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSavePrice(p.id)}
                              className="p-1 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="p-1 bg-slate-200 text-slate-600 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingPriceId(p.id);
                              setPriceInputVal(p.price);
                            }}
                            className="font-extrabold text-slate-900 hover:text-cyan-600 hover:underline flex items-center gap-1 group"
                          >
                            <span>{formatKSh(p.price)}</span>
                            <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-slate-400" />
                          </button>
                        )}
                        {p.previousPrice && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            {formatKSh(p.previousPrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock (Inline Editable) */}
                      <td className="py-3 px-4">
                        {editingStockId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={stockInputVal}
                              onChange={(e) => setStockInputVal(Number(e.target.value))}
                              className="w-16 p-1 text-xs border border-cyan-500 rounded font-bold"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveStock(p.id)}
                              className="p-1 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="p-1 bg-slate-200 text-slate-600 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStockId(p.id);
                              setStockInputVal(p.stockQuantity);
                            }}
                            className={`font-black hover:underline flex items-center gap-1 group ${
                              isOut
                                ? 'text-red-600'
                                : isLow
                                ? 'text-amber-600'
                                : 'text-slate-800'
                            }`}
                          >
                            <span>{p.stockQuantity} units</span>
                            <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-slate-400" />
                          </button>
                        )}
                        {isLow && (
                          <span className="text-[9px] font-black text-amber-600 uppercase block">
                            Low Stock
                          </span>
                        )}
                        {isOut && (
                          <span className="text-[9px] font-black text-red-600 uppercase block">
                            Sold Out
                          </span>
                        )}
                      </td>

                      {/* Featured toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onToggleFeatured(p.id, !p.featured)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.featured
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-slate-100 text-slate-400 hover:text-amber-600'
                          }`}
                          title="Toggle Featured placement"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            p.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {p.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {p.active && (
                            <button
                              onClick={() => setProductToDeactivate(p)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Deactivate Product"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deactivate Product Confirmation Modal */}
      {productToDeactivate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">
                Deactivate Product?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to deactivate{' '}
                <strong>{productToDeactivate.name}</strong>? It will be hidden from the
                storefront but preserved for past customer order history.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProductToDeactivate(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeactivateProduct(productToDeactivate.id);
                  setProductToDeactivate(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Deactivate Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
