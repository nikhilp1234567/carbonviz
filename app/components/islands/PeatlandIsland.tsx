'use client';

import React, { useMemo } from 'react';
import { Box, Sphere } from '@react-three/drei';
import { IslandProps, getStablePositions, IslandBase, AnimatedElement } from './Shared';

export const PeatlandIsland = ({ health }: IslandProps) => {
    const items = useMemo(() => getStablePositions(180, 11, 700), []);
    return (
      <group>
        <IslandBase color="#4e342e" size={12} health={health} />
        <Box args={[3, 0.05, 3]} position={[2, 0.03, 2]}>
            <meshStandardMaterial color="#3e2723" roughness={0.4} />
        </Box>
        {items.map((item, i) => (
           <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
             <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
               <group>
                 <Sphere args={[0.2, 4, 4]} position={[0, 0.1, 0]} scale={[1, 0.4, 1]}>
                    <meshStandardMaterial color="#33691e" flatShading />
                 </Sphere>
               </group>
             </AnimatedElement>
           </group>
        ))}
      </group>
    );
};
