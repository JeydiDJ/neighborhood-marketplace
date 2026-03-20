import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link to="/" className="min-w-0" onClick={() => setMenuOpen(false)}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">Local First</p>
            <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">Neighborhood Marketplace</h1>
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
                  Cart
                </Link>
                <Link to="/profile" className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                  Profile
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
        <div className={`${menuOpen ? 'mt-4 grid' : 'hidden'} gap-2 rounded-3xl border border-gray-200 bg-white p-3 shadow-sm md:hidden`}>
          <Link to="/" className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          {user ? (
            <>
              <Link to="/cart" className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                Cart
              </Link>
              <Link to="/profile" className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                Profile
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
      {errorMsg && <p className="mx-auto max-w-7xl px-4 pb-3 text-sm text-red-600 sm:px-6">{errorMsg}</p>}
    </nav>
  );
}
