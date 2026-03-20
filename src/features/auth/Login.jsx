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

  const handleLogin = async (e) => {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        <p className="mt-3 text-center text-sm">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot your password?</Link>
        </p>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
