import React from 'react';

export default function DomLoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin shadow-lg"></div>
      <div className="text-emerald-800 font-bold text-lg tracking-wider animate-pulse">Loading Calculator...</div>
    </div>
  );
}
