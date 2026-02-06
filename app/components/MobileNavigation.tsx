'use client';

import React from 'react';

interface MobileNavigationProps {
  viewMode: 'form' | 'world';
  setViewMode: (tab: 'form' | 'world') => void;
}

export default function MobileNavigation({ viewMode, setViewMode }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-max max-w-[90vw]">
      <div className="flex bg-white/90 backdrop-blur-xl rounded-full p-1.5 shadow-2xl border border-white/40 ring-1 ring-black/5">
        <button
          onClick={() => setViewMode('form')}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            viewMode === 'form'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          <span>Calculator</span>
        </button>
        <button
          onClick={() => setViewMode('world')}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            viewMode === 'world'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>World</span>
        </button>
      </div>
    </div>
  );
}
