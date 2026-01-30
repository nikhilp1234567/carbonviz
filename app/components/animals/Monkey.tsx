'use client';

import React from 'react';
import { Box } from '@react-three/drei';
import { MovingElement } from '../islands/Shared';

export const Monkey = () => (
  <MovingElement type="bounce" speed={3} intensity={0.08}>
    <group position={[0, 0, 0]}>
      {/* Body */}
      <Box args={[0.25, 0.3, 0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#795548" />
      </Box>
      {/* Head */}
      <Box args={[0.18, 0.18, 0.18]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#5d4037" />
      </Box>
      {/* Long Black Tail */}
      <Box args={[0.05, 0.6, 0.05]} position={[0, -0.2, -0.15]} rotation={[0.5, 0, 0]}>
        <meshStandardMaterial color="#212121" />
      </Box>
      {/* Limbs */}
      <Box args={[0.06, 0.3, 0.06]} position={[0.15, -0.1, 0]}><meshStandardMaterial color="#5d4037" /></Box>
      <Box args={[0.06, 0.3, 0.06]} position={[-0.15, -0.1, 0]}><meshStandardMaterial color="#5d4037" /></Box>
    </group>
  </MovingElement>
);
