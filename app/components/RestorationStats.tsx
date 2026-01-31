'use client';

import React from 'react';
import { Ecosystem } from '../utils/carbon';

interface RestorationStatsProps {
  totalTonnes: number;
  restoration: { count: number; label: string; unit: string };
  activeTab: Ecosystem;
}

export default function RestorationStats({ totalTonnes, restoration, activeTab }: RestorationStatsProps) {
  // Dynamic Color Logic for Stats Card
  let cardColorClass = "bg-emerald-900/80 border-emerald-700/30 ring-emerald-400/20 hover:bg-emerald-900/90";
  let titleColorClass = "text-emerald-300";
  let badgeColorClass = "bg-emerald-800/50 text-emerald-200 border-emerald-700/50";

  if (totalTonnes > 20) {
     cardColorClass = "bg-red-900/80 border-red-700/30 ring-red-400/20 hover:bg-red-900/90";
     titleColorClass = "text-red-300";
     badgeColorClass = "bg-red-800/50 text-red-200 border-red-700/50";
  } else if (totalTonnes > 8) {
     cardColorClass = "bg-yellow-900/80 border-yellow-700/30 ring-yellow-400/20 hover:bg-yellow-900/90";
     titleColorClass = "text-yellow-300";
     badgeColorClass = "bg-yellow-800/50 text-yellow-200 border-yellow-700/50";
  }

  return (
    <div className={`backdrop-blur-xl shadow-2xl rounded-3xl p-6 text-white w-full border ring-1 transition-all ${cardColorClass}`}>
      <div className="flex justify-between items-end md:block md:text-right">
        <div>
          <h2 className={`${titleColorClass} text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80`}>Your Impact Equivalent</h2>
          <div className="text-5xl font-black leading-none mb-1 tracking-tight">
            {restoration.count.toLocaleString()}
          </div>
          <div className="text-lg font-bold text-white/90">{restoration.label}</div>
        </div>
        <div className={`mt-0 md:mt-3 inline-block rounded-lg px-3 py-1 text-xs font-medium border ${badgeColorClass}`}>
            {activeTab}
        </div>
      </div>
    </div>
  );
}
