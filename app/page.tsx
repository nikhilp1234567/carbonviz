'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import CarbonCalculator from './components/CarbonCalculator';
import { ForestIsland, RainforestIsland, MangroveIsland, PeatlandIsland, GrasslandIsland } from './components/Islands';
import { calculateCarbon, calculateRestoration, convertUserOptionsToInputs, UserOptions, Ecosystem } from './utils/carbon';

const ECOSYSTEMS: Ecosystem[] = ['Forest', 'Rainforest', 'Mangrove', 'Peatland', 'Grassland'];

export default function Home() {
  const [options, setOptions] = useState<UserOptions>({
    householdSize: '1',
    homeSize: 'Medium',
    carUsage: 'Average',
    flightFrequency: 'Occasional'
  });

  const [activeTab, setActiveTab] = useState<Ecosystem>('Forest');

  // Convert simplified user options to raw carbon inputs on the fly
  const inputs = convertUserOptionsToInputs(options);
  const { totalKg, totalTonnes } = calculateCarbon(inputs);
  const restoration = calculateRestoration(totalKg, activeTab);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-blue-50 via-teal-50 to-emerald-50 text-gray-800 font-sans">
      
      {/* --- UI LAYER (Glassmorphism) --- */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-8">
        
        {/* Header & Calculator (Top Left Floating) */}
        <div className="flex flex-col md:flex-row justify-between items-start w-full gap-4">
          
          <div className="pointer-events-auto w-full max-w-sm">
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
          </div>

          {/* Restoration Stats (Top Right Floating) */}
          <div className="pointer-events-auto w-full md:w-auto">
             <div className="bg-emerald-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-6 text-white min-w-[240px] md:text-right border border-emerald-700/30 ring-1 ring-emerald-400/20 transition-all hover:bg-emerald-900/90">
                <h4 className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">To Neutralize You Need</h4>
                <div className="text-5xl font-black leading-none mb-1 tracking-tight">
                  {restoration.count.toLocaleString()}
                </div>
                <div className="text-lg font-bold text-emerald-100">{restoration.unit}</div>
                <div className="mt-3 inline-block bg-emerald-800/50 rounded-lg px-3 py-1 text-xs text-emerald-200 font-medium border border-emerald-700/50">
                   Restored {activeTab}
                </div>
             </div>
          </div>

        </div>

        {/* Navigation Tabs (Bottom Center Dock) */}
        <div className="pointer-events-auto flex justify-center pb-4 md:pb-8">
          <div className="bg-white/30 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/40 flex gap-1 overflow-x-auto max-w-full">
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
            />

            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
              <group position={[0, -2, 0]}>
                {activeTab === 'Forest' && <ForestIsland count={restoration.count} />}
                {activeTab === 'Rainforest' && <RainforestIsland count={restoration.count} />}
                {activeTab === 'Mangrove' && <MangroveIsland count={restoration.count} />}
                {activeTab === 'Peatland' && <PeatlandIsland count={restoration.count} />}
                {activeTab === 'Grassland' && <GrasslandIsland count={restoration.count} />}
              </group>
            </Float>

            <ContactShadows position={[0, -5, 0]} opacity={0.3} scale={40} blur={2.5} far={10} color="#004d40" />
           </Suspense>
        </Canvas>
      </div>
    </main>
  );
}
