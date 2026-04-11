import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartApi, CouponApi, OrderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await CartApi.get();
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await CartApi.updateItem(productId, quantity);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await CartApi.removeItem(productId);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setCouponLoading(true);
      const res = await CouponApi.validate(couponCode, cart.totalAmount);
      setCouponResult(res.data);
    } catch (err) {
      setCouponResult({ valid: false, message: 'Failed to validate coupon' });
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
      alert('Please fill in all required address fields');
      return;
    }
    try {
      setPlacing(true);
      await OrderApi.create({
        shippingAddress: address,
        couponCode: couponResult?.valid ? couponCode : null,
        paymentMethod,
      });
      setOrderPlaced(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h1 className="text-3xl font-black text-on-surface mb-3">Order Placed!</h1>
          <p className="text-on-surface-variant mb-8">Your order has been confirmed. We'll send you a confirmation email shortly.</p>
          <Link to="/" className="px-8 py-3.5 rounded-full btn-gradient text-on-primary font-semibold text-sm hover:opacity-90 transition-all inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const subtotal = cart?.totalAmount || 0;
  const discount = couponResult?.valid ? couponResult.discount : 0;
  const total = subtotal - discount;

  return (
    <main className="min-h-screen bg-surface">
      {/* Minimal Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-black tracking-tight text-on-surface">Siddham</span>
            <span className="text-[10px] tracking-[0.2em] text-on-surface-variant uppercase mt-1">Coolers</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-lg">lock</span>
            Secure Checkout
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-on-surface mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">shopping_cart</span>
            <p className="text-on-surface-variant mb-4">Your cart is empty</p>
            <Link to="/" className="text-primary font-medium hover:underline">Browse products →</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Cart + Address + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
                <h2 className="text-lg font-bold text-on-surface mb-4">Cart ({cartItems.length} items)</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = item.productId;
                    return (
                      <div key={product?._id || item.productId} className="flex gap-4 bg-surface-container rounded-xl p-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
                          {product?.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-on-surface text-sm">{product?.name || 'Product'}</h3>
                          <p className="text-sm text-on-surface-variant">₹{(item.priceAtAdd || product?.price || 0).toLocaleString('en-IN')}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center bg-surface-container-lowest rounded-lg">
                              <button onClick={() => updateQuantity(product?._id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center cursor-pointer text-on-surface-variant hover:text-on-surface">
                                <span className="material-symbols-outlined text-sm">remove</span>
                              </button>
                              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(product?._id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center cursor-pointer text-on-surface-variant hover:text-on-surface">
                                <span className="material-symbols-outlined text-sm">add</span>
                              </button>
                            </div>
                            <button onClick={() => removeItem(product?._id)} className="text-xs text-error hover:underline cursor-pointer">Remove</button>
                          </div>
                        </div>
                        <p className="font-bold text-on-surface text-sm">₹{((item.priceAtAdd || product?.price || 0) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
                <h2 className="text-lg font-bold text-on-surface mb-4">Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Full Name *</label>
                    <input type="text" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Phone *</label>
                    <input type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="+91 98765 43210" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Address Line 1 *</label>
                    <input type="text" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Street, building, apartment" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Address Line 2</label>
                    <input type="text" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Landmark (optional)" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">City *</label>
                    <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">State *</label>
                    <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Pincode *</label>
                    <input type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
                <h2 className="text-lg font-bold text-on-surface mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', icon: 'payments', desc: 'Pay when you receive' },
                    { id: 'upi', label: 'UPI', icon: 'account_balance', desc: 'Google Pay, PhonePe, Paytm' },
                    { id: 'card', label: 'Credit / Debit Card', icon: 'credit_card', desc: 'Visa, Mastercard, RuPay' },
                  ].map((method) => (
                    <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method.id ? 'bg-primary-fixed' : 'bg-surface-container hover:bg-surface-container-high'
                    }`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)} className="accent-primary" />
                      <span className="material-symbols-outlined text-xl text-on-surface-variant">{method.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{method.label}</p>
                        <p className="text-xs text-on-surface-variant">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
                <h2 className="text-lg font-bold text-on-surface mb-6">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-2">Coupon Code</label>
                  <div className="flex gap-2">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. RAJESH10" />
                    <button onClick={validateCoupon} disabled={couponLoading}
                      className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponResult && (
                    <p className={`text-xs mt-2 ${couponResult.valid ? 'text-green-600' : 'text-error'}`}>
                      {couponResult.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span className="text-on-surface font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Coupon Discount</span>
                      <span className="text-green-600 font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-outline-variant/20 pt-3 flex justify-between">
                    <span className="font-bold text-on-surface">Total</span>
                    <span className="text-xl font-black text-on-surface">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing || cartItems.length === 0}
                  className="w-full py-3.5 rounded-xl btn-gradient text-on-primary font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {placing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <><span className="material-symbols-outlined text-lg">lock</span> Place Order — ₹{total.toLocaleString('en-IN')}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
