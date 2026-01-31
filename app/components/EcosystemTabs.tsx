'use client';

import React from 'react';
import { Ecosystem } from '../utils/carbon';

interface EcosystemTabsProps {
  activeTab: Ecosystem;
  setActiveTab: (tab: Ecosystem) => void;
  ecosystems: Ecosystem[];
  isMobileView?: boolean;
}

export default function EcosystemTabs({ activeTab, setActiveTab, ecosystems, isMobileView = false }: EcosystemTabsProps) {
  if (isMobileView) {
    return (
        <div className="lg:hidden w-full pointer-events-auto">
            <div className="bg-white/30 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/40 flex flex-wrap justify-center gap-2">
                {ecosystems.map((eco) => (
                <button
                    key={eco}
                    onClick={() => setActiveTab(eco)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex-grow text-center ${
                    activeTab === eco
                        ? 'bg-emerald-600 text-white shadow-md transform scale-105'
                        : 'bg-white/40 text-gray-700 hover:bg-white/60 hover:text-emerald-900'
                    }`}
                >
                    {eco}
                </button>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="hidden lg:block pointer-events-auto sticky top-8">
        <div className="bg-white/30 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/40 flex gap-1">
            {ecosystems.map((eco) => (
            <button
                key={eco}
                onClick={() => setActiveTab(eco)}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                activeTab === eco
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-white/50 hover:text-emerald-900'
                }`}
            >
                {eco}
            </button>
            ))}
        </div>
    </div>
  );
}