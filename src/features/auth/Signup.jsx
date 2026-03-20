import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await signup(email, password);
      alert('Signup successful! Please check your email to confirm.');
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSignup} className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
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
        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded">
          Sign Up
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}