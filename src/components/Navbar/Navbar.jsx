import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { fetchCartCount } from '../../features/cart/useCart';
import nearbuyLogo from '../../assets/site-brand/nearbuy-logo.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  React.useEffect(() => {
    let ignore = false;

    const loadCartCount = async () => {
      if (!user?.id) {
        setCartCount(0);
        return;
      }

      try {
        const count = await fetchCartCount(user.id);

        if (!ignore) {
          setCartCount(count);
        }
      } catch {
        if (!ignore) {
          setCartCount(0);
        }
      }
    };

    loadCartCount();

    return () => {
      ignore = true;
    };
  }, [user]);

  const handleLogout = async () => {
    setErrorMsg('');

    try {
      await logout();
      setMenuOpen(false);
      navigate('/login');
    } catch (error) {
      setErrorMsg(error.message || 'Unable to log out right now.');
    }
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur animate-fade-down">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img src={nearbuyLogo} alt="NearBuy" className="h-12 w-12 rounded-2xl object-cover shadow-sm sm:h-14 sm:w-14" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">NearBuy</p>
              <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">Buy nearby. Sell faster.</h1>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(open => !open)}
            className="inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 md:hidden"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/" className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700">
              Home
            </Link>
            <Link to="/products" className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700">
              Products
            </Link>
            {user ? (
              <>
                <Link to="/cart" className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                  Cart{cartCount > 0 ? ` (${cartCount})` : ''}
                </Link>
                <Link to="/profile" className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                  Profile
                </Link>
                <Link to="/messages" className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                  Messages
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                  Login
                </Link>
                <Link to="/signup" className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
            menuOpen ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="animate-soft-pop grid gap-2 rounded-3xl border border-gray-200 bg-white/95 p-3 shadow-sm backdrop-blur">
          <Link to="/" className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          {user ? (
            <>
              <Link to="/cart" className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                Cart{cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
              <Link to="/profile" className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/messages" className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                Messages
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl bg-gray-900 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
        </div>
      </div>
      {errorMsg && <p className="mx-auto max-w-7xl px-4 pb-3 text-sm text-red-600 sm:px-6">{errorMsg}</p>}
    </nav>
  );
}
