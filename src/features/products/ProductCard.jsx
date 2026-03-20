import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="animate-fade-up overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-gray-500">
            No image yet
          </div>
        )}
      </div>
      <div className="p-5">
        {product.category?.name && (
          <p className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            {product.category.name}
          </p>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Posted {new Date(product.created_at).toLocaleDateString()}
            </p>
          </div>
          <p className="shrink-0 text-lg font-bold text-emerald-700">
            ${Number(product.price ?? 0).toFixed(2)}
          </p>
        </div>
        <p className="mt-3 min-h-[3rem] text-sm leading-6 text-gray-600">
          {product.description || 'No description provided.'}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="min-w-0 text-sm text-gray-500">
            Seller: {product.seller?.full_name || 'Unknown seller'}
          </p>
          <Link
            className="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
            to={`/products/${product.id}`}
          >
            View listing
          </Link>
        </div>
      </div>
    </article>
  );
}
