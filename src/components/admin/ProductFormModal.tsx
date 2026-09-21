import React, { useState } from 'react';
import { Product, Category } from '../../types/index.ts';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Upload,
} from 'lucide-react';

interface ProductFormModalProps {
  product?: Product | null; // if null, we are creating a new product
  categories: Category[];
  onClose: () => void;
  onSave: (productData: Partial<Product> & { name: string; price: number }) => Promise<void>;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [sku, setSku] = useState(product?.sku || `SKU-${Date.now().toString().slice(-6)}`);
  const [brand, setBrand] = useState(product?.brand || 'Apple');
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.slug || 'phones-tablets');
  const [price, setPrice] = useState<number>(product?.price || 49999);
  const [previousPrice, setPreviousPrice] = useState<number | undefined>(product?.previousPrice);
  const [stockQuantity, setStockQuantity] = useState<number>(product?.stockQuantity ?? 15);
  const [description, setDescription] = useState(product?.description || '');
  const [warranty, setWarranty] = useState(product?.warranty || '1 Year Authorized Kenyan Warranty');
  const [featured, setFeatured] = useState<boolean>(product?.featured ?? true);
  const [active, setActive] = useState<boolean>(product?.active ?? true);
  const [isFlashDeal, setIsFlashDeal] = useState<boolean>(product?.isFlashDeal ?? false);

  // Images list
  const [images, setImages] = useState<string[]>(
    product?.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800']
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Specs key-values
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    product?.specifications
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      : [
          { key: 'Warranty', value: '1 Year Authorized Kenyan Warranty' },
          { key: 'Condition', value: 'Brand New In Box' },
        ]
  );
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecs([...specs, { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a product title.');
      return;
    }
    if (price <= 0) {
      setError('Price must be greater than zero.');
      return;
    }

    setSaving(true);
    setError(null);

    // Convert specs to Record<string, string>
    const specificationsObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key && s.value) {
        specificationsObj[s.key] = s.value;
      }
    });

    const discountPercentage =
      previousPrice && previousPrice > price
        ? Math.round(((previousPrice - price) / previousPrice) * 100)
        : undefined;

    try {
      await onSave({
        ...(product ? { id: product.id } : {}),
        name: name.trim(),
        sku: sku.trim(),
        brand: brand.trim(),
        categoryId,
        price: Number(price),
        previousPrice: previousPrice ? Number(previousPrice) : undefined,
        discountPercentage,
        stockQuantity: Number(stockQuantity),
        description: description.trim() || `${name} official Kenya edition`,
        warranty: warranty.trim(),
        featured,
        active,
        isFlashDeal,
        images,
        specifications: specificationsObj,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
              {isEditing ? `Edit Product: ${product?.name}` : 'Add New Catalog Product'}
            </h2>
            <p className="text-xs text-slate-400">
              Provide accurate technical specs, pricing and Kenya stock quantities
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h3 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500">
              1. Basic Product Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SKU Code *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Sony, Apple, Samsung"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500">
              2. Pricing & Stock Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Selling Price (KSh) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Previous Price (Optional KSh)
                </label>
                <input
                  type="number"
                  min="0"
                  value={previousPrice || ''}
                  onChange={(e) => setPreviousPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 54999"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Available Warehouse Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Product Description & Warranty */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500">
              3. Description & Warranty
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key selling points, build quality, included components..."
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Warranty Details</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="e.g. 2 Years Authorized Manufacturer Warranty"
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 4: Image Management */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500">
                4. Product Images ({images.length})
              </h3>
              <span className="text-[10px] text-slate-400">First image is primary thumbnail</span>
            </div>

            {/* Thumbnail previews */}
            <div className="flex items-center gap-3 overflow-x-auto py-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative group w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 p-1 shrink-0 flex items-center justify-center"
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 right-1 bg-slate-900/80 text-[8px] text-white text-center rounded py-0.5 font-bold">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add Image URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="flex-1 p-2 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image</span>
              </button>
            </div>
          </div>

          {/* Section 5: Technical Specifications */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500">
              5. Key Technical Specifications
            </h3>

            <div className="space-y-2">
              {specs.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1/3 p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700">
                    {s.key}
                  </span>
                  <span className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                    {s.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                placeholder="Spec Name (e.g. Battery Life)"
                className="w-1/3 p-2 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
              />
              <input
                type="text"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="Spec Value (e.g. Up to 30 Hours)"
                className="flex-1 p-2 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Add Spec
              </button>
            </div>
          </div>

          {/* Section 6: Visibility & Badges */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500">
              6. Visibility & Promotion Flags
            </h3>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="font-semibold text-slate-800">Active (Visible on Storefront)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="font-semibold text-slate-800">Featured On Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFlashDeal}
                  onChange={(e) => setIsFlashDeal(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="font-semibold text-slate-800">Flash Sale Campaign</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-slate-950 hover:bg-cyan-600 text-white font-extrabold rounded-xl transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
