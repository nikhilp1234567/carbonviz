'use client';

import React, { useMemo } from 'react';
import { Cone, Cylinder, Sphere } from '@react-three/drei';
import { IslandProps, getStablePositions, IslandBase, AnimatedElement, SimpleAnimal } from './Shared';

export const ForestIsland = ({ health }: IslandProps) => {
  // Generate 150 potential trees
  const items = useMemo(() => getStablePositions(150, 11, 100), []); 
  const animals = useMemo(() => getStablePositions(5, 10, 200), []);

  return (
    <group>
      <IslandBase color="#66bb6a" size={12} health={health} />
      {items.map((item, i) => (
        <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
           <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
              <group>
                <Cylinder args={[0.15, 0.2, 0.6, 6]} position={[0, 0.3, 0]}>
                  <meshStandardMaterial color="#5d4037" />
                </Cylinder>
                {/* Tree Variation */}
                {item.variant === 0 ? (
                  <Cone args={[0.6, 1.5, 7]} position={[0, 1.0, 0]}>
                    <meshStandardMaterial color="#2e7d32" />
                  </Cone>
                ) : item.variant === 1 ? (
                  <group position={[0, 1.0, 0]}>
                    <Sphere args={[0.6, 5, 5]} scale={[1, 0.8, 1]}>
                      <meshStandardMaterial color="#43a047" flatShading />
                    </Sphere>
                  </group>
                ) : (
                  <group position={[0, 0.8, 0]}>
                    <Cone args={[0.5, 0.8, 6]} position={[0, 0, 0]}><meshStandardMaterial color="#388e3c" /></Cone>
                    <Cone args={[0.4, 0.8, 6]} position={[0, 0.5, 0]}><meshStandardMaterial color="#4caf50" /></Cone>
                  </group>
                )}
              </group>
          </AnimatedElement>
        </group>
      ))}
      
      {animals.map((anim, i) => (
        <SimpleAnimal key={`anim-${i}`} position={anim.position} rotation={anim.rotation} isVisible={health > anim.threshold} />
      ))}
    </group>
  );
};
