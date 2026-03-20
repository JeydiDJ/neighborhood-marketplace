import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { supabase, supabaseConfigError } from './api/supabaseClient'; // Supabase client

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
import Messages from './features/messages/Messages';
import Profile from './features/profile/Profile';
import EditProfile from './features/profile/EditProfile';

function App() {
  // Quick Supabase connection test
  useEffect(() => {
    if (!supabase) {
      return;
    }

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

  if (supabaseConfigError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_#fff7ed_0%,_#f9fafb_100%)] px-4">
        <div className="max-w-2xl rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">Configuration needed</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">Supabase environment variables are missing</h1>
          <p className="mt-4 text-gray-600">
            This app needs your Supabase URL and anon key at build/runtime. In Vercel, add
            {' '}
            <code className="rounded bg-gray-100 px-2 py-1 text-sm">REACT_APP_SUPABASE_URL</code>
            {' '}
            and
            {' '}
            <code className="rounded bg-gray-100 px-2 py-1 text-sm">REACT_APP_SUPABASE_ANON_KEY</code>
            {' '}
            in Project Settings - Environment Variables, then redeploy.
          </p>
          <p className="mt-4 text-sm text-red-600">{supabaseConfigError}</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
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
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages/:conversationId"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
