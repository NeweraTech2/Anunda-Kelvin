import React, { useState } from 'react';
import { Review, Product } from '../../types/index.ts';
import {
  Star,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';

interface AdminReviewsTabProps {
  reviews: Review[];
  products: Product[];
  onDeleteReview: (id: string) => Promise<void>;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({
  reviews,
  products,
  onDeleteReview,
}) => {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  const filtered = reviews.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchComment = r.comment.toLowerCase().includes(q);
      const matchUser = r.userName.toLowerCase().includes(q);
      if (!matchComment && !matchUser) return false;
    }
    if (ratingFilter !== 'all' && r.rating !== ratingFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by comment or customer name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-cyan-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <select
            value={ratingFilter}
            onChange={(e) =>
              setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-extrabold uppercase tracking-wider text-slate-900">
            Customer Feedback Queue ({filtered.length} Reviews)
          </span>
          <span className="text-slate-400 font-medium">Moderate or remove inappropriate ratings</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-1">
            <Star className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No customer reviews located</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((r) => {
              const product = products.find((p) => p.id === r.productId);

              return (
                <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating ? 'fill-current' : 'text-slate-200 fill-transparent'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-black text-slate-900">{r.userName}</span>
                      {r.verifiedPurchase && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      "{r.comment}"
                    </p>

                    {product && (
                      <p className="text-[10px] text-slate-400 font-medium">
                        Product: <strong className="text-slate-600">{product.name}</strong> (SKU: {product.sku})
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteReview(r.id)}
                    className="self-end sm:self-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    title="Remove Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
