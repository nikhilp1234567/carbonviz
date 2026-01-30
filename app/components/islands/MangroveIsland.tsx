'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Cone } from '@react-three/drei';
import { IslandProps, getStablePositions, getCircularPositions, AnimatedElement, ISLAND_CONFIG } from './Shared';
import * as THREE from 'three';
import { Crab } from '../animals/Crab';
import { Turtle } from '../animals/Turtle';
import { Shark } from '../animals/Shark';
import { FishSchool } from '../animals/FishSchool';

// --- Assets ---

// 1. Classic Mangrove (Original style)
const MangroveClassic = () => (
  <group>
    {/* Prop Roots */}
    <group position={[0, 0.4, 0]}>
       <Cylinder args={[0.04, 0.02, 1]} position={[0.2, -0.2, 0.2]} rotation={[-0.4, 0, 0.4]}><meshStandardMaterial color="#5d4037" /></Cylinder>
       <Cylinder args={[0.04, 0.02, 1]} position={[-0.2, -0.2, 0.2]} rotation={[-0.4, 0, -0.4]}><meshStandardMaterial color="#5d4037" /></Cylinder>
       <Cylinder args={[0.04, 0.02, 1]} position={[0, -0.2, -0.25]} rotation={[0.4, 0, 0]}><meshStandardMaterial color="#5d4037" /></Cylinder>
       <Cylinder args={[0.03, 0.02, 0.8]} position={[0, 0.1, 0]} rotation={[0, 0, 0]}><meshStandardMaterial color="#5d4037" /></Cylinder>
    </group>
    {/* Trunk */}
    <Cylinder args={[0.08, 0.1, 0.8]} position={[0, 0.8, 0]}><meshStandardMaterial color="#795548" /></Cylinder>
    {/* Canopy */}
    <group position={[0, 1.4, 0]}>
       <Sphere args={[0.5, 5, 5]} position={[0, 0, 0]} scale={[1, 0.6, 1]}><meshStandardMaterial color="#2e7d32" flatShading /></Sphere>
       <Sphere args={[0.4, 5, 5]} position={[0.3, 0.1, 0]} scale={[1, 0.6, 1]}><meshStandardMaterial color="#388e3c" flatShading /></Sphere>
       <Sphere args={[0.4, 5, 5]} position={[-0.3, 0.2, 0.2]} scale={[1, 0.6, 1]}><meshStandardMaterial color="#1b5e20" flatShading /></Sphere>
    </group>
  </group>
);

// 2. Tall & Curved Mangrove
const MangroveTall = () => (
  <group>
     {/* Higher Roots */}
    <group position={[0, 0.5, 0]}>
       <Cylinder args={[0.03, 0.02, 1.2]} position={[0.15, -0.3, 0.15]} rotation={[-0.3, 0, 0.3]}><meshStandardMaterial color="#6d4c41" /></Cylinder>
       <Cylinder args={[0.03, 0.02, 1.2]} position={[-0.15, -0.3, -0.15]} rotation={[0.3, 0, -0.3]}><meshStandardMaterial color="#6d4c41" /></Cylinder>
    </group>
    {/* Curved Trunk */}
    <group position={[0, 0.8, 0]} rotation={[0.2, 0, 0]}>
        <Cylinder args={[0.07, 0.09, 1.0]} position={[0, 0.2, 0]}><meshStandardMaterial color="#795548" /></Cylinder>
        {/* Split Canopy */}
        <group position={[0, 0.8, 0]}>
           <Sphere args={[0.45, 5, 5]} position={[0.2, 0.2, 0]} scale={[1, 0.8, 1]}><meshStandardMaterial color="#43a047" flatShading /></Sphere>
           <Sphere args={[0.4, 5, 5]} position={[-0.2, 0.4, 0]} scale={[1, 0.8, 1]}><meshStandardMaterial color="#2e7d32" flatShading /></Sphere>
        </group>
    </group>
  </group>
);

// 3. Bushy/Sprawling Mangrove
const MangroveBushy = () => (
  <group>
    {/* Wide Roots */}
    <group position={[0, 0.3, 0]}>
       <Cylinder args={[0.04, 0.02, 0.8]} position={[0.3, -0.2, 0]} rotation={[0, 0, 0.6]}><meshStandardMaterial color="#4e342e" /></Cylinder>
       <Cylinder args={[0.04, 0.02, 0.8]} position={[-0.3, -0.2, 0]} rotation={[0, 0, -0.6]}><meshStandardMaterial color="#4e342e" /></Cylinder>
       <Cylinder args={[0.04, 0.02, 0.8]} position={[0, -0.2, 0.3]} rotation={[0.6, 0, 0]}><meshStandardMaterial color="#4e342e" /></Cylinder>
       <Cylinder args={[0.04, 0.02, 0.8]} position={[0, -0.2, -0.3]} rotation={[-0.6, 0, 0]}><meshStandardMaterial color="#4e342e" /></Cylinder>
    </group>
    {/* Short Trunk */}
    <Cylinder args={[0.09, 0.12, 0.6]} position={[0, 0.6, 0]}><meshStandardMaterial color="#5d4037" /></Cylinder>
    {/* Wide Bushy Canopy */}
    <group position={[0, 1.0, 0]}>
       <Sphere args={[0.6, 5, 5]} position={[0, 0, 0]} scale={[1.2, 0.5, 1.2]}><meshStandardMaterial color="#33691e" flatShading /></Sphere>
       <Sphere args={[0.5, 5, 5]} position={[0, 0.3, 0]} scale={[1, 0.6, 1]}><meshStandardMaterial color="#558b2f" flatShading /></Sphere>
    </group>
  </group>
);

const MangroveTree = ({ variant }: { variant: number }) => {
   // Select variant based on the number passed
   const v = variant % 3;
   if (v === 0) return <MangroveClassic />;
   if (v === 1) return <MangroveTall />;
   return <MangroveBushy />;
};

// Animated rotating group for sharks/fish
const SwimmingGroup = ({ children, radius, speed, reverse = false }: { children: React.ReactNode, radius: number, speed: number, reverse?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed * (reverse ? -1 : 1);
    }
  });
  return (
    <group ref={groupRef}>
      <group position={[radius, 0, 0]}>
         {children}
      </group>
    </group>
  );
}

// --- Main Island Component ---

export const MangroveIsland = ({ health }: IslandProps) => {
  
  const waterRadius = ISLAND_CONFIG.radius + 1;
  const beachRadius = ISLAND_CONFIG.radius * 0.7;

  // 1. Trees: Positioned on Beach (inner) AND in Water (outer)
  // Beach radius is ~5.6. We generate trees from radius 2.5 to 8.5 (water edge).
  const trees = useMemo(() => {
    const all = getCircularPositions(90, waterRadius, 600);
    return all.filter(p => {
       const r = Math.sqrt(p.position[0]**2 + p.position[2]**2);
       // Keep trees that are not in the very center (clear for animals) but extend out to water
       return r > 2.5 && r < (waterRadius - 0.5);
    });
  }, []);

  // 2. Beach Fauna: On the sand (radius < 4.5)
  const beachFauna = useMemo(() => {
    const all = getCircularPositions(10, beachRadius * 0.8, 202); 
    return all.map((p, i) => ({
      ...p,
      type: i % 2 === 0 ? 'crab' : 'turtle',
    }));
  }, []);

  return (
    <group>
      
      {/* --- TERRAIN --- */}
      
      {/* 1. Deep Water Base (Emerald) */}
      <Cylinder args={[waterRadius, waterRadius, 1.5, 64]} position={[0, -1.0, 0]}>
         <meshStandardMaterial color="#004d40" opacity={0.8} transparent roughness={0.1} />
      </Cylinder>
      
      {/* 2. Central Sandy Beach Island */}
      <Cylinder args={[beachRadius, beachRadius + 1, 2, 64]} position={[0, -0.8, 0]}>
         <meshStandardMaterial color="#eebb99" />
      </Cylinder>
      {/* Beach Top Layer */}
      <Cylinder args={[beachRadius, beachRadius, 0.1, 64]} position={[0, 0.2, 0]}>
         <meshStandardMaterial color="#ffccbc" />
      </Cylinder>


      {/* --- FLORA (Mangroves) --- */}
      {trees.map((item, i) => (
        <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
          <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
             {/* Pass variant index to get different tree styles */}
             <MangroveTree variant={item.variant} />
          </AnimatedElement>
        </group>
      ))}


      {/* --- FAUNA (Land) --- */}
      {beachFauna.map((anim, i) => (
        <group key={`land-${i}`} position={anim.position} rotation={[0, anim.rotation, 0]}>
           {anim.type === 'crab' ? 
              <Crab isVisible={health > anim.threshold} /> : 
              <Turtle isVisible={health > anim.threshold} />
           }
        </group>
      ))}


      {/* --- FAUNA (Water) --- */}
      
      {/* Shark Lane 1 */}
      <SwimmingGroup radius={waterRadius - 1} speed={0.4} reverse={false}>
         <group rotation={[0, Math.PI, 0]}> 
            <Shark isVisible={health > 0.4} />
         </group>
      </SwimmingGroup>

      {/* Shark Lane 2 (Offset) */}
      <group rotation={[0, 2, 0]}>
        <SwimmingGroup radius={waterRadius} speed={0.3} reverse={true}>
          <group rotation={[0, 0, 0]}> 
              <Shark isVisible={health > 0.7} />
          </group>
        </SwimmingGroup>
      </group>

      {/* Fish School - Red */}
      <group rotation={[0, 0, 0]}>
        <SwimmingGroup radius={waterRadius - 2.4} speed={0.6}>
          <FishSchool isVisible={health > 0.2} color="#f44336" />
        </SwimmingGroup>
      </group>

      {/* Fish School - Yellow */}
      <group rotation={[0, 1, 0]}>
        <SwimmingGroup radius={waterRadius - 2} speed={0.64}>
          <FishSchool isVisible={health > 0.3} color="#ffeb3b" />
        </SwimmingGroup>
      </group>

      {/* Fish School - Green */}
      <group rotation={[0, 2, 0]}>
        <SwimmingGroup radius={waterRadius - 1.8} speed={0.68} reverse>
          <FishSchool isVisible={health > 0.45} color="#4caf50" />
        </SwimmingGroup>
      </group>

      {/* Fish School - Blue */}
      <group rotation={[0, 3, 0]}>
        <SwimmingGroup radius={waterRadius - 1.5} speed={0.7} reverse>
          <FishSchool isVisible={health > 0.6} color="#03a9f4" />
        </SwimmingGroup>
      </group>

      {/* Fish School - Purple */}
      <group rotation={[0, 4, 0]}>
        <SwimmingGroup radius={waterRadius - 1.2} speed={0.8}>
          <FishSchool isVisible={health > 0.75} color="#9c27b0" />
        </SwimmingGroup>
      </group>

    </group>
  );
};