'use client';

import React from 'react';
import { Box } from '@react-three/drei';
import { AnimatedElement, MovingElement } from '../islands/Shared';

export const GrasslandBear = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.5}>
    <MovingElement type="bounce" speed={1} intensity={0.05}>
      <group position={[0, 0.4, 0]}>
        {/* Body */}
        <Box args={[0.7, 0.6, 1.1]} position={[0, 0.3, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        {/* Head */}
        <Box args={[0.45, 0.45, 0.45]} position={[0, 0.6, 0.7]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        {/* Snout */}
        <Box args={[0.2, 0.15, 0.2]} position={[0, 0.55, 0.95]}>
          <meshStandardMaterial color="#424242" />
        </Box>
        {/* Ears */}
        <Box args={[0.1, 0.1, 0.05]} position={[0.18, 0.85, 0.65]}><meshStandardMaterial color="#1a1a1a" /></Box>
        <Box args={[0.1, 0.1, 0.05]} position={[-0.18, 0.85, 0.65]}><meshStandardMaterial color="#1a1a1a" /></Box>
        {/* Legs */}
        <Box args={[0.2, 0.5, 0.2]} position={[-0.25, 0, 0.35]}><meshStandardMaterial color="#1a1a1a" /></Box>
        <Box args={[0.2, 0.5, 0.2]} position={[0.25, 0, 0.35]}><meshStandardMaterial color="#1a1a1a" /></Box>
        <Box args={[0.2, 0.5, 0.2]} position={[-0.25, 0, -0.35]}><meshStandardMaterial color="#1a1a1a" /></Box>
        <Box args={[0.2, 0.5, 0.2]} position={[0.25, 0, -0.35]}><meshStandardMaterial color="#1a1a1a" /></Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);
