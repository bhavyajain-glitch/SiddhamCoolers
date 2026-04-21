import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const { user } = await registerUser(formData);
        navigateByRole(user.role);
      } else {
        const { user } = await login(formData.email, formData.password);
        navigateByRole(user.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateByRole = (role) => {
    switch (role) {
      case 'admin': navigate('/admin'); break;
      case 'retailer': navigate('/vendor'); break;
      default: navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      {/* Background accent */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-fixed rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-container rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="block text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight text-on-surface">Siddham</h1>
          <p className="text-xs tracking-[0.3em] text-on-surface-variant mt-1 uppercase">Coolers</p>
        </Link>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 ambient-shadow-lg">
          <h2 className="text-2xl font-bold text-on-surface mb-1">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-on-surface-variant text-sm mb-8">
            {isRegister ? 'Sign up to start shopping' : 'Sign in to your account'}
          </p>

          {error && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-2">Full Name</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl bg-surface-container text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g. Amit Kumar"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-2">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl bg-surface-container text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-2">Password</label>
              <input
                type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-surface-container text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Min. 6 characters"
              />
            </div>

            {isRegister && (
              <div>
                <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase block mb-2">Phone</label>
                <input
                  type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl btn-gradient text-on-primary font-semibold text-sm tracking-wide hover:opacity-90 transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-primary text-sm font-medium hover:underline cursor-pointer"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
          </div>
        </div>

        {/* Quick login hints */}
        <div className="mt-6 bg-surface-container-lowest rounded-2xl p-5 ambient-shadow-sm">
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase mb-3">Demo Credentials</p>
          <div className="space-y-2 text-xs text-on-surface-variant">
            <div className="flex justify-between items-center bg-surface-container rounded-lg px-3 py-2">
              <span className="font-medium text-on-surface">Admin</span>
              <span>admin@siddham.com / admin123</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container rounded-lg px-3 py-2">
              <span className="font-medium text-on-surface">Vendor</span>
              <span>rajesh@vendor.com / vendor123</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container rounded-lg px-3 py-2">
              <span className="font-medium text-on-surface">Customer</span>
              <span>amit@customer.com / customer123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
