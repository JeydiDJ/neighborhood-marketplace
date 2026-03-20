import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between max-w-7xl mx-auto">
        <h1 className="font-bold">Neighborhood Marketplace</h1>
        <div className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </nav>
  );
}