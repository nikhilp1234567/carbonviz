'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import CarbonCalculator from './components/CarbonCalculator';
import { ForestIsland, RainforestIsland, MangroveIsland, PeatlandIsland, GrasslandIsland } from './components/Islands';
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

  const inputs = convertUserOptionsToInputs(options);
  const { totalKg, totalTonnes } = calculateCarbon(inputs);
  const restoration = calculateRestoration(totalKg, activeTab);

  // LOGIC FIX: Inverted again per user request.
  // Low Carbon = High Density (Lush/Healthy).
  // High Carbon = Low Density (Destroyed).
  // 0 tonnes -> 1.0 density. MAX -> 0.1 density.
  const visualDensity = Math.max(0.1, Math.min(1, 1 - (totalTonnes / MAX_ANNUAL_TONNES)));

  // Dynamic Color Logic for Stats Card
  let cardColorClass = "bg-emerald-900/80 border-emerald-700/30 ring-emerald-400/20 hover:bg-emerald-900/90";
  let titleColorClass = "text-emerald-300";
  let badgeColorClass = "bg-emerald-800/50 text-emerald-200 border-emerald-700/50";

  if (totalTonnes > 20) {
     // High Impact -> Red
     cardColorClass = "bg-red-900/80 border-red-700/30 ring-red-400/20 hover:bg-red-900/90";
     titleColorClass = "text-red-300";
     badgeColorClass = "bg-red-800/50 text-red-200 border-red-700/50";
  } else if (totalTonnes > 8) {
     // Medium Impact -> Yellow/Orange
     cardColorClass = "bg-yellow-900/80 border-yellow-700/30 ring-yellow-400/20 hover:bg-yellow-900/90";
     titleColorClass = "text-yellow-300";
     badgeColorClass = "bg-yellow-800/50 text-yellow-200 border-yellow-700/50";
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-blue-50 via-teal-50 to-emerald-50 text-gray-800 font-sans">
      
      {/* --- UI LAYER --- */}
      <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8">
        
        {/* TOP LAYER WRAPPER */}
        <div className="flex flex-col md:flex-row justify-between items-start w-full h-full relative">
          
          {/* LEFT COLUMN: Calculator & Stats Stacked */}
          <div className="flex flex-col gap-4 w-full max-w-sm pointer-events-auto">
            
             {/* 1. Calculator Card */}
             <div className="bg-white/40 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-6 transition-all duration-300 hover:bg-white/50 ring-1 ring-white/20">
                <div className="mb-6 border-b border-gray-200/20 pb-4">
                  <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                    Carbon<span className="text-emerald-600">Viz</span>
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

             {/* 2. Restoration Stats (Moved below Calculator) */}
             <div className={`backdrop-blur-xl shadow-2xl rounded-3xl p-6 text-white w-full border ring-1 transition-all ${cardColorClass}`}>
                <div className="flex justify-between items-end md:block md:text-right">
                  <div>
                    <h4 className={`${titleColorClass} text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80`}>Your Impact Equivalent</h4>
                    <div className="text-5xl font-black leading-none mb-1 tracking-tight">
                      {restoration.count.toLocaleString()}
                    </div>
                    <div className="text-lg font-bold text-white/90">{restoration.unit} Destroyed / Yr</div>
                  </div>
                  <div className={`mt-0 md:mt-3 inline-block rounded-lg px-3 py-1 text-xs font-medium border ${badgeColorClass}`}>
                     {activeTab} Loss
                  </div>
                </div>
             </div>

          </div>

          {/* TOP RIGHT: Navigation Tabs (Moved from Bottom) */}
          <div className="pointer-events-auto absolute top-0 right-0 md:relative">
            <div className="bg-white/30 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/40 flex gap-1 overflow-x-auto max-w-[calc(100vw-2rem)] md:max-w-none">
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

      {/* --- 3D SCENE LAYER --- */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [15, 12, 15], fov: 35 }}>
           <Suspense fallback={null}>
            <Environment preset="park" />
            <ambientLight intensity={0.6} />
            <directionalLight 
              position={[10, 20, 10]} 
              intensity={1.5} 
              castShadow 
              shadow-mapSize={[2048, 2048]} 
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

            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
              {/* Position Change: Moved to [9, 0, 0] and scaled up */}
              <group position={[0, 0, 0]} scale={1.3}>
                {activeTab === 'Forest' && <ForestIsland health={visualDensity} />}
                {activeTab === 'Rainforest' && <RainforestIsland health={visualDensity} />}
                {activeTab === 'Mangrove' && <MangroveIsland health={visualDensity} />}
                {activeTab === 'Peatland' && <PeatlandIsland health={visualDensity} />}
                {activeTab === 'Grassland' && <GrasslandIsland health={visualDensity} />}
              </group>
            </Float>

            <ContactShadows position={[0, -5, 0]} opacity={0.3} scale={40} blur={2.5} far={10} color="#004d40" />
           </Suspense>
        </Canvas>
      </div>
    </main>
  );
}