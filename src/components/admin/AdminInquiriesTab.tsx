import React, { useState } from 'react';
import { CustomerInquiry } from '../../types/index.ts';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Tag,
} from 'lucide-react';

interface AdminInquiriesTabProps {
  inquiries: CustomerInquiry[];
  onUpdateStatus: (id: string, status: CustomerInquiry['status']) => Promise<void>;
}

export const AdminInquiriesTab: React.FC<AdminInquiriesTabProps> = ({
  inquiries,
  onUpdateStatus,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);

  const filtered = inquiries.filter((inq) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = inq.fullName.toLowerCase().includes(q);
      const matchEmail = inq.email.toLowerCase().includes(q);
      const matchSubject = inq.subject.toLowerCase().includes(q);
      const matchMessage = inq.message.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchSubject && !matchMessage) return false;
    }
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
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
            placeholder="Search tickets by customer, subject or message..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-cyan-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Ticket Statuses</option>
            <option value="new">New (Unread)</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-extrabold uppercase tracking-wider text-slate-900">
            Support Help Desk Queue ({filtered.length} Inquiries)
          </span>
          <span className="text-slate-400 font-medium">Customer contact inquiries & orders help</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-1">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No customer inquiries found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((inq) => (
              <div
                key={inq.id}
                className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        inq.status === 'new'
                          ? 'bg-cyan-100 text-cyan-800'
                          : inq.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {inq.status.replace('_', ' ')}
                    </span>

                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                      Category: {inq.category}
                    </span>

                    {inq.orderNumber && (
                      <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-bold">
                        Order #{inq.orderNumber}
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 ml-auto">
                      {new Date(inq.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900">{inq.subject}</h3>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {inq.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="font-bold text-slate-800">{inq.fullName}</span>
                    <a
                      href={`mailto:${inq.email}`}
                      className="flex items-center gap-1 text-cyan-600 hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{inq.email}</span>
                    </a>
                    {inq.phone && (
                      <a
                        href={`tel:${inq.phone}`}
                        className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{inq.phone}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Status Changer */}
                <div className="self-end md:self-start shrink-0">
                  <select
                    value={inq.status}
                    onChange={(e) => onUpdateStatus(inq.id, e.target.value as any)}
                    className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="new">Mark as NEW</option>
                    <option value="in_progress">Mark as IN PROGRESS</option>
                    <option value="resolved">Mark as RESOLVED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
