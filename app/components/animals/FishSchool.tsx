'use client';

import React from 'react';
import { Box } from '@react-three/drei';
import { AnimatedElement } from '../islands/Shared';

export const FishSchool = ({ isVisible, color }: { isVisible: boolean, color: string }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.15}>
     <group position={[0, -0.3, 0]}>
        <Box args={[0.2, 0.5, 1]}><meshStandardMaterial color={color} /></Box>
        <Box args={[0.2, 0.5, 1]} position={[1, -0.5, 2]}><meshStandardMaterial color={color} /></Box>
        <Box args={[0.2, 0.5, 1]} position={[-1, 0.5, 1]}><meshStandardMaterial color={color} /></Box>
     </group>
  </AnimatedElement>
);
