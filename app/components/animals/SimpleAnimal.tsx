'use client';

import React from 'react';
import { Box } from '@react-three/drei';
import { AnimatedElement } from '../islands/Shared';

// Low Poly Animal Component (Also animates visibility!)
export const SimpleAnimal = ({ position, rotation, isVisible }: { position: [number, number, number], rotation: number, isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.4}>
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Body */}
      <Box args={[1, 0.6, 1.4]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#e65100" />
      </Box>
      {/* Head */}
      <Box args={[0.5, 0.5, 0.6]} position={[0, 1.1, 0.6]}>
        <meshStandardMaterial color="#e65100" />
      </Box>
      {/* Legs */}
      <Box args={[0.2, 0.6, 0.2]} position={[-0.3, 0.3, 0.5]}><meshStandardMaterial color="#3e2723" /></Box>
      <Box args={[0.2, 0.6, 0.2]} position={[0.3, 0.3, 0.5]}><meshStandardMaterial color="#3e2723" /></Box>
      <Box args={[0.2, 0.6, 0.2]} position={[-0.3, 0.3, -0.5]}><meshStandardMaterial color="#3e2723" /></Box>
      <Box args={[0.2, 0.6, 0.2]} position={[0.3, 0.3, -0.5]}><meshStandardMaterial color="#3e2723" /></Box>
    </group>
  </AnimatedElement>
);
