import React, { useState, useMemo } from 'react';
import { CustomerAccount } from '../../types/index.ts';
import { formatKSh } from '../../lib/utils.ts';
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';

interface AdminCustomersTabProps {
  customers: CustomerAccount[];
  onUpdateStatus: (id: string, status: CustomerAccount['status']) => void;
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({
  customers,
  onUpdateStatus,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccount | null>(null);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = c.fullName.toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchPhone = c.phone?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      return true;
    });
  }, [customers, search, statusFilter]);

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
            placeholder="Search customers by name, email or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-cyan-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Customer Statuses</option>
            <option value="active">Active</option>
            <option value="restricted">Restricted</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Customer Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-extrabold uppercase tracking-wider text-slate-900">
            Registered Customers ({filtered.length})
          </span>
          <span className="text-slate-400 font-medium">Verified customer accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Total Spend</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                        {c.fullName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">{c.fullName}</span>
                        <span className="text-[10px] text-slate-400">
                          Joined {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-slate-700 block">{c.email}</span>
                    <span className="text-[10px] text-slate-400">{c.phone || 'No phone'}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{c.ordersCount || 0} orders</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-black text-slate-900">{formatKSh(c.totalSpent || 0)}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        c.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'restricted'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <select
                      value={c.status}
                      onChange={(e) => onUpdateStatus(c.id, e.target.value as any)}
                      className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 focus:outline-hidden"
                    >
                      <option value="active">Active</option>
                      <option value="restricted">Restricted</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
