import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, isVendor, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <span className="text-xl font-black tracking-tight text-on-surface">Siddham</span>
          <span className="text-[10px] tracking-[0.2em] text-on-surface-variant uppercase mt-1">Coolers</span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/admin' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Dashboard
            </Link>
          )}
          {isVendor && (
            <Link
              to="/vendor"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/vendor' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              My Portal
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Cart Icon for Customers */}
              {(!isAdmin && !isVendor) && (
                <Link to="/checkout" className="text-on-surface-variant hover:text-on-surface transition-colors mr-2 cursor-pointer relative top-0.5">
                  <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                </Link>
              )}
              {/* User badge */}
              <Link to={user?.role === 'customer' ? "/profile" : user?.role === 'admin' ? "/admin" : "/vendor"} className="hidden sm:flex items-center gap-2 bg-surface-container rounded-full px-3 py-1.5 hover:bg-surface-container-high transition-colors cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-on-primary text-xs font-bold">{user?.name?.charAt(0)}</span>
                </div>
                <span className="text-xs font-medium text-on-surface max-w-[100px] truncate">{user?.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold uppercase">
                  {user?.role === 'retailer' ? 'vendor' : user?.role}
                </span>
              </Link>
              <button onClick={handleLogout} className="text-sm text-on-surface-variant hover:text-error transition-colors font-medium cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                Sign In
              </Link>
              <Link to="/login" className="px-5 py-2 rounded-full btn-gradient text-on-primary text-sm font-semibold hover:opacity-90 transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
