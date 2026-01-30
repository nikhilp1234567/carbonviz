'use client';

import React from 'react';
import { Box, Cone } from '@react-three/drei';
import { AnimatedElement } from '../islands/Shared';

export const Shark = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.6}>
    <group position={[0, -0.5, 0]}> 
       <Box args={[0.4, 0.4, 1.2]} position={[0, 0, 0]}><meshStandardMaterial color="#90a4ae" /></Box>
       <Cone args={[0.3, 0.8, 4]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, -0.8]}><meshStandardMaterial color="#78909c" /></Cone>
       <Cone args={[0.1, 0.4, 4]} position={[0, 0.3, 0.2]}><meshStandardMaterial color="#90a4ae" /></Cone>
    </group>
  </AnimatedElement>
);
