import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate, Link, Navigate } from 'react-router-dom';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, user, loading } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async e => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await signup({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
      const message = data.session
        ? 'Account created successfully. You are now signed in.'
        : 'Account created. Check your email for the confirmation link before logging in.';

      setSuccessMsg(message);

      if (data.session) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to create your account right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="ambient-shell bg-[linear-gradient(180deg,_#eefbf7_0%,_#f9fafb_30%,_#f9fafb_100%)]">
      <div className="ambient-orb ambient-orb-emerald" />
      <div className="ambient-orb ambient-orb-cyan" />
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="animate-fade-up rounded-[2rem] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white shadow-lg sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100">Join the marketplace</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Create your account and start selling locally</h1>
          <p className="mt-4 text-sm leading-7 text-emerald-50 sm:text-base">
            Set up your seller identity, post useful items, and start building trust with nearby buyers.
          </p>
        </div>

        <form onSubmit={handleSignup} className="animate-fade-up-delayed rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Account setup</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Sign up</h2>
          <p className="mt-3 text-gray-600">Create your account to list products and manage your seller profile.</p>

          {errorMsg && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errorMsg}</div>}
          {successMsg && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMsg}</div>}

          <div className="mt-6 grid gap-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">Full name</span>
              <input
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Password</span>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Confirm password</span>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-medium text-emerald-700 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
