import { useState, useEffect } from 'react';
import { VendorApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function VendorPortal() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await VendorApi.myDashboard();
      setDashboardData(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    const code = dashboardData?.sales?.coupon?.code;
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const vendor = dashboardData?.vendor || {};
  const sales = dashboardData?.sales || {};
  const earnings = sales.earnings || vendor.earnings || {};
  const coupon = sales.coupon || vendor.coupon || {};
  const orders = sales.orders || [];
  const commissions = sales.commissions || [];

  return (
    <main className="flex-1 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-on-surface">Partner Dashboard</h1>
          <p className="text-on-surface-variant mt-1">
            Monitor your referral performance, manage your coupon code, and track your commissions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Earnings Hero */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 ambient-shadow-lg">
              <p className="text-xs font-semibold tracking-[0.3em] text-on-surface-variant uppercase mb-2">Total Revenue Generated</p>
              <div className="flex items-end gap-4 mb-6">
                <h2 className="text-5xl font-black text-on-surface">₹{(earnings.totalEarned || 0).toLocaleString('en-IN')}</h2>
                {orders.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    {orders.length} orders
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-on-surface-variant">Commission Earned</p>
                  <p className="text-xl font-bold text-primary">₹{(earnings.totalEarned || 0).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Pending Payout</p>
                  <p className="text-xl font-bold text-on-surface">₹{(earnings.totalPending || 0).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Orders Linked</p>
                  <p className="text-xl font-bold text-on-surface">{earnings.count || 0}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
              <h3 className="text-xs font-semibold tracking-[0.3em] text-on-surface-variant uppercase mb-4">Recent Attributed Orders</h3>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">receipt_long</span>
                  <p className="text-on-surface-variant text-sm">No orders yet. Share your coupon code to start earning!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between bg-surface-container rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg text-primary">shopping_bag</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{order.customerId?.name || 'Customer'}</p>
                          <p className="text-xs text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-on-surface">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                        <p className={`text-xs font-semibold capitalize ${
                          order.status === 'delivered' ? 'text-green-600' : order.status === 'cancelled' ? 'text-error' : 'text-amber-600'
                        }`}>{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Commission History */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
              <h3 className="text-xs font-semibold tracking-[0.3em] text-on-surface-variant uppercase mb-4">Commission History</h3>
              {commissions.length === 0 ? (
                <p className="text-center text-on-surface-variant text-sm py-6">No commissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {commissions.map((c) => (
                    <div key={c._id} className="flex items-center justify-between bg-surface-container rounded-xl p-4">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">Order ₹{c.orderAmount.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-on-surface-variant">{c.commissionPercent}% commission • {new Date(c.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">+₹{c.commissionAmount.toLocaleString('en-IN')}</p>
                        <p className={`text-xs font-semibold ${c.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{c.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Coupon + Stats */}
          <div className="space-y-6">
            {/* Coupon Card */}
            <div className="bg-gradient-to-br from-primary-fixed to-primary-fixed-dim rounded-2xl p-6 ambient-shadow-lg">
              <p className="text-xs font-semibold tracking-[0.3em] text-on-primary-fixed-variant uppercase mb-4">Your Unique Code</p>
              <div className="bg-surface-container-lowest rounded-xl p-4 mb-4">
                <p className="text-xs text-on-surface-variant mb-1">Discount Code ({coupon.discountPercent || 10}% Off)</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-primary tracking-wider">{coupon.code || '—'}</p>
                  <button onClick={handleCopyCode} className="p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-lg text-on-surface-variant">
                      {copiedCode ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>
              <div className="text-xs text-on-primary-fixed-variant space-y-1">
                <p>• Max discount: ₹{coupon.maxDiscountAmount || 0}</p>
                <p>• Min order: ₹{coupon.minOrderValue || 0}</p>
                <p>• Used {coupon.usageCount || 0} times</p>
              </div>
              <button onClick={handleCopyCode}
                className="w-full mt-4 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-lg">share</span>
                {copiedCode ? 'Copied!' : 'Share Code'}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
              <p className="text-xs font-semibold tracking-[0.3em] text-on-surface-variant uppercase mb-4">Performance</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Total Sales</span>
                  <span className="text-sm font-bold text-on-surface">{orders.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Coupon Uses</span>
                  <span className="text-sm font-bold text-on-surface">{coupon.usageCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Commission Rate</span>
                  <span className="text-sm font-bold text-on-surface">10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Paid Out</span>
                  <span className="text-sm font-bold text-green-600">₹{(earnings.totalPaid || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
