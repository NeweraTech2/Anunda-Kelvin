import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { formatKSh } from '../lib/utils.ts';
import { productService } from '../services/productService.ts';
import { Order } from '../types/index.ts';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Clock,
  MapPin,
  AlertCircle,
  Check,
} from 'lucide-react';

const KENYA_COUNTIES = [
  'Nairobi',
  'Kiambu',
  'Mombasa',
  'Nakuru',
  'Kisumu',
  'Uasin Gishu (Eldoret)',
  'Machakos',
  'Kajiado',
  'Kilifi',
  'Meru',
  'Nyeri',
  'Kisii',
  'Kakamega',
  'Kericho',
  'Laikipia (Nanyuki)',
  'Embu',
  'Bungoma',
  'Trans Nzoia (Kitale)',
  'Murang\'a',
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, user, createOrder, navigate, showToast } = useShop();

  // Multi-step progress (1: Details, 2: Delivery, 3: Payment & Review)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Customer Details
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+254 7');

  // Delivery Address
  const [county, setCounty] = useState('Nairobi');
  const [cityTown, setCityTown] = useState('Westlands');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'cod' | 'bank'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone || '+254 7');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // STK Push Interactive Modal
  const [stkModalOpen, setStkModalOpen] = useState(false);
  const [stkStatus, setStkStatus] = useState<'waiting' | 'confirmed' | 'failed'>('waiting');
  const [stkTimer, setStkTimer] = useState(15);
  const [mpesaReceipt, setMpesaReceipt] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);

  // Calculate Delivery Fee & Total
  const isNairobi = county === 'Nairobi';
  const baseDeliveryFee = isNairobi ? (cartTotal > 50000 ? 0 : 350) : 650;
  const speedSurcharge = deliverySpeed === 'express' ? (isNairobi ? 200 : 350) : 0;
  const deliveryFee = cart.length === 0 ? 0 : baseDeliveryFee + speedSurcharge;
  const grandTotal = cartTotal + deliveryFee;

  // Sync phone numbers
  useEffect(() => {
    if (phone && phone !== '+254 7' && (!mpesaPhone || mpesaPhone === '+254 7')) {
      setMpesaPhone(phone);
    }
  }, [phone]);

  // STK Timer countdown
  useEffect(() => {
    let interval: any;
    if (stkModalOpen && stkStatus === 'waiting') {
      interval = setInterval(() => {
        setStkTimer((prev) => {
          if (prev <= 1) {
            // Auto simulate success at end of countdown
            clearInterval(interval);
            const generatedReceipt = `QHK${Math.floor(10000 + Math.random() * 90000)}KZ`;
            setMpesaReceipt(generatedReceipt);
            setStkStatus('confirmed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stkModalOpen, stkStatus]);

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-[70vh] bg-[#F8F9FA] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 max-w-md w-full text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">
            You cannot proceed to checkout without items in your cart.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="w-full py-3 px-4 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Pre-validate stock before finalizing order
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress.trim()) {
      showToast({
        type: 'warning',
        title: 'Street Address Required',
        message: 'Please provide a building, street, or landmark address.',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const validation = await productService.validateCartItems(cart);
      if (!validation.isValid) {
        showToast({
          type: 'error',
          title: 'Stock Updated',
          message: 'Some items in your cart have sold out or exceeded stock limits.',
        });
        setIsProcessing(false);
        return;
      }
      setCurrentStep(3);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartMpesaPayment = () => {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      showToast({
        type: 'warning',
        title: 'Invalid Phone Number',
        message: 'Please provide a valid Safaricom phone number for M-Pesa.',
      });
      return;
    }
    setStkTimer(12);
    setStkStatus('waiting');
    setStkModalOpen(true);
  };

  const handleCompleteOrderSubmission = async (overrideMpesaReceipt?: string) => {
    setIsProcessing(true);
    try {
      const receiptCode = overrideMpesaReceipt || mpesaReceipt || (paymentMethod === 'mpesa' ? `QHK${Math.floor(10000 + Math.random() * 90000)}KZ` : undefined);

      const newOrder = await createOrder({
        customerName: fullName,
        customerEmail: email || `${phone.replace(/\D/g, '')}@guest.newerashop.co.ke`,
        customerPhone: phone,
        subtotal: cartTotal,
        shippingFee: deliveryFee,
        total: grandTotal,
        shippingAddress: {
          id: `addr-${Date.now()}`,
          fullName,
          phoneNumber: phone,
          streetAddress,
          city: cityTown,
          area: cityTown,
          county,
          isDefault: true,
        },
        paymentMethod: paymentMethod === 'mpesa' ? 'mpesa' : paymentMethod === 'card' ? 'card' : paymentMethod === 'cod' ? 'cash_on_delivery' : 'bank_transfer',
        mpesaReceiptNumber: receiptCode,
      });

      setOrderComplete(newOrder);
      setStkModalOpen(false);
      showToast({
        type: 'success',
        title: 'Order Successfully Placed!',
        message: `Order #${newOrder.orderNumber} confirmed.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Failed to place order',
        message: err.message || 'Please check your connection and try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Confirmed Success Screen
  if (orderComplete) {
    return (
      <div id="checkout-success-view" className="min-h-[70vh] bg-[#F8F9FA] py-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
              Order Confirmed & Paid
            </span>
            <h1 className="text-2xl font-extrabold text-slate-950">Thank you for your order!</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              We have received your order <strong>#{orderComplete.orderNumber}</strong>. A tracking SMS has been dispatched to <strong>{phone}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 text-left space-y-2 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Order Number:</span>
              <span className="font-bold text-slate-900">#{orderComplete.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Recipient:</span>
              <span className="font-semibold text-slate-900">{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Destination:</span>
              <span className="font-semibold text-slate-900">{cityTown}, {county}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Channel:</span>
              <span className="font-semibold text-cyan-700 capitalize">
                {paymentMethod === 'mpesa' ? `M-Pesa (${orderComplete.mpesaReceiptNumber || 'Confirmed'})` : paymentMethod}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-slate-900 font-bold">
              <span>Total Paid:</span>
              <span className="text-sm font-extrabold">{formatKSh(orderComplete.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 py-3 px-4 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Track Order Dispatch
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-page-container" className="bg-[#F8F9FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header & Steps Indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-950">Secure Checkout</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Kenyan warranty protection and verified delivery
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Steps Progress Bar */}
          <div className="flex items-center justify-between max-w-xl mx-auto py-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 1 ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                1
              </span>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">Contact</span>
            </div>
            <div className={`h-0.5 flex-1 mx-3 ${currentStep >= 2 ? 'bg-slate-950' : 'bg-slate-200'}`} />

            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 2 ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">Delivery</span>
            </div>
            <div className={`h-0.5 flex-1 mx-3 ${currentStep >= 3 ? 'bg-slate-950' : 'bg-slate-200'}`} />

            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 3 ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </span>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Steps Form (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Customer Contact Info */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    1. Customer Information
                  </h2>
                  <span className="text-[11px] text-slate-400">Step 1 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kelvin Anunda"
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (Safaricom / Airtel) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 705 629 522"
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Used for delivery dispatch & M-Pesa notifications
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kelvin@example.com"
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Tax invoice will be sent here
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!fullName.trim() || !phone.trim() || phone.trim() === '+254 7') {
                        showToast({
                          type: 'warning',
                          title: 'Contact Required',
                          message: 'Please provide your full name and valid mobile number.',
                        });
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    className="px-6 py-3 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Continue to Delivery Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Details */}
            {currentStep === 2 && (
              <form onSubmit={handleProceedToPayment} className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    2. Delivery Location in Kenya
                  </h2>
                  <span className="text-[11px] text-slate-400">Step 2 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      County *
                    </label>
                    <select
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Town / Sub-County / Estate *
                    </label>
                    <input
                      type="text"
                      required
                      value={cityTown}
                      onChange={(e) => setCityTown(e.target.value)}
                      placeholder="e.g. Westlands, Kilimani, Nyali, Milimani"
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Physical Street Address / Building / Office / House No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. Delta Corner Tower B, 5th Floor, Ring Road"
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Delivery Instructions & Landmarks (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Near Sarit Centre entrance, call upon arrival at the gate..."
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Delivery Speed Selector */}
                <div className="pt-2 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Delivery Speed & Service
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setDeliverySpeed('standard')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        deliverySpeed === 'standard'
                          ? 'border-cyan-600 bg-cyan-50/40 ring-1 ring-cyan-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Standard Delivery</span>
                        <span className="font-bold text-xs text-slate-900">
                          {baseDeliveryFee === 0 ? 'FREE' : formatKSh(baseDeliveryFee)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {isNairobi ? 'Within 24 Hours in Nairobi' : '24–48 Hours Countrywide'}
                      </p>
                    </div>

                    <div
                      onClick={() => setDeliverySpeed('express')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        deliverySpeed === 'express'
                          ? 'border-cyan-600 bg-cyan-50/40 ring-1 ring-cyan-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                          <span>Express Rush</span>
                          <span className="bg-amber-100 text-amber-900 text-[9px] px-1 rounded font-bold">Fast</span>
                        </span>
                        <span className="font-bold text-xs text-slate-900">
                          {formatKSh(baseDeliveryFee + (isNairobi ? 200 : 350))}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {isNairobi ? 'Same-day Priority Courier (under 3h)' : 'Next-Morning Fargo Priority'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-3 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50"
                  >
                    <span>{isProcessing ? 'Validating Stock...' : 'Proceed to Payment'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Payment & Final Confirmation */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    3. Choose Payment Method
                  </h2>
                  <span className="text-[11px] text-slate-400">Step 3 of 3</span>
                </div>

                {/* Payment Channels Grid */}
                <div className="space-y-3">
                  {/* Lipa Na M-Pesa */}
                  <div
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                          M
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">Lipa na M-PESA</span>
                          <span className="text-[11px] text-slate-500">Instant STK push prompt to your phone</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Most Popular
                      </span>
                    </div>

                    {paymentMethod === 'mpesa' && (
                      <div className="mt-4 pt-3 border-t border-emerald-100 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Safaricom M-Pesa Mobile Number
                          </label>
                          <input
                            type="tel"
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            placeholder="+254 705 629 522"
                            className="w-full max-w-sm p-2 text-xs border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleStartMpesaPayment}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                        >
                          Trigger M-Pesa STK Prompt ({formatKSh(grandTotal)})
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Credit / Debit Card */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-cyan-600 bg-cyan-50/30 ring-1 ring-cyan-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">Credit / Debit Card</span>
                          <span className="text-[11px] text-slate-500">Visa, Mastercard with 3D Secure</span>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                        <div>
                          <label className="block text-xs text-slate-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            placeholder="4000 1234 5678 9010"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM / YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="p-2 text-xs border border-slate-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="p-2 text-xs border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-cyan-600 bg-cyan-50/30 ring-1 ring-cyan-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                          KSh
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">Cash on Delivery (COD)</span>
                          <span className="text-[11px] text-slate-500">Pay cash or M-Pesa upon parcel handover (Nairobi area)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Wire */}
                  <div
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-cyan-600 bg-cyan-50/30 ring-1 ring-cyan-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">Direct Bank Transfer / RTGS</span>
                          <span className="text-[11px] text-slate-500">Stanbic / Equity Bank Kenya account transfer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Submit Button if not M-Pesa STK triggered */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Delivery</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => {
                      if (paymentMethod === 'mpesa') {
                        handleStartMpesaPayment();
                      } else {
                        handleCompleteOrderSubmission();
                      }
                    }}
                    className="px-8 py-3.5 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 disabled:opacity-50"
                  >
                    <span>
                      {isProcessing ? 'Processing Order...' : `Place Order • ${formatKSh(grandTotal)}`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs sticky top-24">
              <h3 className="font-extrabold text-sm text-slate-950 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Cart Breakdown</span>
                <span className="text-xs text-slate-500 font-normal">
                  {cart.length} item{cart.length > 1 ? 's' : ''}
                </span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {item.product.name}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        Qty: {item.quantity} × {formatKSh(item.product.price)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 shrink-0">
                      {formatKSh(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">{formatKSh(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery ({county})</span>
                  <span className="font-bold text-slate-800">
                    {deliveryFee === 0 ? 'FREE' : formatKSh(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-950 font-black text-sm pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span>{formatKSh(grandTotal)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official Authorized Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Doorstep Courier Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Realistic Safaricom Lipa Na M-Pesa STK Push Simulation Modal */}
      {stkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              {stkStatus === 'waiting' ? (
                <Smartphone className="w-8 h-8 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              )}
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-950">
                {stkStatus === 'waiting' ? 'M-PESA STK Push Sent' : 'Payment Received!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {stkStatus === 'waiting'
                  ? `Prompt dispatched to ${mpesaPhone}`
                  : `M-Pesa Reference: ${mpesaReceipt}`}
              </p>
            </div>

            {stkStatus === 'waiting' ? (
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-950 space-y-2 text-left">
                <p className="font-semibold text-emerald-900">Follow these instructions on your phone:</p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li>Check your phone screen for the prompt.</li>
                  <li>Enter your secret 4-digit M-Pesa PIN.</li>
                  <li>Press <strong>OK</strong> to confirm {formatKSh(grandTotal)}.</li>
                </ol>
                <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                  <span>Awaiting PIN input...</span>
                  <span className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-950 font-black">
                    {stkTimer}s
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold">Transaction Confirmed</p>
                <p className="text-[11px]">
                  Amount: <strong>{formatKSh(grandTotal)}</strong> to NewEra Shop Kenya.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 space-y-2">
              {stkStatus === 'waiting' ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Manual approve button for quick testing in preview
                      const generatedReceipt = `QHK${Math.floor(10000 + Math.random() * 90000)}KZ`;
                      setMpesaReceipt(generatedReceipt);
                      setStkStatus('confirmed');
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Simulate PIN Entered (Preview Fast Track)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStkModalOpen(false)}
                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Cancel Prompt
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCompleteOrderSubmission(mpesaReceipt)}
                  className="w-full py-3 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Finalize Order Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
