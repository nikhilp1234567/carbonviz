'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cone, Cylinder, Sphere, Box } from '@react-three/drei';
import { IslandProps, getCircularPositions, IslandBase, AnimatedElement, ISLAND_CONFIG, MovingElement } from './Shared';
import * as THREE from 'three';
import { Bison } from '../animals/Bison';
import { Elk } from '../animals/Elk';
import { GrasslandBear } from '../animals/GrasslandBear';

// --- Flora Components ---

const ShortGrassTuft = () => (
  // Simple tuft for carpeting, static or very low movement
  <group position={[0, 0.05, 0]}>
     <Cone args={[0.03, 0.3, 3]} position={[0.02, 0, 0.02]} rotation={[0.1, 0.5, 0.1]}><meshStandardMaterial color="#aed581" /></Cone>
     <Cone args={[0.03, 0.25, 3]} position={[-0.02, 0, -0.01]} rotation={[-0.1, 0.2, -0.1]}><meshStandardMaterial color="#9ccc65" /></Cone>
     <Cone args={[0.03, 0.2, 3]} position={[0, 0, 0.03]} rotation={[0.2, 1, 0]}><meshStandardMaterial color="#8bc34a" /></Cone>
  </group>
);

const TallPrairieGrass = () => (
  <MovingElement type="sway" speed={2} intensity={0.15}>
    <group position={[0, 0.5, 0]}>
       <Cone args={[0.1, 1.2, 3]} position={[0, 0, 0]} rotation={[0.05, 0, 0]}><meshStandardMaterial color="#c5e1a5" /></Cone>
       <Cone args={[0.08, 1.0, 3]} position={[0.1, -0.1, 0.1]} rotation={[-0.05, 1, 0.05]}><meshStandardMaterial color="#aed581" /></Cone>
       <Cone args={[0.08, 1.1, 3]} position={[-0.1, -0.1, -0.05]} rotation={[0.05, 2, -0.05]}><meshStandardMaterial color="#dcedc8" /></Cone>
    </group>
  </MovingElement>
);

const WheatStalks = () => (
  <MovingElement type="sway" speed={1.5} intensity={0.2}>
    <group position={[0, 0.6, 0]}>
       {/* Stalk 1 */}
       <Cylinder args={[0.02, 0.02, 1.2]} position={[0, 0, 0]}><meshStandardMaterial color="#f0f4c3" /></Cylinder>
       <Box args={[0.06, 0.25, 0.06]} position={[0, 0.6, 0]}><meshStandardMaterial color="#fff59d" /></Box>
       {/* Stalk 2 */}
       <Cylinder args={[0.02, 0.02, 1.0]} position={[0.15, -0.1, 0]} rotation={[0, 0, -0.1]}><meshStandardMaterial color="#f0f4c3" /></Cylinder>
       <Box args={[0.06, 0.25, 0.06]} position={[0.2, 0.45, 0]} rotation={[0, 0, -0.1]}><meshStandardMaterial color="#fff59d" /></Box>
    </group>
  </MovingElement>
);

const FloweringShrub = () => (
  <MovingElement type="sway" speed={3} intensity={0.05}>
    <group position={[0, 0.25, 0]}>
      <Sphere args={[0.4, 5, 5]} position={[0, 0, 0]} scale={[1, 0.7, 1]}><meshStandardMaterial color="#689f38" flatShading /></Sphere>
      <Sphere args={[0.3, 5, 5]} position={[0.25, 0.2, 0]} scale={[1, 0.7, 1]}><meshStandardMaterial color="#7cb342" flatShading /></Sphere>
      {/* Flowers */}
      <Sphere args={[0.08, 3, 3]} position={[0.1, 0.35, 0.2]}><meshStandardMaterial color="#e91e63" /></Sphere>
      <Sphere args={[0.08, 3, 3]} position={[-0.15, 0.2, 0.25]}><meshStandardMaterial color="#fff" /></Sphere>
      <Sphere args={[0.08, 3, 3]} position={[0.3, 0.4, -0.1]}><meshStandardMaterial color="#ffeb3b" /></Sphere>
    </group>
  </MovingElement>
);

const DenseGrassClump = () => (
  <group position={[0, 0.15, 0]}>
    <Cone args={[0.4, 0.6, 5]} position={[0, 0, 0]}><meshStandardMaterial color="#558b2f" /></Cone>
    <Cone args={[0.35, 0.5, 5]} position={[0.2, 0, 0.2]}><meshStandardMaterial color="#33691e" /></Cone>
    <Cone args={[0.35, 0.5, 5]} position={[-0.2, 0, -0.1]}><meshStandardMaterial color="#689f38" /></Cone>
  </group>
);

const WildflowerPatch = () => (
  <MovingElement type="sway" speed={2.5} intensity={0.1}>
    <group position={[0, 0.2, 0]}>
       {/* Stem 1 */}
       <Cylinder args={[0.02, 0.02, 0.5]} position={[0, 0, 0]}><meshStandardMaterial color="#33691e" /></Cylinder>
       <Sphere args={[0.12, 4, 4]} position={[0, 0.25, 0]}><meshStandardMaterial color="#9c27b0" /></Sphere>
       {/* Stem 2 */}
       <Cylinder args={[0.02, 0.02, 0.4]} position={[0.1, -0.05, 0.1]} rotation={[0.2, 0, 0]}><meshStandardMaterial color="#33691e" /></Cylinder>
       <Sphere args={[0.1, 4, 4]} position={[0.1, 0.15, 0.15]}><meshStandardMaterial color="#ba68c8" /></Sphere>
    </group>
  </MovingElement>
);


// --- Main Island Component ---

export const GrasslandIsland = ({ health }: IslandProps) => {
  // 1. CARPET LAYER: 800 small items to cover the ground
  const carpet = useMemo(() => getCircularPositions(900, ISLAND_CONFIG.contentRadius + 0.3, 800), []);

  // 2. FLORA LAYER: 350 larger items (Tall stuff)
  const items = useMemo(() => getCircularPositions(500, ISLAND_CONFIG.contentRadius + 0.1, 450), []);
  
  // 3. FAUNA LAYER: 10 animals
  const fauna = useMemo(() => {
    const raw = getCircularPositions(10, ISLAND_CONFIG.faunaRadius, 600);
    return raw.map((item, i) => ({
      ...item,
      // Distribute types: 0=Bison, 1=Elk, 2=Bear
      type: i % 3
    }));
  }, []);

  return (
    <group>
      {/* Lighter Green Base for Prairie */}
      <IslandBase color="#efb556" health={health} />
      
      {/* CARPET LAYER (Rendered first, lowest) */}
      {carpet.map((item, i) => (
         <group key={`carpet-${i}`} position={item.position} rotation={[0, item.rotation, 0]}>
             <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
                 <ShortGrassTuft />
             </AnimatedElement>
         </group>
      ))}

      {/* FLORA LAYER */}
      {items.map((item, i) => {
        // 5 Variants
        const type = i % 5; 
        return (
          <group key={`flora-${i}`} position={item.position} rotation={[0, item.rotation, 0]}>
            <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
               {type === 0 && <TallPrairieGrass />}
               {type === 1 && <FloweringShrub />}
               {type === 2 && <WheatStalks />}
               {type === 3 && <DenseGrassClump />}
               {type === 4 && <WildflowerPatch />}
            </AnimatedElement>
          </group>
        );
      })}

      {/* ROCKS (Static decoration) */}
      <group position={[3, 0.3, -2]} scale={[1.5, 1, 1.5]}>
         <Sphere args={[0.5, 4, 4]}><meshStandardMaterial color="#757575" flatShading /></Sphere>
         <Sphere args={[0.3, 4, 4]} position={[0.5, -0.2, 0.3]}><meshStandardMaterial color="#9e9e9e" flatShading /></Sphere>
      </group>

      {/* FAUNA LAYER */}
      {fauna.map((anim, i) => (
         <group key={`anim-${i}`} position={anim.position} rotation={[0, anim.rotation, 0]}>
            {anim.type === 0 && <Bison isVisible={health > anim.threshold} />}
            {anim.type === 1 && <Elk isVisible={health > anim.threshold} />}
            {anim.type === 2 && <GrasslandBear isVisible={health > anim.threshold} />}
         </group>
      ))}
    </group>
  );
};