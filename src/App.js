import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

import Login from './features/auth/Login';
import Signup from './features/auth/Signup';

import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';
import ProductCreate from './features/products/ProductCreate';
import ProductEdit from './features/products/ProductEdit';

import Cart from './features/cart/Cart';
import Profile from './features/profile/Profile';
import EditProfile from './features/profile/EditProfile';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/create" element={<ProductCreate />} />
        <Route path="/products/edit/:id" element={<ProductEdit />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;