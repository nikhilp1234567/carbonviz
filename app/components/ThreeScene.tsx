'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import LoadingSpinner from './LoadingSpinner';
import { Ecosystem } from '../utils/carbon';

const ForestIsland = dynamic(() => import('./islands/ForestIsland').then((mod) => mod.ForestIsland));
const RainforestIsland = dynamic(() => import('./islands/RainforestIsland').then((mod) => mod.RainforestIsland));
const MangroveIsland = dynamic(() => import('./islands/MangroveIsland').then((mod) => mod.MangroveIsland));
const PeatlandIsland = dynamic(() => import('./islands/PeatlandIsland').then((mod) => mod.PeatlandIsland));
const GrasslandIsland = dynamic(() => import('./islands/GrasslandIsland').then((mod) => mod.GrasslandIsland));

interface ThreeSceneProps {
    activeTab: Ecosystem;
    visualDensity: number;
    isMobile: boolean;
}

export default function ThreeScene({ activeTab, visualDensity, isMobile }: ThreeSceneProps) {
    return (
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
                    <group position={[0, 0, 0]} scale={isMobile ? 1 : 1.8}>
                        {activeTab === 'Forest' && <ForestIsland health={visualDensity} />}
                        {activeTab === 'Rainforest' && <RainforestIsland health={visualDensity} />}
                        {activeTab === 'Mangrove' && <MangroveIsland health={visualDensity} />}
                        {activeTab === 'Peatland' && <PeatlandIsland health={visualDensity} />}
                        {activeTab === 'Grassland' && <GrasslandIsland health={visualDensity} />}
                    </group>
                </Float>
            </Suspense>
        </Canvas>
    );
}
