import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState('');

  const redirectTo = location.state?.from?.pathname || '/';

  const handleLogin = async e => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Unable to log in right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <section className="bg-[linear-gradient(180deg,_#fffaf5_0%,_#f9fafb_30%,_#f9fafb_100%)]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="animate-fade-up rounded-[2rem] bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 p-6 text-white shadow-lg sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-100">Welcome back</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Log in and pick up where your marketplace left off</h1>
          <p className="mt-4 text-sm leading-7 text-orange-50 sm:text-base">
            Check saved listings, manage your products, and keep the neighborhood marketplace moving.
          </p>
        </div>

        <form onSubmit={handleLogin} className="animate-fade-up-delayed rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Account access</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Login</h2>
          <p className="mt-3 text-gray-600">Use your email and password to access your account.</p>

          {errorMsg && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errorMsg}</div>}

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
              required
            />
          </label>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
              required
            />
          </label>

          <button
            type="submit"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <p className="mt-4 text-center text-sm">
            <Link to="/forgot-password" className="font-medium text-orange-700 hover:underline">Forgot your password?</Link>
          </p>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account? <Link to="/signup" className="font-medium text-orange-700 hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
