'use client';

import React from 'react';
import { Box } from '@react-three/drei';
import { AnimatedElement, MovingElement } from '../islands/Shared';

export const Jaguar = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.45}>
    <MovingElement type="breathe" speed={1.2} intensity={0.04}>
      <group position={[0, 0.4, 0]}>
        {/* Body */}
        <Box args={[0.6, 0.45, 1.1]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#ffb300" />
        </Box>
        {/* Spots */}
        <Box args={[0.62, 0.1, 0.8]} position={[0, 0.61, 0]}>
          <meshStandardMaterial color="#3e2723" />
        </Box>
        {/* Head */}
        <Box args={[0.4, 0.4, 0.45]} position={[0, 0.6, 0.7]}>
          <meshStandardMaterial color="#ffb300" />
        </Box>
        {/* Legs */}
        <Box args={[0.15, 0.45, 0.15]} position={[-0.2, 0, 0.4]}><meshStandardMaterial color="#ffca28" /></Box>
        <Box args={[0.15, 0.45, 0.15]} position={[0.2, 0, 0.4]}><meshStandardMaterial color="#ffca28" /></Box>
        <Box args={[0.15, 0.45, 0.15]} position={[-0.2, 0, -0.4]}><meshStandardMaterial color="#ffca28" /></Box>
        <Box args={[0.15, 0.45, 0.15]} position={[0.2, 0, -0.4]}><meshStandardMaterial color="#ffca28" /></Box>
        {/* Tail */}
        <Box args={[0.1, 0.1, 0.6]} position={[0, 0.5, -0.8]} rotation={[0.5, 0, 0]}>
          <meshStandardMaterial color="#ffb300" />
        </Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);
