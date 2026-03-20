import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendPasswordReset } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await sendPasswordReset(email);
      setSuccessMsg('Password reset email sent. Check your inbox for the recovery link.');
    } catch (error) {
      setErrorMsg(error.message || 'Unable to send a password reset email right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded bg-white px-8 py-6 shadow-md">
        <h2 className="mb-2 text-center text-2xl font-bold">Forgot password</h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your email and we&apos;ll send you a password reset link.
        </p>
        {errorMsg && <p className="mb-4 text-sm text-red-500">{errorMsg}</p>}
        {successMsg && <p className="mb-4 text-sm text-green-600">{successMsg}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-6 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-500 py-2 font-bold text-white hover:bg-blue-600 disabled:opacity-70"
        >
          {isSubmitting ? 'Sending link...' : 'Send reset link'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Back to <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
