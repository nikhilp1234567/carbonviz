'use client';

import React, { useMemo } from 'react';
import { Cone, Cylinder, Sphere, Box, Torus } from '@react-three/drei';
import { IslandProps, getCircularPositions, IslandBase, AnimatedElement, MovingElement, ISLAND_CONFIG } from './Shared';
import { Jaguar } from '../animals/Jaguar';
import { Snake } from '../animals/Snake';
import { Parrot } from '../animals/Parrot';
import { Monkey } from '../animals/Monkey';

// --- Giant Tree (Rare) ---
const GiantKapok = () => (
  <MovingElement type="sway" speed={0.5} intensity={0.02}>
    <group scale={[1, 1.25, 1]}>
      {/* Buttress Roots */}
      <Cylinder args={[0.6, 1.2, 1, 5]} position={[0, 0.5, 0]}><meshStandardMaterial color="#4e342e" /></Cylinder>
      {/* Tall Trunk */}
      <Cylinder args={[0.4, 0.6, 3, 5]} position={[0, 2.5, 0]}><meshStandardMaterial color="#5d4037" /></Cylinder>
      {/* Massive Canopy */}
      <Sphere args={[2, 5, 5]} position={[0, 4, 0]} scale={[1, 0.6, 1]}><meshStandardMaterial color="#2e7d32" flatShading /></Sphere>
      <Sphere args={[1.5, 5, 5]} position={[1, 4.5, 0.5]} scale={[1, 0.6, 1]}><meshStandardMaterial color="#388e3c" flatShading /></Sphere>
      <Sphere args={[1.5, 5, 5]} position={[-1, 4.2, -0.5]} scale={[1, 0.6, 1]}><meshStandardMaterial color="#1b5e20" flatShading /></Sphere>
    </group>
  </MovingElement>
);

// --- Main Island Component ---

export const RainforestIsland = ({ health }: IslandProps) => {
  // Generate stable positions for flora
  // Modulo 8 used below for variety
  const items = useMemo(() => getCircularPositions(320, ISLAND_CONFIG.contentRadius, 300), []);
  
  // Generate ground animals
  const groundAnimals = useMemo(() => {
    const raw = getCircularPositions(10, ISLAND_CONFIG.faunaRadius, 888);
    return raw.map((item, i) => ({
      ...item,
      type: i % 2 === 0 ? 'jaguar' : 'snake'
    }));
  }, []);

  return (
    <group>
      <IslandBase color="#5f5444" health={health} />
      
      {/* FLORA LAYERS */}
      {items.map((item, i) => {
        // Specific check for ONE Giant Tree
        const isGiantTree = i === 12; 
        
        // Use modulo for standard variety (8 types)
        const type = i % 8; 

        // Animal Placement Logic
        const hasMonkey = type === 2 && (i % 7 === 0);
        
        // Parrot Colors
        const parrotColors = ["#d50000", "#7b1fa2", "#2962ff"]; // Red, Purple, Blue
        const parrotColor = parrotColors[i % 3];
        const hasParrot = (type === 0 || type === 3 || type === 5) && (i % 6 === 0);

        if (isGiantTree) {
           return (
            <group key={i} position={[0,0,0]} rotation={[0, item.rotation, 0]}>
               <AnimatedElement isVisible={health > 0.2} baseScale={1}>
                  <GiantKapok />
               </AnimatedElement>
            </group>
           )
        }

        return (
          <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
            <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
              
              {/* Type 0: Standard Canopy Tree */}
              {type === 0 && (
                <MovingElement type="sway" speed={0.8} intensity={0.05} offset={i}>
                  <group>
                    <Cylinder args={[0.1, 0.15, 1.8, 5]} position={[0, 0.9, 0]}><meshStandardMaterial color="#3e2723" /></Cylinder>
                    <Sphere args={[0.6, 5, 5]} position={[0, 1.8, 0]} scale={[1, 0.6, 1]}><meshStandardMaterial color="#2e7d32" flatShading /></Sphere>
                    {hasParrot && <group position={[0.3, 2.1, 0.2]} rotation={[0, i, 0]}><Parrot color={parrotColor} /></group>}
                  </group>
                </MovingElement>
              )}

              {/* Type 1: Large Fern */}
              {type === 1 && (
                <MovingElement type="sway" speed={1.5} intensity={0.08} offset={i}>
                  <group position={[0, 0.2, 0]}>
                    <Cone args={[0.15, 1.2, 4]} rotation={[0, 0, 0.5]} position={[0.2, 0.2, 0]}><meshStandardMaterial color="#43a047" /></Cone>
                    <Cone args={[0.15, 1.2, 4]} rotation={[0, 0, -0.5]} position={[-0.2, 0.2, 0]}><meshStandardMaterial color="#43a047" /></Cone>
                    <Cone args={[0.15, 1.0, 4]} rotation={[0.5, 0, 0]} position={[0, 0.2, 0.2]}><meshStandardMaterial color="#388e3c" /></Cone>
                  </group>
                </MovingElement>
              )}

              {/* Type 2: Palm Tree */}
              {type === 2 && (
                <MovingElement type="sway" speed={1} intensity={0.06} offset={i}>
                  <group>
                    <Cylinder args={[0.08, 0.12, 2.2, 5]} position={[0, 1.1, 0]} rotation={[0.1, 0, 0]}><meshStandardMaterial color="#5d4037" /></Cylinder>
                    <group position={[0, 2.1, 0.2]} rotation={[0.1, 0, 0]}>
                       <Box args={[1.2, 0.05, 0.3]} rotation={[0, 0, 0]}><meshStandardMaterial color="#66bb6a" /></Box>
                       <Box args={[1.2, 0.05, 0.3]} rotation={[0, 1.5, 0]}><meshStandardMaterial color="#66bb6a" /></Box>
                    </group>
                    {hasMonkey && <group position={[0.1, 1.6, 0.1]} rotation={[0, i, 0]}><Monkey /></group>}
                  </group>
                </MovingElement>
              )}

              {/* Type 3: Multi-tier Canopy */}
              {type === 3 && (
                <MovingElement type="sway" speed={0.9} intensity={0.05} offset={i}>
                  <group>
                     <Cylinder args={[0.15, 0.2, 1.6, 6]} position={[0, 0.8, 0]}><meshStandardMaterial color="#4e342e" /></Cylinder>
                     <Cone args={[0.7, 0.8, 6]} position={[0, 1.4, 0]}><meshStandardMaterial color="#1b5e20" /></Cone>
                     <Cone args={[0.5, 0.8, 6]} position={[0, 1.9, 0]}><meshStandardMaterial color="#2e7d32" /></Cone>
                     {hasParrot && <group position={[-0.2, 2.1, 0]} rotation={[0, -i, 0]}><Parrot color={parrotColor} /></group>}
                  </group>
                </MovingElement>
              )}

              {/* Type 4: Banana / Elephant Ear Plant */}
              {type === 4 && (
                 <MovingElement type="sway" speed={1.8} intensity={0.07} offset={i}>
                   <group position={[0, 0.4, 0]}>
                      <Cylinder args={[0.05, 0.08, 0.4]} position={[0, 0.2, 0]}><meshStandardMaterial color="#33691e" /></Cylinder>
                      {/* Big Leaves */}
                      <Sphere args={[0.4, 4, 4]} position={[0.3, 0.6, 0]} scale={[0.1, 1, 0.5]} rotation={[0, 0, -0.5]}><meshStandardMaterial color="#7cb342" flatShading /></Sphere>
                      <Sphere args={[0.4, 4, 4]} position={[-0.3, 0.5, 0.2]} scale={[0.1, 1, 0.5]} rotation={[0, 0, 0.5]}><meshStandardMaterial color="#7cb342" flatShading /></Sphere>
                   </group>
                 </MovingElement>
              )}

              {/* Type 5: Vine Tree */}
              {type === 5 && (
                <MovingElement type="sway" speed={0.7} intensity={0.04} offset={i}>
                  <group>
                     <Cylinder args={[0.1, 0.12, 2.5, 5]} position={[0, 1.25, 0]}><meshStandardMaterial color="#3e2723" /></Cylinder>
                     {/* Vines wrapping around */}
                     <Torus args={[0.14, 0.04, 6, 8]} position={[0, 0.5, 0]} rotation={[Math.PI/2, 0.2, 0]}><meshStandardMaterial color="#2e7d32" /></Torus>
                     <Torus args={[0.13, 0.04, 6, 8]} position={[0, 1.5, 0]} rotation={[Math.PI/2, -0.2, 0]}><meshStandardMaterial color="#2e7d32" /></Torus>
                     <Sphere args={[0.5, 5, 5]} position={[0, 2.5, 0]} scale={[1, 0.8, 1]}><meshStandardMaterial color="#388e3c" flatShading /></Sphere>
                     {hasParrot && <group position={[0, 2.8, 0]} rotation={[0, i, 0]}><Parrot color={parrotColor} /></group>}
                  </group>
                </MovingElement>
              )}

              {/* Type 6: Dense Bush */}
              {type === 6 && (
                 <MovingElement type="sway" speed={1.5} intensity={0.06} offset={i}>
                   <group position={[0, 0.3, 0]}>
                      <Sphere args={[0.5, 5, 5]} position={[0, 0, 0]}><meshStandardMaterial color="#1b5e20" flatShading /></Sphere>
                      <Sphere args={[0.4, 5, 5]} position={[0.4, 0.2, 0]}><meshStandardMaterial color="#2e7d32" flatShading /></Sphere>
                      <Sphere args={[0.4, 5, 5]} position={[-0.3, 0.1, 0.3]}><meshStandardMaterial color="#33691e" flatShading /></Sphere>
                   </group>
                 </MovingElement>
              )}

              {/* Type 7: Tall Grass Clump */}
              {type === 7 && (
                 <MovingElement type="sway" speed={2.5} intensity={0.12} offset={i}>
                   <group position={[0, 0, 0]}>
                      <Cone args={[0.05, 0.6, 3]} position={[0, 0.3, 0]} rotation={[0.2, 0, 0]}><meshStandardMaterial color="#8bc34a" /></Cone>
                      <Cone args={[0.05, 0.5, 3]} position={[0.1, 0.25, 0]} rotation={[-0.2, 0, 0.2]}><meshStandardMaterial color="#9ccc65" /></Cone>
                      <Cone args={[0.05, 0.7, 3]} position={[-0.1, 0.35, 0.1]} rotation={[0, 0, -0.2]}><meshStandardMaterial color="#7cb342" /></Cone>
                   </group>
                 </MovingElement>
              )}

            </AnimatedElement>
          </group>
        );
      })}

      {/* FAUNA LAYERS (Ground) */}
      {groundAnimals.map((anim, i) => (
        <group key={`anim-${i}`} position={anim.position} rotation={[0, anim.rotation, 0]}>
          {anim.type === 'jaguar' ? (
             <Jaguar isVisible={health > anim.threshold} />
          ) : (
             <Snake isVisible={health > anim.threshold} />
          )}
        </group>
      ))}
    </group>
  );
};