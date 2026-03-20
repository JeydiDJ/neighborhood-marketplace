import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`rounded border border-gray-200 bg-white p-4 shadow-sm ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
