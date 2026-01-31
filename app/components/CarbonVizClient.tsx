'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DomLoadingSpinner from './DomLoadingSpinner';
import Logo from './Logo';
import { calculateCarbon, calculateRestoration, convertUserOptionsToInputs, UserOptions, Ecosystem } from '../utils/carbon';
import RestorationStats from './RestorationStats';
import MobileNavigation from './MobileNavigation';
import EcosystemTabs from './EcosystemTabs';

const CarbonCalculator = dynamic(() => import('./CarbonCalculator'), { 
  loading: () => <div className="p-12 flex justify-center"><DomLoadingSpinner /></div> 
});

const ThreeScene = dynamic(() => import('./ThreeScene'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center bg-blue-300/20"><DomLoadingSpinner /></div>
});

const ECOSYSTEMS: Ecosystem[] = ['Forest', 'Rainforest', 'Mangrove', 'Peatland', 'Grassland'];
const MAX_ANNUAL_TONNES = 35; 

export default function CarbonVizClient() {
  const [options, setOptions] = useState<UserOptions>({
    householdSize: '1',
    homeSize: 'Small',
    carUsage: 'None',
    flightFrequency: 'None',
    diet: 'Vegan',
    recycling: 'Diligent',
    publicTransport: 'None',
    shopping: 'Minimal'
  });

  const [activeTab, setActiveTab] = useState<Ecosystem>('Forest');
  const [mobileTab, setMobileTab] = useState<'form' | 'world'>('form');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const inputs = convertUserOptionsToInputs(options);
  const { totalTonnes } = calculateCarbon(inputs);
  const restoration = calculateRestoration(totalTonnes * 1000, activeTab);

  const visualDensityRaw = Math.max(0.1, Math.min(1, 1 - (totalTonnes / MAX_ANNUAL_TONNES)));
  const visualDensity = Math.round(visualDensityRaw * 1000) / 1000;

  return (
    <>
      {/* --- UI LAYER (SCROLLABLE WRAPPER) --- */}
      <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden no-scrollbar">
        
        {/* CONTAINER with Safe Area Padding */}
        <div className="w-full min-h-full p-4 pt-14 md:p-8 md:pt-8 pb-32 flex flex-col lg:flex-row justify-between items-start pointer-events-none">
          
          {/* LEFT COLUMN: Calculator & Stats Stacked */}
          <div className={`flex flex-col gap-4 w-full max-w-sm md:max-w-md lg:max-w-sm pointer-events-auto transition-opacity duration-300 ${mobileTab === 'world' ? 'hidden lg:flex' : 'flex'}`}>
            
             {/* 1. Calculator Card */}
             <div className="bg-white/40 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-6 transition-all duration-300 hover:bg-white/50 ring-1 ring-white/20">
                <div className="mb-6 border-b border-gray-200/20 pb-4">
                  <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                    <Logo className="w-10 h-10 text-emerald-600" />
                    <span>Carbon<span className="text-emerald-600">Viz</span></span>
                  </h1>
                  <p className="text-sm text-gray-500 font-medium ml-1">Restoration Visualizer</p>
                </div>
                
                <CarbonCalculator options={options} onChange={setOptions} />
                
                <div className="mt-6 pt-5 border-t border-gray-200/20 flex justify-between items-end">
                   <div>
                     <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-widest mb-1">Estimated Footprint</div>
                     <div className="text-4xl font-black text-gray-800 leading-none">
                       {totalTonnes.toFixed(1)}
                     </div>
                   </div>
                   <div className="text-sm font-bold text-emerald-600 mb-1.5 opacity-80">tonnes CO₂ / yr</div>
                </div>
             </div>

             {/* 2. Restoration Stats */}
             <RestorationStats 
                totalTonnes={totalTonnes} 
                restoration={restoration} 
                activeTab={activeTab} 
             />

             {/* 3. Mobile Ecosystem Selector */}
             <EcosystemTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                ecosystems={ECOSYSTEMS} 
                isMobileView={true} 
             />

          </div>

          {/* TOP RIGHT: Desktop Navigation Tabs */}
          <EcosystemTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            ecosystems={ECOSYSTEMS} 
            isMobileView={false} 
          />

        </div>
      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <MobileNavigation mobileTab={mobileTab} setMobileTab={setMobileTab} />

      {/* --- 3D SCENE LAYER --- */}
      <div className="absolute inset-0 z-0">
          <ThreeScene activeTab={activeTab} visualDensity={visualDensity} isMobile={isMobile} />
      </div>
    </>
  );
}
