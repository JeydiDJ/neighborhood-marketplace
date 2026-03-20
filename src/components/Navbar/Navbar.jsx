import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogout = async () => {
    setErrorMsg('');

    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setErrorMsg(error.message || 'Unable to log out right now.');
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between max-w-7xl mx-auto items-center">
        <h1 className="font-bold">Neighborhood Marketplace</h1>
        <div className="flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          {user ? (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/profile">Profile</Link>
              <button type="button" onClick={handleLogout} className="rounded border border-white/30 px-3 py-1">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
      {errorMsg && <p className="mx-auto mt-2 max-w-7xl text-sm text-red-300">{errorMsg}</p>}
    </nav>
  );
}
