'use client';

import React, { useMemo } from 'react';
import { Cone, Sphere } from '@react-three/drei';
import { IslandProps, getStablePositions, IslandBase, AnimatedElement, SimpleAnimal } from './Shared';

export const GrasslandIsland = ({ health }: IslandProps) => {
  const items = useMemo(() => getStablePositions(300, 11.5, 400), []); // More grass
  const animals = useMemo(() => getStablePositions(8, 10, 500), []);

  return (
    <group>
      <IslandBase color="#aed581" size={12} health={health} />
      {items.map((item, i) => (
         <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
           <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale * 1.5}>
              <group>
                {item.variant === 0 ? (
                  <Cone args={[0.05, 0.8, 3]} position={[0, 0.4, 0]} scale={[1, 1, 0.2]}>
                    <meshStandardMaterial color="#7cb342" />
                  </Cone>
                ) : (
                  <Sphere args={[0.3, 4, 4]} position={[0, 0.1, 0]} scale={[1, 0.6, 1]}>
                    <meshStandardMaterial color="#8bc34a" flatShading />
                  </Sphere>
                )}
              </group>
           </AnimatedElement>
         </group>
      ))}
      
      {/* Rocks (Always visible) */}
      <Sphere args={[0.5, 4, 4]} position={[2, 0.2, 2]} scale={[1, 0.6, 1]}>
        <meshStandardMaterial color="#9e9e9e" flatShading />
      </Sphere>

      {animals.map((anim, i) => (
        <SimpleAnimal key={`anim-${i}`} position={anim.position} rotation={anim.rotation} isVisible={health > anim.threshold} />
      ))}
    </group>
  );
};
