'use client';

import React from 'react';
import { Box, Cone } from '@react-three/drei';
import { MovingElement } from '../islands/Shared';

export const Parrot = ({ color }: { color: string }) => (
  <MovingElement type="bounce" speed={4} intensity={0.05}>
    <group position={[0, 0, 0]}>
      {/* Colored Body */}
      <Box args={[0.15, 0.3, 0.15]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Head */}
      <Box args={[0.12, 0.12, 0.12]} position={[0, 0.35, 0.05]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Beak */}
      <Cone args={[0.03, 0.08, 4]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.35, 0.15]}>
        <meshStandardMaterial color="#212121" />
      </Cone>
      {/* Wing (Darker shade) */}
      <Box args={[0.05, 0.2, 0.1]} position={[0.1, 0.2, -0.05]}>
        <meshStandardMaterial color="black" opacity={0.2} transparent />
      </Box>
    </group>
  </MovingElement>
);
