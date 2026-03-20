import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecoverySession, setIsRecoverySession] = useState(null);
  const { user, loading, updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash || '';
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    const type = params.get('type');

    setIsRecoverySession(type === 'recovery');
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

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
      await updatePassword(password);
      setSuccessMsg('Password updated successfully. Redirecting to login...');
      window.history.replaceState(null, '', '/reset-password');
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to update your password right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (isRecoverySession === null) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!user && !isRecoverySession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded bg-white px-8 py-6 shadow-md">
          <h2 className="mb-3 text-center text-2xl font-bold">Reset password</h2>
          <p className="text-center text-sm text-gray-600">
            Open the password reset link from your email to continue.
          </p>
          <p className="mt-4 text-center text-sm text-gray-600">
            Need a new link? <Link to="/forgot-password" className="text-blue-500 hover:underline">Request another reset email</Link>
          </p>
        </div>
      </div>
    );
  }

  if (user && !isRecoverySession) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded bg-white px-8 py-6 shadow-md">
        <h2 className="mb-2 text-center text-2xl font-bold">Choose a new password</h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your new password below to finish resetting your account.
        </p>
        {errorMsg && <p className="mb-4 text-sm text-red-500">{errorMsg}</p>}
        {successMsg && <p className="mb-4 text-sm text-green-600">{successMsg}</p>}
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-4 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="mb-6 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-500 py-2 font-bold text-white hover:bg-blue-600 disabled:opacity-70"
        >
          {isSubmitting ? 'Updating password...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
