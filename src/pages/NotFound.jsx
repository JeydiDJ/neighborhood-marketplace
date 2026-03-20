import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-gray-600">The page you requested does not exist.</p>
      <Link className="mt-6 inline-block text-blue-600 hover:underline" to="/">
        Return home
      </Link>
    </main>
  );
}
