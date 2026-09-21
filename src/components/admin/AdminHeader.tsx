import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import { isSupabaseConfigured } from '../../lib/supabase/client.ts';
import {
  Menu,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Package,
  MessageSquare,
  LogOut,
  ChevronDown,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar.tsx';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onOpenMobileMenu: () => void;
  onSelectTab: (tab: AdminTab) => void;
  notifications: Array<{
    id: string;
    type: 'order' | 'stock' | 'inquiry';
    title: string;
    message: string;
    timestamp: string;
    tabTarget: AdminTab;
  }>;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onSelectTab,
  notifications,
}) => {
  const { user, logout } = useShop();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Executive Overview', desc: 'Real-time performance, vital metrics & store telemetry' };
      case 'products':
        return { title: 'Product Catalog', desc: 'Manage catalog products, specs, pricing & SKU lifecycle' };
      case 'categories':
        return { title: 'Category Taxonomy', desc: 'Organize category tree, display order & visual banners' };
      case 'inventory':
        return { title: 'Inventory & Stock Safety', desc: 'Live warehouse counts, stock thresholds & availability guards' };
      case 'orders':
        return { title: 'Orders & Fulfillment Pipeline', desc: 'Track customer orders, M-Pesa settlements & courier dispatch' };
      case 'customers':
        return { title: 'Customer Accounts', desc: 'Verified customer profiles, purchase history & account status' };
      case 'promotions':
        return { title: 'Promotions & Coupons', desc: 'Flash deals, campaign banners & checkout coupon codes' };
      case 'reviews':
        return { title: 'Review Moderation', desc: 'Manage verified customer feedback and ratings' };
      case 'inquiries':
        return { title: 'Customer Support Desk', desc: 'Respond to tickets and customer contact inquiries' };
      case 'analytics':
        return { title: 'Business Analytics', desc: 'Verified revenue, average order value & category share' };
      case 'settings':
        return { title: 'Store Configuration', desc: 'Shipping tariffs, payment methods & contact information' };
      case 'audit':
        return { title: 'System Audit Logs', desc: 'Administrative action timeline and operational history' };
      case 'database':
        return { title: 'Supabase Architecture', desc: 'Schema state, Row Level Security & connection health' };
    }
  };

  const { title, desc } = getTabTitle(currentTab);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: Hamburger & Tab title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
            {desc}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Supabase status */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600">
          <span
            className={`w-2 h-2 rounded-full ${
              isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span>{isSupabaseConfigured ? 'Supabase Active' : 'Hybrid Fallback'}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Store Notifications ({notifications.length})
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Real-time alerts</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 font-medium">
                    No new administrative notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onSelectTab(n.tabTarget);
                        setIsNotifOpen(false);
                      }}
                      className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3"
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          n.type === 'stock'
                            ? 'bg-red-50 text-red-600'
                            : n.type === 'order'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-cyan-50 text-cyan-600'
                        }`}
                      >
                        {n.type === 'stock' ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : n.type === 'order' ? (
                          <Package className="w-3.5 h-3.5" />
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 leading-snug">{n.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition-all text-xs"
          >
            <div className="w-6 h-6 rounded-lg bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="font-bold text-slate-900 block leading-tight">{user?.fullName || 'Admin'}</span>
              <span className="text-[9px] font-black uppercase text-cyan-600 tracking-wider">
                {user?.role === 'admin' ? 'Super Admin' : user?.role || 'Staff'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
