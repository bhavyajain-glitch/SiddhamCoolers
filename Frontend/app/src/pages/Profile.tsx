import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { OrderApi, AuthApi } from '../services/api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await OrderApi.getAll(); // GET /api/orders natively returns own orders for customers
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await AuthApi.updateProfile({ 
        name: formData.name, 
        phone: formData.phone,
        address: formData.address 
      });
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-500';
      case 'Processing': return 'bg-blue-500/10 text-blue-500';
      case 'Completed': return 'bg-green-500/10 text-green-500';
      case 'Cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  return (
    <main className="flex-1 bg-surface py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-headline text-4xl font-bold text-on-background mb-8">My Account</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 border-b border-outline-variant/20 mb-8">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'orders' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Order History
            {activeTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'profile' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Profile Settings
            {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20 text-on-surface-variant">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-lowest rounded-2xl ambient-shadow-sm">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-4">inventory_2</span>
                <p className="text-on-surface-variant font-medium">You haven't placed any orders yet.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order._id} className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow-sm border border-outline-variant/10">
                  <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Order #{order._id.slice(-6)}</p>
                      <p className="text-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-headline font-bold text-xl text-on-background mb-2">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item._id} className="flex gap-4 items-center p-4 bg-surface-container rounded-xl">
                        <img src={item.productId?.images?.[0] || 'https://placehold.co/100x100?text=Product'} alt={item.productId?.name || 'Unknown Product'} className="w-16 h-16 rounded-lg object-cover mix-blend-multiply" />
                        <div className="flex-1">
                          <p className="font-medium text-on-background">{item.productId?.name || 'Unknown Product'}</p>
                          <p className="text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-on-background">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-outline-variant/10">
                    <p className="text-sm font-medium text-on-background mb-1">Shipping To:</p>
                    <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">{order.shippingAddress}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-surface-container-lowest rounded-2xl p-8 ambient-shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-2xl font-semibold text-on-background">Personal Details</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-primary font-medium hover:opacity-80 transition-opacity"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Full Name</p>
                  <p className="font-medium text-on-background">{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Email Address</p>
                  <p className="font-medium text-on-background">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Phone Number</p>
                  <p className="font-medium text-on-background">{user?.phone || 'Not provided'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Default Shipping Address</p>
                  <p className="font-medium text-on-background max-w-md leading-relaxed">{user?.address || 'Not provided'}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full bg-surface-container p-3 rounded-xl ring-1 ring-outline-variant/20 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/50 text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email}
                      disabled
                      className="w-full bg-surface-container/50 p-3 rounded-xl ring-1 ring-outline-variant/20 text-on-surface-variant cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-surface-container p-3 rounded-xl ring-1 ring-outline-variant/20 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/50 text-on-surface"
                      placeholder="+91..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-on-surface mb-2">Shipping Address</label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full bg-surface-container p-3 rounded-xl ring-1 ring-outline-variant/20 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/50 text-on-surface resize-none"
                      placeholder="123 Street..."
                    />
                  </div>
                </div>
                <div className="flex gap-4 justify-end pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 rounded-xl font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl btn-gradient text-on-primary font-medium hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
