import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white animate-fade-up">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">Neighborhood Marketplace</p>
          <h2 className="mt-3 text-lg font-bold text-gray-900">Keep local buying and selling simple.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
            A mobile-first marketplace for sharing listings, finding nearby deals, and connecting with people in your community.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Explore</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-orange-700">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-orange-700">Products</Link>
            <Link to="/products/create" className="text-gray-600 hover:text-orange-700">Create listing</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Account</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/login" className="text-gray-600 hover:text-orange-700">Login</Link>
            <Link to="/signup" className="text-gray-600 hover:text-orange-700">Sign up</Link>
            <Link to="/profile" className="text-gray-600 hover:text-orange-700">Profile</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-4 text-center text-sm text-gray-500 sm:px-6">
        &copy; {new Date().getFullYear()} Neighborhood Marketplace
      </div>
    </footer>
  );
}
