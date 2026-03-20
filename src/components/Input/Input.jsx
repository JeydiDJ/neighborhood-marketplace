import React from 'react';

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 ${className}`.trim()}
      {...props}
    />
  );
}
