'use client';

import React from 'react';
import { Box } from '@react-three/drei';
import { AnimatedElement } from '../islands/Shared';

export const Crab = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.25}>
    <group position={[0,1.5, 0]}>
       <Box args={[0.5, 0.2, 0.4]}><meshStandardMaterial color="#d32f2f" /></Box>
       {/* Legs */}
       <Box args={[0.6, 0.05, 0.05]} position={[0, 0, 0.2]} rotation={[0, 0.2, 0]}><meshStandardMaterial color="#b71c1c" /></Box>
       <Box args={[0.6, 0.05, 0.05]} position={[0, 0, -0.2]} rotation={[0, -0.2, 0]}><meshStandardMaterial color="#b71c1c" /></Box>
       {/* Eyes */}
       <Box args={[0.05, 0.1, 0.05]} position={[0.15, 0.15, 0.15]}><meshStandardMaterial color="black" /></Box>
       <Box args={[0.05, 0.1, 0.05]} position={[-0.15, 0.15, 0.15]}><meshStandardMaterial color="black" /></Box>
    </group>
  </AnimatedElement>
);
