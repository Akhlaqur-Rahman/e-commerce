
import React from 'react';

export const ProductSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm animate-pulse border border-slate-100 dark:border-slate-700">
    <div className="w-full aspect-square bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-8"></div>
    </div>
  </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);
