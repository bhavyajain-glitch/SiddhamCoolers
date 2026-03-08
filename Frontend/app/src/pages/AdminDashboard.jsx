import { useState, useEffect } from 'react';
import { ProductApi, OrderApi, VendorApi } from '../services/api';

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', images: '', price: '', mrp: '', category: 'Desert', stockQty: '' });

  // Vendor form
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorForm, setVendorForm] = useState({ name: '', email: '', password: '', phone: '', couponCode: '', discountPercent: 10, maxDiscountAmount: 500 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, ordersRes, productsRes, vendorsRes] = await Promise.all([
        OrderApi.getAnalytics(),
        OrderApi.getAll(),
        ProductApi.getAllAdmin(),
        VendorApi.getAll(),
      ]);
      setAnalytics(analyticsRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setVendors(vendorsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await OrderApi.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        stockQty: Number(productForm.stockQty),
        images: productForm.images.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editingProduct) {
        await ProductApi.update(editingProduct._id, data);
      } else {
        await ProductApi.create(data);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', images: '', price: '', mrp: '', category: 'Desert', stockQty: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Deactivate this product?')) return;
    try {
      await ProductApi.delete(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    try {
      await VendorApi.create(vendorForm);
      setShowVendorForm(false);
      setVendorForm({ name: '', email: '', password: '', phone: '', couponCode: '', discountPercent: 10, maxDiscountAmount: 500 });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create vendor');
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!confirm('Delete this vendor and their coupon?')) return;
    try {
      await VendorApi.delete(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete vendor');
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      images: product.images.join(', '),
      price: product.price,
      mrp: product.mrp,
      category: product.category,
      stockQty: product.stockQty,
    });
    setShowProductForm(true);
  };

  const statusColors = {
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-amber-100 text-amber-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-600',
  };

  const nextStatus = { confirmed: 'processing', processing: 'shipped', shipped: 'delivered' };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-on-surface">Admin Dashboard</h1>
          <p className="text-on-surface-variant mt-1">Manage products, orders, and vendors.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-container rounded-xl p-1 mb-8 w-fit">
          {['overview', 'orders', 'products', 'vendors'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer ${
                tab === t ? 'bg-surface-container-lowest ambient-shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
                <p className="text-xs font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Total Revenue</p>
                <p className="text-3xl font-black text-on-surface mt-2">₹{(analytics?.totalRevenue || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
                <p className="text-xs font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Total Orders</p>
                <p className="text-3xl font-black text-on-surface mt-2">{analytics?.totalOrders || 0}</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
                <p className="text-xs font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Active Products</p>
                <p className="text-3xl font-black text-on-surface mt-2">{products.filter(p => p.isActive).length}</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
                <p className="text-xs font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Active Vendors</p>
                <p className="text-3xl font-black text-on-surface mt-2">{vendors.length}</p>
              </div>
            </div>

            {/* Recent orders preview */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
              <h2 className="text-lg font-bold text-on-surface mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between bg-surface-container rounded-xl p-4">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{order.customerId?.name || 'Customer'}</p>
                      <p className="text-xs text-on-surface-variant">{order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-on-surface">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="bg-surface-container-lowest rounded-2xl ambient-shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/10">
              <h2 className="text-lg font-bold text-on-surface">All Orders ({orders.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container">
                    <th className="text-left px-6 py-3 text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Customer</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Items</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t border-outline-variant/5 hover:bg-surface-container/50">
                      <td className="px-6 py-4 text-sm text-on-surface">{order.customerId?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{order.items.map(i => i.productName).join(', ')}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-on-surface">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${statusColors[order.status]}`}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        {nextStatus[order.status] && (
                          <button onClick={() => handleStatusUpdate(order._id, nextStatus[order.status])}
                            className="text-xs px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 cursor-pointer capitalize">
                            → {nextStatus[order.status]}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-on-surface">Products ({products.length})</h2>
              <button onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm({ name: '', description: '', images: '', price: '', mrp: '', category: 'Desert', stockQty: '' }); }}
                className="px-5 py-2.5 rounded-xl btn-gradient text-on-primary text-sm font-semibold hover:opacity-90 cursor-pointer flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">add</span> Add Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-on-surface mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Name *</label>
                      <input type="text" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Description *</label>
                      <textarea required value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 h-20 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Image URLs (comma separated)</label>
                      <input type="text" value={productForm.images} onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Price *</label>
                        <input type="number" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">MRP *</label>
                        <input type="number" required value={productForm.mrp} onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Stock *</label>
                        <input type="number" required value={productForm.stockQty} onChange={(e) => setProductForm({ ...productForm, stockQty: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Category *</label>
                      <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        {['Desert', 'Tower', 'Personal', 'Industrial', 'Window'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 py-3 rounded-xl btn-gradient text-on-primary font-semibold text-sm cursor-pointer">{editingProduct ? 'Save Changes' : 'Add Product'}</button>
                      <button type="button" onClick={() => setShowProductForm(false)} className="px-6 py-3 rounded-xl bg-surface-container text-on-surface-variant font-semibold text-sm cursor-pointer">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product._id} className={`bg-surface-container-lowest rounded-2xl overflow-hidden ambient-shadow ${!product.isActive ? 'opacity-50' : ''}`}>
                  <div className="aspect-[3/2] bg-surface-container overflow-hidden">
                    {product.images[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-on-surface">{product.name}</h3>
                      <span className="text-sm font-bold text-on-surface">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 mb-3">
                      <span className="text-xs text-on-surface-variant">{product.category} • Stock: {product.stockQty}</span>
                      {!product.isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">Inactive</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditProduct(product)}
                        className="flex-1 py-2 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high cursor-pointer">Edit</button>
                      <button onClick={() => handleDeleteProduct(product._id)}
                        className="py-2 px-3 rounded-lg bg-red-50 text-error text-xs font-semibold hover:bg-red-100 cursor-pointer">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vendors Tab */}
        {tab === 'vendors' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-on-surface">Vendors ({vendors.length})</h2>
              <button onClick={() => setShowVendorForm(true)}
                className="px-5 py-2.5 rounded-xl btn-gradient text-on-primary text-sm font-semibold hover:opacity-90 cursor-pointer flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">person_add</span> Add Vendor
              </button>
            </div>

            {/* Vendor Form Modal */}
            {showVendorForm && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-lg">
                  <h3 className="text-xl font-bold text-on-surface mb-6">Add New Vendor</h3>
                  <form onSubmit={handleVendorSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Name *</label>
                        <input type="text" required value={vendorForm.name} onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Email *</label>
                        <input type="email" required value={vendorForm.email} onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Password *</label>
                        <input type="password" required value={vendorForm.password} onChange={(e) => setVendorForm({ ...vendorForm, password: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Phone</label>
                        <input type="tel" value={vendorForm.phone} onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Coupon Code</label>
                        <input type="text" value={vendorForm.couponCode} onChange={(e) => setVendorForm({ ...vendorForm, couponCode: e.target.value.toUpperCase() })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Auto" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Discount %</label>
                        <input type="number" value={vendorForm.discountPercent} onChange={(e) => setVendorForm({ ...vendorForm, discountPercent: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-1.5">Max ₹ Off</label>
                        <input type="number" value={vendorForm.maxDiscountAmount} onChange={(e) => setVendorForm({ ...vendorForm, maxDiscountAmount: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 py-3 rounded-xl btn-gradient text-on-primary font-semibold text-sm cursor-pointer">Create Vendor</button>
                      <button type="button" onClick={() => setShowVendorForm(false)} className="px-6 py-3 rounded-xl bg-surface-container text-on-surface-variant font-semibold text-sm cursor-pointer">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div key={vendor._id} className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{vendor.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-on-surface">{vendor.name}</h3>
                        <p className="text-sm text-on-surface-variant">{vendor.email}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteVendor(vendor._id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-error font-semibold hover:bg-red-100 cursor-pointer">
                      Delete
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="bg-surface-container rounded-xl p-3">
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Coupon</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{vendor.coupon?.code || '—'}</p>
                    </div>
                    <div className="bg-surface-container rounded-xl p-3">
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Uses</p>
                      <p className="text-sm font-bold text-on-surface mt-0.5">{vendor.coupon?.usageCount || 0}</p>
                    </div>
                    <div className="bg-surface-container rounded-xl p-3">
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Total Earned</p>
                      <p className="text-sm font-bold text-on-surface mt-0.5">₹{(vendor.earnings?.totalEarned || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-surface-container rounded-xl p-3">
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Pending</p>
                      <p className="text-sm font-bold text-amber-600 mt-0.5">₹{(vendor.earnings?.totalPending || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
