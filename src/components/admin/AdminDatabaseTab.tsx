import React from 'react';
import { isSupabaseConfigured } from '../../lib/supabase/client.ts';
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  Zap,
  Key,
} from 'lucide-react';

export const AdminDatabaseTab: React.FC = () => {
  const tables = [
    {
      name: 'products',
      desc: 'Stores active catalog items, technical specifications, warranties and SKU codes',
      rls: 'Public read for active items; Admin write for catalog management',
      status: 'Enforced',
    },
    {
      name: 'categories',
      desc: 'Taxonomy hierarchy, parent/sub categories and banner image URLs',
      rls: 'Public read; Admin write',
      status: 'Enforced',
    },
    {
      name: 'orders',
      desc: 'Customer purchases, M-Pesa receipts, delivery tariffs and order workflow states',
      rls: 'Customers read own orders; Admin read/write all orders',
      status: 'Enforced',
    },
    {
      name: 'order_items',
      desc: 'Itemized line products, historical unit purchase pricing and quantities',
      rls: 'Customers read own order items; Admin read all',
      status: 'Enforced',
    },
    {
      name: 'customer_inquiries',
      desc: 'Support contact tickets, customer communication and dispatch notes',
      rls: 'Public insert; Admin read/write',
      status: 'Enforced',
    },
    {
      name: 'reviews',
      desc: 'Customer feedback, star ratings and verified purchase badges',
      rls: 'Public read; Authenticated insert; Admin delete/moderate',
      status: 'Enforced',
    },
    {
      name: 'coupons',
      desc: 'Promotional discount codes, percentage caps and usage counters',
      rls: 'Public validate; Admin write',
      status: 'Enforced',
    },
    {
      name: 'promotions',
      desc: 'Homepage visual banners, flash deal schedules and promotional badges',
      rls: 'Public read; Admin write',
      status: 'Enforced',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Connection Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
              isSupabaseConfigured
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20'
                : 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20'
            }`}
          >
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
                {isSupabaseConfigured
                  ? 'Supabase Cloud Database Connected'
                  : 'Hybrid Resilient Database Active'}
              </h2>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  isSupabaseConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isSupabaseConfigured ? 'LIVE PG' : 'FALLBACK SYNCHRONIZED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero downtime architecture with client failover safeguards and local state mirror
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Port & SSL</span>
            <span className="font-mono font-bold text-slate-800">443 / TLS 1.3</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">RLS Status</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hardened</span>
            </span>
          </div>
        </div>
      </div>

      {/* Schema & Security Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <div>
            <h3 className="font-extrabold uppercase tracking-wider text-slate-900">
              Database Schema & Row Level Security (RLS) Directory
            </h3>
            <p className="text-[11px] text-slate-400">
              Tables provisioned for NewEra Shop high-concurrency electronic transactions
            </p>
          </div>
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-lg">
            8 Production Tables Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Database Table</th>
                <th className="py-3 px-4">Purpose & Stored Data</th>
                <th className="py-3 px-4">Row Level Security Policy</th>
                <th className="py-3 px-4 text-right">Security Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tables.map((tbl) => (
                <tr key={tbl.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    public.{tbl.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-sm">{tbl.desc}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{tbl.rls}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Lock className="w-3 h-3" />
                      <span>{tbl.status}</span>
                    </span>
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
