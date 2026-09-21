import React, { useState } from 'react';
import { AuditLog } from '../../types/index.ts';
import {
  History,
  Search,
  Filter,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface AdminAuditTabProps {
  logs: AuditLog[];
}

export const AdminAuditTab: React.FC<AdminAuditTabProps> = ({ logs }) => {
  const [search, setSearch] = useState('');

  const filtered = logs.filter((l) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.action.toLowerCase().includes(q) ||
        l.userName.toLowerCase().includes(q) ||
        (l.details && l.details.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Operational Audit Trail ({filtered.length} Actions)
          </h2>
          <p className="text-xs text-slate-400">
            Immutable log of staff modifications, price updates, and order status transitions
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action logs..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-cyan-500 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff Operator</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Operational Change Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    <span className="font-mono text-[11px] block">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-extrabold text-slate-900 block">{log.userName}</span>
                    <span className="text-[10px] text-cyan-600 font-bold uppercase">
                      {log.userRole}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-700">{log.entity}</td>

                  <td className="py-3 px-4 text-slate-600 max-w-md">
                    {log.details || 'System event recorded'}
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
