import React from 'react';

export default function Button({ children, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`rounded bg-gray-900 px-4 py-2 text-white transition hover:bg-gray-700 ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
