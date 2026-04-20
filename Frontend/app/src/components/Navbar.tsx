import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, isVendor, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <span className="text-xl font-black tracking-tight text-on-surface">Siddham</span>
          <span className="text-[10px] tracking-[0.2em] text-on-surface-variant uppercase mt-1">Coolers</span>
        </Link>

        {/* Center nav links (Desktop) */}
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

        {/* Right actions (Desktop & Mobile shared) */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {(!isAdmin && !isVendor) && (
                <Link to="/checkout" className="text-on-surface-variant hover:text-on-surface transition-colors mr-2 sm:mr-0 cursor-pointer relative top-0.5">
                  <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                </Link>
              )}
              {/* User badge (Hidden on smallest mobile, shown in menu) */}
              <Link to={user?.role === 'customer' ? "/profile" : user?.role === 'admin' ? "/admin" : "/vendor"} className="hidden sm:flex items-center gap-2 bg-surface-container rounded-full px-3 py-1.5 hover:bg-surface-container-high transition-colors cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-on-primary text-xs font-bold">{user?.name?.charAt(0)}</span>
                </div>
                <span className="text-xs font-medium text-on-surface max-w-[100px] truncate">{user?.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold uppercase">
                  {user?.role === 'retailer' ? 'vendor' : user?.role}
                </span>
              </Link>
              <button onClick={handleLogout} className="hidden sm:block text-sm text-on-surface-variant hover:text-error transition-colors font-medium cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                Sign In
              </Link>
              <Link to="/login" className="px-5 py-2 rounded-full btn-gradient text-on-primary text-sm font-semibold hover:opacity-90 transition-all">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button 
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-on-surface transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}></span>
            <span className={`block w-6 h-0.5 bg-on-surface transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100 my-1'}`}></span>
            <span className={`block w-6 h-0.5 bg-on-surface transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-surface-container-lowest border-b border-outline-variant/10 ambient-shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-medium transition-colors ${
                location.pathname === link.path ? 'text-primary' : 'text-on-surface hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-on-surface hover:text-primary">
              Dashboard
            </Link>
          )}
          {isVendor && (
            <Link to="/vendor" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-on-surface hover:text-primary">
              My Portal
            </Link>
          )}
          
          <div className="h-px w-full bg-outline-variant/20 my-2" />
          
          {isAuthenticated ? (
            <>
              <Link to={user?.role === 'customer' ? "/profile" : user?.role === 'admin' ? "/admin" : "/vendor"} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-on-primary text-sm font-bold">{user?.name?.charAt(0)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-on-surface block">{user?.name}</span>
                  <span className="text-[10px] text-primary block uppercase">{user?.role === 'retailer' ? 'vendor' : user?.role}</span>
                </div>
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-left text-error font-medium py-2 mt-2 w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2 text-on-surface font-medium border border-outline-variant/30 rounded-xl">
                Sign In
              </Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2 btn-gradient text-on-primary font-semibold rounded-xl">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
