import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { supabase } from './api/supabaseClient'; // Supabase client

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import ProtectedRoute from './features/auth/ProtectedRoute';
import { AuthProvider } from './features/auth/useAuth';

import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';
import ProductCreate from './features/products/ProductCreate';
import ProductEdit from './features/products/ProductEdit';

import Cart from './features/cart/Cart';
import Profile from './features/profile/Profile';
import EditProfile from './features/profile/EditProfile';

function App() {
  // Quick Supabase connection test
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Supabase session:', data.session);
      } catch (err) {
        console.error('Supabase connection error:', err.message);
      }
    };
    testConnection();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Protected Routes */}
          <Route
            path="/products/create"
            element={
              <ProtectedRoute>
                <ProductCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <ProtectedRoute>
                <ProductEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
