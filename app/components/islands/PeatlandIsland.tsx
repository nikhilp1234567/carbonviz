'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cone, Cylinder } from '@react-three/drei';
import { IslandProps, getStablePositions, getCircularPositions, IslandBase, AnimatedElement, ISLAND_CONFIG } from './Shared';
import * as THREE from 'three';

// --- Animation Helper ---

const MovingElement = ({ 
  type, 
  speed = 1, 
  intensity = 0.1, 
  children 
}: { 
  type: 'sway' | 'bounce' | 'hop', 
  speed?: number, 
  intensity?: number, 
  children: React.ReactNode 
}) => {
  const ref = useRef<THREE.Group>(null);
  const randomOffset = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime + randomOffset;
      
      if (type === 'sway') {
        // Wind effect for plants
        ref.current.rotation.z = Math.sin(t * speed) * intensity;
        ref.current.rotation.x = Math.cos(t * speed * 0.7) * (intensity * 0.5);
      } else if (type === 'bounce') {
        // Breathing/Idle effect for animals
        ref.current.position.y = Math.sin(t * speed) * intensity;
        ref.current.scale.y = 1 + Math.sin(t * speed) * (intensity * 0.2);
      } else if (type === 'hop') {
        // Occasional hop
        const hop = Math.abs(Math.sin(t * speed));
        if (hop > 0.8) {
           ref.current.position.y = (hop - 0.8) * intensity * 2;
        } else {
           ref.current.position.y = 0;
        }
      }
    }
  });

  return <group ref={ref}>{children}</group>;
};

// --- Fauna Components ---

const WadingBird = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.4}>
    <MovingElement type="hop" speed={2} intensity={0.5}>
      <group position={[0, 0.45, 0]}>
        {/* Long Legs */}
        <Cylinder args={[0.02, 0.02, 0.9]} position={[-0.1, 0.45, 0]}><meshStandardMaterial color="#263238" /></Cylinder>
        <Cylinder args={[0.02, 0.02, 0.9]} position={[0.1, 0.45, 0]}><meshStandardMaterial color="#263238" /></Cylinder>
        {/* Body */}
        <Sphere args={[0.3, 4, 4]} position={[0, 0.9, 0]} scale={[1, 0.8, 1.4]}>
          <meshStandardMaterial color="#cfd8dc" flatShading />
        </Sphere>
        {/* Neck & Head */}
        <Cylinder args={[0.04, 0.03, 0.6]} position={[0, 1.3, 0.2]} rotation={[0.2, 0, 0]}>
          <meshStandardMaterial color="#cfd8dc" />
        </Cylinder>
        <Sphere args={[0.15, 4, 4]} position={[0, 1.6, 0.35]}>
          <meshStandardMaterial color="#cfd8dc" />
        </Sphere>
        {/* Long Beak */}
        <Cone args={[0.03, 0.5, 4]} position={[0, 1.6, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ff7043" />
        </Cone>
      </group>
    </MovingElement>
  </AnimatedElement>
);

const Beaver = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.45}>
    <MovingElement type="bounce" speed={3} intensity={0.05}>
      <group position={[0, 0.25, 0]}>
        {/* Chunky Body */}
        <Box args={[0.6, 0.5, 0.9]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color="#5d4037" />
        </Box>
        {/* Head */}
        <Box args={[0.4, 0.4, 0.4]} position={[0, 0.4, 0.5]}>
          <meshStandardMaterial color="#4e342e" />
        </Box>
        {/* Teeth */}
        <Box args={[0.12, 0.08, 0.05]} position={[0, 0.25, 0.71]}><meshStandardMaterial color="#eeeeee" /></Box>
        {/* Flat Tail */}
        <Box args={[0.3, 0.05, 0.6]} position={[0, 0.1, -0.6]} rotation={[-0.1, 0, 0]}>
          <meshStandardMaterial color="#3e2723" roughness={0.8} />
        </Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);

const Fox = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.5}>
    <MovingElement type="bounce" speed={2.5} intensity={0.03}>
      <group position={[0, 0.35, 0]}>
        {/* Body */}
        <Box args={[0.4, 0.4, 0.9]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#e65100" />
        </Box>
        {/* Head */}
        <group position={[0, 0.5, 0.5]}>
          <Box args={[0.3, 0.3, 0.35]}><meshStandardMaterial color="#e65100" /></Box>
          <Box args={[0.15, 0.15, 0.2]} position={[0, -0.05, 0.25]}><meshStandardMaterial color="#fff" /></Box>
          <Box args={[0.08, 0.08, 0.1]} position={[0, 0.05, 0.35]}><meshStandardMaterial color="#212121" /></Box>
          {/* Ears */}
          <Cone args={[0.08, 0.2, 4]} position={[0.1, 0.25, 0]}><meshStandardMaterial color="#e65100" /></Cone>
          <Cone args={[0.08, 0.2, 4]} position={[-0.1, 0.25, 0]}><meshStandardMaterial color="#e65100" /></Cone>
        </group>
        {/* Tail */}
        <group position={[0, 0.3, -0.6]} rotation={[0.6, 0, 0]}>
           <Box args={[0.2, 0.2, 0.5]}><meshStandardMaterial color="#e65100" /></Box>
           <Box args={[0.15, 0.15, 0.2]} position={[0, 0, -0.35]}><meshStandardMaterial color="#fff" /></Box>
        </group>
        {/* Legs */}
        <Box args={[0.1, 0.35, 0.1]} position={[0.15, 0, 0.3]}><meshStandardMaterial color="#212121" /></Box>
        <Box args={[0.1, 0.35, 0.1]} position={[-0.15, 0, 0.3]}><meshStandardMaterial color="#212121" /></Box>
        <Box args={[0.1, 0.35, 0.1]} position={[0.15, 0, -0.3]}><meshStandardMaterial color="#212121" /></Box>
        <Box args={[0.1, 0.35, 0.1]} position={[-0.15, 0, -0.3]}><meshStandardMaterial color="#212121" /></Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);

// --- Flora Components ---

const HeatherShrub = () => (
  <MovingElement type="sway" speed={1.5} intensity={0.1}>
    <group position={[0, 0.2, 0]}>
      <Sphere args={[0.35, 4, 4]} position={[0, 0, 0]} scale={[1, 0.7, 1]}>
         <meshStandardMaterial color="#5d4037" flatShading />
      </Sphere>
      {(() => {
        // Pick green or red randomly for the shrub highlight colors, every render can be different
        const highlightColors = ["#388e3c", "#689f38"] 
        return (
          <>
            <Sphere args={[0.25, 4, 4]} position={[0.15, 0.25, 0]} scale={[1, 0.7, 1]}>
              <meshStandardMaterial color={highlightColors[0]} flatShading />
            </Sphere>
            <Sphere args={[0.2, 4, 4]} position={[-0.15, 0.2, 0.15]} scale={[1, 0.7, 1]}>
              <meshStandardMaterial color={highlightColors[1]} flatShading />
            </Sphere>
          </>
        );
      })()}
    </group>
  </MovingElement>
);

const SedgeGrass = () => (
  <MovingElement type="sway" speed={2} intensity={0.15}>
    <group position={[0, 0, 0]}>
       <Cone args={[0.04, 0.6, 3]} position={[0, 0.3, 0]} rotation={[0.1, 0, 0]}><meshStandardMaterial color="#827717" /></Cone>
       <Cone args={[0.04, 0.5, 3]} position={[0.05, 0.25, 0.05]} rotation={[-0.1, 0.2, 0.2]}><meshStandardMaterial color="#9e9d24" /></Cone>
       <Cone args={[0.04, 0.7, 3]} position={[-0.05, 0.35, -0.05]} rotation={[0.05, -0.2, -0.1]}><meshStandardMaterial color="#afb42b" /></Cone>
    </group>
  </MovingElement>
);

// --- Terrain Details ---

const Puddle = ({ scale }: { scale: number }) => (
  <Cylinder args={[scale, scale, 0.02, 12]} position={[0, 0.01, 0]}>
    <meshStandardMaterial color="#1a237e" roughness={0.1} metalness={0.1} opacity={0.8} transparent />
  </Cylinder>
);

const MossPatch = ({ scale }: { scale: number }) => (
  <Cylinder args={[scale, scale, 0.02, 9]} position={[0, 0.015, 0]}>
    <meshStandardMaterial color="#558b2f" flatShading />
  </Cylinder>
);

// --- Main Component ---

export const PeatlandIsland = ({ health }: IslandProps) => {
  // 1. Surface Details (Puddles & Moss) - "Painted" on the flat ground
  const details = useMemo(() => getCircularPositions(60, ISLAND_CONFIG.contentRadius, 800), []);
  
  // 2. Plants - Placed on top of ground (y=0)
  const plants = useMemo(() => getCircularPositions(180, ISLAND_CONFIG.contentRadius, 450), []);
  
  // 3. Fauna - Placed on top of ground (y=0)
  const animals = useMemo(() => {
     const all = getCircularPositions(12, ISLAND_CONFIG.faunaRadius - 0.5, 202);
     return all.map((p, i) => ({
       ...p,
       type: i % 3 // 0: Beaver, 1: Bird, 2: Fox
     }));
  }, []);

  return (
    <group>
      {/* 1. SOLID FLAT BASE (No Mounds = No Clipping) */}
      <IslandBase color="#3e2723" health={health} />

      {/* 2. TERRAIN DETAILS (Flat discs on surface) */}
      {details.map((item, i) => {
        const isPuddle = i % 3 === 0; // 1/3 are puddles
        // Scale variation
        const s = 0.5 + item.scale * 1.5; 
        return (
          <group key={`detail-${i}`} position={item.position} rotation={[0, item.rotation, 0]}>
             {isPuddle ? <Puddle scale={s} /> : <MossPatch scale={s} />}
          </group>
        );
      })}

      {/* 3. FLORA LAYER */}
      {plants.map((item, i) => {
        // Simple logic: Don't place plants exactly where we put puddles? 
        // For simplicity in this low-poly abstract style, overlap is okay (plants growing in water),
        // but since the ground is flat, they won't float in mid-air.
        const type = i % 2; 
        return (
           <group key={`plant-${i}`} position={item.position} rotation={[0, item.rotation, 0]}>
              <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
                 {type === 0 ? <SedgeGrass /> : <HeatherShrub />}
              </AnimatedElement>
           </group>
        )
      })}

      {/* 4. FAUNA LAYER */}
      {animals.map((anim, i) => (
          <group key={`anim-${i}`} position={anim.position} rotation={[0, anim.rotation, 0]}>
            {anim.type === 0 && <Beaver isVisible={health > anim.threshold} />}
            {anim.type === 1 && <WadingBird isVisible={health > anim.threshold} />}
            {anim.type === 2 && <Fox isVisible={health > anim.threshold} />}
          </group>
      ))}

    </group>
  );
};