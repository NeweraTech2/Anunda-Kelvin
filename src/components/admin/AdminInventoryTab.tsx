import React, { useState, useMemo } from 'react';
import { Product } from '../../types/index.ts';
import {
  Boxes,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  RefreshCw,
  ArrowUpDown,
} from 'lucide-react';

interface AdminInventoryTabProps {
  products: Product[];
  lowStockThreshold: number;
  onUpdateStock: (productId: string, newStock: number) => void;
}

export const AdminInventoryTab: React.FC<AdminInventoryTabProps> = ({
  products,
  lowStockThreshold,
  onUpdateStock,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out' | 'healthy'>('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.sku.toLowerCase().includes(q) &&
          !p.brand.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      const isOut = p.stockQuantity === 0;
      const isLow = p.stockQuantity > 0 && p.stockQuantity <= lowStockThreshold;
      const isHealthy = p.stockQuantity > lowStockThreshold;

      if (filter === 'low' && !isLow) return false;
      if (filter === 'out' && !isOut) return false;
      if (filter === 'healthy' && !isHealthy) return false;

      return true;
    });
  }, [products, search, filter, lowStockThreshold]);

  const stats = useMemo(() => {
    const totalUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);
    const lowCount = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= lowStockThreshold).length;
    const outCount = products.filter((p) => p.stockQuantity === 0).length;
    const healthyCount = products.filter((p) => p.stockQuantity > lowStockThreshold).length;
    return { totalUnits, lowCount, outCount, healthyCount };
  }, [products, lowStockThreshold]);

  return (
    <div className="space-y-4">
      {/* 4 Inventory Health Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Total Warehouse Units
          </span>
          <p className="text-xl font-black text-slate-900 mt-1">{stats.totalUnits} items</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Across {products.length} SKUs</span>
        </div>

        <div
          onClick={() => setFilter('healthy')}
          className={`p-4 rounded-2xl border shadow-xs cursor-pointer transition-colors ${
            filter === 'healthy' ? 'border-emerald-500 bg-emerald-50/30' : 'bg-white border-slate-200/80'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
            Healthy Stock
          </span>
          <p className="text-xl font-black text-emerald-800 mt-1">{stats.healthyCount} SKUs</p>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">&gt; {lowStockThreshold} units available</span>
        </div>

        <div
          onClick={() => setFilter('low')}
          className={`p-4 rounded-2xl border shadow-xs cursor-pointer transition-colors ${
            filter === 'low' ? 'border-amber-500 bg-amber-50/30' : 'bg-white border-slate-200/80'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
            Low Stock Alerts
          </span>
          <p className="text-xl font-black text-amber-800 mt-1">{stats.lowCount} SKUs</p>
          <span className="text-[11px] text-amber-600 mt-0.5 block">Approaching threshold</span>
        </div>

        <div
          onClick={() => setFilter('out')}
          className={`p-4 rounded-2xl border shadow-xs cursor-pointer transition-colors ${
            filter === 'out' ? 'border-red-500 bg-red-50/30' : 'bg-white border-slate-200/80'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700">
            Depleted / Out of Stock
          </span>
          <p className="text-xl font-black text-red-800 mt-1">{stats.outCount} SKUs</p>
          <span className="text-[11px] text-red-600 mt-0.5 block">Cannot fulfill orders</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by title, SKU or brand..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-cyan-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filter === 'all' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filter === 'low' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Low Stock ({stats.lowCount})
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filter === 'out' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Out of Stock ({stats.outCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-extrabold uppercase tracking-wider text-slate-900">
            Warehouse Stock Matrix ({filtered.length} Items)
          </span>
          <span className="text-slate-400 font-medium">Use buttons to increment/decrement availability</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const isOut = p.stockQuantity === 0;
                const isLow = p.stockQuantity > 0 && p.stockQuantity <= lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-200 p-0.5 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-slate-900 block truncate">{p.name}</span>
                          <span className="text-[10px] text-slate-400">{p.brand}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">{p.sku}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-sm font-black ${
                          isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-900'
                        }`}
                      >
                        {p.stockQuantity} units
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {lowStockThreshold} units
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          isOut
                            ? 'bg-red-100 text-red-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'IN STOCK'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onUpdateStock(p.id, Math.max(0, p.stockQuantity - 1))}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold disabled:opacity-30 transition-colors"
                          disabled={p.stockQuantity <= 0}
                          title="Decrease 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onUpdateStock(p.id, p.stockQuantity + 1)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
                          title="Increase 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onUpdateStock(p.id, p.stockQuantity + 10)}
                          className="px-2 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold rounded-lg text-[10px] border border-cyan-200 transition-colors"
                        >
                          +10 Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
