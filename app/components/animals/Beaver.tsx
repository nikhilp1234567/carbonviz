'use client';

import React from 'react';
import { Box } from '@react-three/drei';
import { AnimatedElement, MovingElement } from '../islands/Shared';

export const Beaver = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.45}>
    <MovingElement type="bounce" speed={3} intensity={0.05}>
      <group position={[0, 0.25, 0]}>
        {/* Chunky Body */}
        <Box args={[0.6, 0.5, 0.9]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color="#5d4037" />
        </Box>
        {/* Head */}
        <Box args={[0.4, 0.4, 0.4]} position={[0, 0.4, 0.5]}>
          <meshStandardMaterial color="#4e342e" />
        </Box>
        {/* Teeth */}
        <Box args={[0.12, 0.08, 0.05]} position={[0, 0.25, 0.71]}><meshStandardMaterial color="#eeeeee" /></Box>
        {/* Flat Tail */}
        <Box args={[0.3, 0.05, 0.6]} position={[0, 0.1, -0.6]} rotation={[-0.1, 0, 0]}>
          <meshStandardMaterial color="#3e2723" roughness={0.8} />
        </Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);
