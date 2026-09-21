import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { formatKSh } from '../lib/utils.ts';
import { Address } from '../types/index.ts';
import {
  User as UserIcon,
  Package,
  Heart,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  LogOut,
  ArrowRight,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

const KENYA_COUNTIES = [
  'Nairobi',
  'Kiambu',
  'Mombasa',
  'Nakuru',
  'Kisumu',
  'Uasin Gishu',
  'Machakos',
  'Kajiado',
  'Kilifi',
  'Meru',
  'Nyeri',
];

export const AccountPage: React.FC = () => {
  const { user, logout, orders, wishlist, navigate, updateUserProfile, showToast } = useShop();

  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFullName, setEditFullName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Management state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([
    {
      id: 'addr-01',
      fullName: user?.fullName || 'Kelvin Anunda',
      phoneNumber: user?.phone || '+254 705 629 522',
      county: 'Nairobi',
      city: 'Nairobi',
      area: 'Westlands',
      streetAddress: 'Delta Corner Tower B, Ring Road',
      isDefault: true,
    },
  ]);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newCounty, setNewCounty] = useState('Nairobi');
  const [newCity, setNewCity] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newPhone, setNewPhone] = useState(user?.phone || '+254 7');

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#F8F9FA] flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 max-w-md w-full text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sign In to View Account</h2>
          <p className="text-xs text-slate-500">
            Access your order history, delivery details, and account preferences.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFullName.trim()) return;

    setSavingProfile(true);
    try {
      await updateUserProfile({
        fullName: editFullName.trim(),
        phone: editPhone.trim(),
      });
      setIsEditProfileOpen(false);
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim()) {
      showToast({
        type: 'warning',
        title: 'Incomplete Address',
        message: 'Please provide town and physical street details.',
      });
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      fullName: user.fullName,
      phoneNumber: newPhone,
      county: newCounty,
      city: newCity,
      area: newCity,
      streetAddress: newStreet,
      isDefault: savedAddresses.length === 0,
    };

    setSavedAddresses([...savedAddresses, newAddr]);
    setIsAddAddressOpen(false);
    setNewStreet('');
    setNewCity('');
    showToast({
      type: 'success',
      title: 'Address Saved',
      message: 'New delivery address added to your address book.',
    });
  };

  const handleSetDefaultAddress = (id: string) => {
    setSavedAddresses(
      savedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    showToast({
      type: 'info',
      title: 'Default Updated',
      message: 'Default delivery location changed.',
    });
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(savedAddresses.filter((a) => a.id !== id));
    showToast({
      type: 'info',
      title: 'Address Removed',
      message: 'Address removed from your profile.',
    });
  };

  return (
    <div id="account-page-view" className="bg-[#F8F9FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Profile card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-600 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-cyan-600/20">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950">{user.fullName}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded border border-cyan-200">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
              {user.phone && <p className="text-xs text-slate-600 font-semibold">{user.phone}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                setEditFullName(user.fullName);
                setEditPhone(user.phone || '');
                setIsEditProfileOpen(true);
              }}
              className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="py-2 px-3.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-xl text-xs font-bold border border-cyan-200 transition-colors"
              >
                Admin Console
              </button>
            )}
            <button
              onClick={logout}
              className="py-2 px-3.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/orders')}
            className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-cyan-500 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Orders</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
              <span className="text-[11px] text-cyan-600 font-medium flex items-center gap-1 mt-1">
                <span>View tracking</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div
            onClick={() => navigate('/wishlist')}
            className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-cyan-500 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wishlist</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{wishlist.length}</p>
              <span className="text-[11px] text-cyan-600 font-medium flex items-center gap-1 mt-1">
                <span>Saved items</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buyer Protection</span>
              <p className="text-sm font-bold text-emerald-700 mt-1">Active Verified</p>
              <span className="text-[11px] text-slate-400 mt-1 block">Full Kenyan Warranty</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Address Book & Recent Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Address Book (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  <span>Delivery Address Book</span>
                </h3>
                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 rounded-xl border transition-all ${
                    addr.isDefault
                      ? 'border-cyan-500 bg-cyan-50/20 shadow-xs'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-cyan-600 text-white px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{addr.streetAddress}</p>
                      <p className="text-xs text-slate-500">
                        {addr.city}, {addr.county}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">{addr.phoneNumber}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] font-semibold text-cyan-700 hover:underline"
                        >
                          Make Default
                        </button>
                      )}
                      {savedAddresses.length > 1 && (
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Overview (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-600" />
                  <span>Recent Orders</span>
                </h3>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No orders placed yet. Explore new products in our catalog.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => navigate('/orders')}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">#{ord.orderNumber}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} item(s)
                        </p>
                      </div>
                      <span className="font-bold text-slate-900">{formatKSh(ord.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+254 705 629 522"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2 bg-slate-950 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddAddress}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add New Delivery Location</h3>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">County *</label>
              <select
                value={newCounty}
                onChange={(e) => setNewCounty(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden bg-white"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Town / Area *</label>
              <input
                type="text"
                required
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="e.g. Westlands, Kilimani, Nyali"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address / Building *</label>
              <input
                type="text"
                required
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                placeholder="e.g. Ring Road, Delta Corner, 3rd Floor"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Mobile Number *</label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-950 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
