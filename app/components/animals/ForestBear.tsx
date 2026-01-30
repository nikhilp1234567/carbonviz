'use client';

import React from 'react';
import { Box } from '@react-three/drei';
import { AnimatedElement, MovingElement } from '../islands/Shared';

export const ForestBear = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.7}>
    <MovingElement type="breathe" speed={1} intensity={0.03}>
      <group position={[0, 0.5, 0]}>
        {/* Body */}
        <Box args={[0.8, 0.7, 1.2]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#3e2723" />
        </Box>
        {/* Head */}
        <Box args={[0.5, 0.5, 0.5]} position={[0, 0.8, 0.7]}>
          <meshStandardMaterial color="#3e2723" />
        </Box>
        {/* Snout */}
        <Box args={[0.25, 0.2, 0.2]} position={[0, 0.7, 1.0]}>
          <meshStandardMaterial color="#21110e" />
        </Box>
        {/* Legs */}
        <Box args={[0.25, 0.5, 0.25]} position={[-0.25, 0, 0.4]}><meshStandardMaterial color="#2d1b16" /></Box>
        <Box args={[0.25, 0.5, 0.25]} position={[0.25, 0, 0.4]}><meshStandardMaterial color="#2d1b16" /></Box>
        <Box args={[0.25, 0.5, 0.25]} position={[-0.25, 0, -0.4]}><meshStandardMaterial color="#2d1b16" /></Box>
        <Box args={[0.25, 0.5, 0.25]} position={[0.25, 0, -0.4]}><meshStandardMaterial color="#2d1b16" /></Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);
