'use client';

import React, { useMemo } from 'react';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import { IslandProps, getStablePositions, IslandBase, AnimatedElement } from './Shared';

export const MangroveIsland = ({ health }: IslandProps) => {
  const items = useMemo(() => getStablePositions(120, 11, 600), []);
  return (
    <group>
      <IslandBase color="#0277bd" size={12} health={health} />
      {/* Sandy patches - fade slightly with health */}
      <Box args={[11, 0.1, 11]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#d7ccc8" opacity={0.5 + health * 0.5} transparent />
      </Box>
      {items.map((item, i) => (
        <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
          <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
            <group>
              <Cylinder args={[0.05, 0.08, 0.6, 4]} position={[0.1, 0.3, 0]} rotation={[0,0, -0.3]}>
                <meshStandardMaterial color="#795548" />
              </Cylinder>
              <Cylinder args={[0.05, 0.08, 0.6, 4]} position={[-0.1, 0.3, 0]} rotation={[0,0, 0.3]}>
                <meshStandardMaterial color="#795548" />
              </Cylinder>
              <Sphere args={[0.4, 5, 5]} position={[0, 0.7, 0]}>
                  <meshStandardMaterial color="#558b2f" flatShading />
              </Sphere>
            </group>
          </AnimatedElement>
        </group>
      ))}
    </group>
  );
};
