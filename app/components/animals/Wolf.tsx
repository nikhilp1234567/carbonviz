'use client';

import React from 'react';
import { Box } from '@react-three/drei';
import { AnimatedElement, MovingElement } from '../islands/Shared';

export const Wolf = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.5}>
    <MovingElement type="breathe" speed={1.5} intensity={0.02}>
      <group position={[0, 0.4, 0]}>
        {/* Body */}
        <Box args={[0.5, 0.4, 1.0]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#78909c" />
        </Box>
        {/* Head */}
        <Box args={[0.3, 0.3, 0.4]} position={[0, 0.7, 0.55]}>
          <meshStandardMaterial color="#78909c" />
        </Box>
        {/* Snout */}
        <Box args={[0.15, 0.15, 0.2]} position={[0, 0.65, 0.8]}>
          <meshStandardMaterial color="#455a64" />
        </Box>
        {/* Tail */}
        <Box args={[0.1, 0.1, 0.4]} position={[0, 0.5, -0.6]} rotation={[0.2, 0, 0]}>
          <meshStandardMaterial color="#78909c" />
        </Box>
        {/* Legs */}
        <Box args={[0.12, 0.5, 0.12]} position={[-0.15, 0, 0.35]}><meshStandardMaterial color="#546e7a" /></Box>
        <Box args={[0.12, 0.5, 0.12]} position={[0.15, 0, 0.35]}><meshStandardMaterial color="#546e7a" /></Box>
        <Box args={[0.12, 0.5, 0.12]} position={[-0.15, 0, -0.35]}><meshStandardMaterial color="#546e7a" /></Box>
        <Box args={[0.12, 0.5, 0.12]} position={[0.15, 0, -0.35]}><meshStandardMaterial color="#546e7a" /></Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);
