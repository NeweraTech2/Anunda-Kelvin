import React, { useState } from 'react';
import { Category, Product } from '../../types/index.ts';
import {
  Layers,
  Plus,
  Edit2,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AdminCategoriesTabProps {
  categories: Category[];
  products: Product[];
  onCreateCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  onUpdateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  products,
  onCreateCategory,
  onUpdateCategory,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Smartphone');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setName('');
    setSlug('');
    setDescription('');
    setIcon('Smartphone');
    setImageUrl('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800');
    setEditingCategory(null);
    setError(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setIcon(c.icon || 'Smartphone');
    setImageUrl(c.imageUrl || '');
    setError(null);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError('Please provide a name and slug.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingCategory) {
        await onUpdateCategory(editingCategory.id, {
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          icon,
          imageUrl: imageUrl.trim() || undefined,
        });
      } else {
        await onCreateCategory({
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          icon,
          imageUrl: imageUrl.trim() || undefined,
          displayOrder: categories.length + 1,
          active: true,
        });
      }
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Store Taxonomy & Categories ({categories.length})
          </h2>
          <p className="text-xs text-slate-400">
            Structure customer navigation and product classification
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2 px-4 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const productCount = products.filter((p) => p.categoryId === c.slug).length;

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center font-bold text-sm">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{c.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">/{c.slug}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {c.description && (
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900">
                  {productCount} {productCount === 1 ? 'Product' : 'Products'} Listed
                </span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    c.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {c.active ? 'Active' : 'Hidden'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Category'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Smart Watches & Wearables"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. smart-watches"
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary for category landing view..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image Banner URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-slate-950 hover:bg-cyan-600 text-white font-extrabold rounded-xl transition-colors shadow-xs"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Save Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
