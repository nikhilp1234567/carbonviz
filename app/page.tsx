'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import CarbonCalculator from './components/CarbonCalculator';
import { ForestIsland, RainforestIsland, MangroveIsland, PeatlandIsland, GrasslandIsland } from './components/Islands';
import LoadingSpinner from './components/LoadingSpinner';
import Logo from './components/Logo';
import { calculateCarbon, calculateRestoration, convertUserOptionsToInputs, UserOptions, Ecosystem } from './utils/carbon';

const ECOSYSTEMS: Ecosystem[] = ['Forest', 'Rainforest', 'Mangrove', 'Peatland', 'Grassland'];

// Benchmark: 35 tonnes is the "Full Density" cap for visualization
const MAX_ANNUAL_TONNES = 35; 

export default function Home() {
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

  const inputs = convertUserOptionsToInputs(options);
  const { totalTonnes } = calculateCarbon(inputs);
  const restoration = calculateRestoration(totalTonnes * 1000, activeTab);

  // LOGIC FIX: Inverted again per user request.
  const visualDensity = Math.max(0.1, Math.min(1, 1 - (totalTonnes / MAX_ANNUAL_TONNES)));

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
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-gradient-to-b bg-blue-300 text-gray-800 font-sans">
      
      {/* --- UI LAYER (SCROLLABLE WRAPPER) --- */}
      {/* Changed: overflow-y-auto allows scrolling on small screens. z-10 puts it above canvas. */}
      <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden no-scrollbar">
        
        {/* CONTAINER with Safe Area Padding */}
        {/* Changed: pt-14 for mobile notch, pb-32 for bottom nav clearance */}
        <div className="w-full min-h-full p-4 pt-14 md:p-8 md:pt-8 pb-32 flex flex-col lg:flex-row justify-between items-start pointer-events-none">
          
          {/* LEFT COLUMN: Calculator & Stats Stacked */}
          {/* Changed: lg:flex for layout switch. md:max-w-md makes tablet view wider/nicer. */}
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
             <div className={`backdrop-blur-xl shadow-2xl rounded-3xl p-6 text-white w-full border ring-1 transition-all ${cardColorClass}`}>
                <div className="flex justify-between items-end md:block md:text-right">
                  <div>
                    <h4 className={`${titleColorClass} text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80`}>Your Impact Equivalent</h4>
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

             {/* 3. Mobile Ecosystem Selector (Visible only on mobile/tablet portrait) */}
             <div className="lg:hidden w-full pointer-events-auto">
                <div className="bg-white/30 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/40 flex flex-wrap justify-center gap-2">
                  {ECOSYSTEMS.map((eco) => (
                    <button
                      key={eco}
                      onClick={() => setActiveTab(eco)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex-grow text-center ${
                        activeTab === eco
                          ? 'bg-emerald-600 text-white shadow-md transform scale-105'
                          : 'bg-white/40 text-gray-700 hover:bg-white/60 hover:text-emerald-800'
                      }`}
                    >
                      {eco}
                    </button>
                  ))}
                </div>
             </div>

          </div>

          {/* TOP RIGHT: Desktop Navigation Tabs */}
          {/* Changed: hidden md:block -> hidden lg:block to prevent overlap on tablets */}
          <div className="hidden lg:block pointer-events-auto sticky top-8">
            <div className="bg-white/30 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/40 flex gap-1">
              {ECOSYSTEMS.map((eco) => (
                <button
                  key={eco}
                  onClick={() => setActiveTab(eco)}
                  className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === eco
                      ? 'bg-emerald-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-white/40 hover:text-emerald-800'
                  }`}
                >
                  {eco}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* --- MOBILE BOTTOM NAV (Fixed outside scroll area) --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden pointer-events-auto w-max max-w-[90vw]">
        <div className="flex bg-white/90 backdrop-blur-xl rounded-full p-1.5 shadow-2xl border border-white/40 ring-1 ring-black/5">
          <button
            onClick={() => setMobileTab('form')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              mobileTab === 'form'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            <span>Calculator</span>
          </button>
          <button
            onClick={() => setMobileTab('world')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              mobileTab === 'world'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>World</span>
          </button>
        </div>
      </div>

      {/* --- 3D SCENE LAYER --- */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [15, 12, 15], fov: 35 }} gl={{ preserveDrawingBuffer: true }}>
           <Suspense fallback={<LoadingSpinner />}>
            <Environment preset="park" />
            <ambientLight intensity={0.6} />
            <directionalLight 
              position={[10, 20, 10]} 
              intensity={1.5} 
              castShadow 
              shadow-mapSize={[1024, 1024]} 
              shadow-bias={-0.0001}
            />
            
            <OrbitControls 
              autoRotate 
              autoRotateSpeed={0.5} 
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 2.2} 
              enableZoom={true} 
              minDistance={10} 
              maxDistance={30}
              target={[0, 0, 0]}
            />

            <Float speed={2} rotationIntensity={0} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
              <group position={[0, 0, 0]} scale={1.8}>
                {activeTab === 'Forest' && <ForestIsland health={visualDensity} />}
                {activeTab === 'Rainforest' && <RainforestIsland health={visualDensity} />}
                {activeTab === 'Mangrove' && <MangroveIsland health={visualDensity} />}
                {activeTab === 'Peatland' && <PeatlandIsland health={visualDensity} />}
                {activeTab === 'Grassland' && <GrasslandIsland health={visualDensity} />}
              </group>
            </Float>

            <ContactShadows position={[0, -5, 0]} opacity={0.3} scale={40} blur={2.5} far={10} resolution={256} color="#004d40" />
           </Suspense>
        </Canvas>
      </div>
    </main>
  );
}