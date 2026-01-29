'use client';

import React, { useMemo } from 'react';
import { Cone, Cylinder, Sphere } from '@react-three/drei';
import { IslandProps, getStablePositions, IslandBase, AnimatedElement } from './Shared';

export const RainforestIsland = ({ health }: IslandProps) => {
  const items = useMemo(() => getStablePositions(150, 11, 300), []);
  
  return (
    <group>
      <IslandBase color="#1b5e20" size={12} health={health} />
      {items.map((item, i) => (
        <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
           <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale * 1.2}>
              <group>
                <Cylinder args={[0.1, 0.15, 1.5, 5]} position={[0, 0.75, 0]}>
                  <meshStandardMaterial color="#3e2723" />
                </Cylinder>
                {item.variant === 0 ? (
                  <Sphere args={[0.8, 5, 5]} position={[0, 1.6, 0]} scale={[1, 0.5, 1]}>
                    <meshStandardMaterial color="#2e7d32" flatShading />
                  </Sphere>
                ) : (
                  <group position={[0, 1.5, 0]}>
                      <Cone args={[0.8, 0.5, 5]} rotation={[0,0,Math.PI]} position={[0, 0.2, 0]} >
                        <meshStandardMaterial color="#43a047" />
                      </Cone>
                      <Sphere args={[0.5, 4, 4]} position={[0, 0.5, 0]}>
                        <meshStandardMaterial color="#1b5e20" flatShading />
                      </Sphere>
                  </group>
                )}
              </group>
           </AnimatedElement>
        </group>
      ))}
    </group>
  );
};
