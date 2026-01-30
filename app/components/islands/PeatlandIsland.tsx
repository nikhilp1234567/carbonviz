'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cone, Cylinder } from '@react-three/drei';
import { IslandProps, getStablePositions, getCircularPositions, IslandBase, AnimatedElement, ISLAND_CONFIG, MovingElement } from './Shared';
import * as THREE from 'three';
import { WadingBird } from '../animals/WadingBird';
import { Beaver } from '../animals/Beaver';
import { Fox } from '../animals/Fox';

import { InstancedSedge } from './InstancedSedge';
import { InstancedHeather } from './InstancedHeather';

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

  const sedges = useMemo(() => plants.filter((_, i) => i % 2 === 0), [plants]);
  const heathers = useMemo(() => plants.filter((_, i) => i % 2 !== 0), [plants]);
  
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

      {/* 3. FLORA LAYER (Instanced) */}
      <InstancedSedge items={sedges} health={health} />
      <InstancedHeather items={heathers} health={health} />

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