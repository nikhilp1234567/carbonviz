'use client';

import React from 'react';
import { Box, Cone } from '@react-three/drei';
import { MovingElement } from '../islands/Shared';

export const Eagle = () => (
  <MovingElement type="bounce" speed={2} intensity={0.1}>
    {/* Container Group for global scaling/rotation */}
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      
      {/* --- BODY --- */}
      {/* Main Torso */}
      <Box args={[0.25, 0.15, 0.35]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3e2723" />
      </Box>

      {/* --- TAIL --- */}
      {/* White Tail Feathers */}
      <Box args={[0.2, 0.05, 0.2]} position={[0, 0.05, -0.3]} rotation={[-0.1, 0, 0]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>

      {/* --- HEAD GROUP --- */}
      <group position={[0, 0.1, 0.2]}>
        {/* White Head Block */}
        <Box args={[0.15, 0.14, 0.16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f5f5f5" />
        </Box>
        {/* Beak */}
        <Cone args={[0.04, 0.12, 4]} rotation={[Math.PI / 2 + 0.2, 0, 0]} position={[0, -0.02, 0.12]}>
          <meshStandardMaterial color="#ffca28" />
        </Cone>
        {/* Eyes (Left & Right) */}
        <Box args={[0.02, 0.02, 0.01]} position={[0.06, 0.02, 0.081]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box args={[0.02, 0.02, 0.01]} position={[-0.06, 0.02, 0.081]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
      </group>

      {/* --- WINGS --- */}
      {/* Left Wing */}
      <group position={[0.13, 0.08, 0.05]} rotation={[0, -0.2, -0.15]}>
        <Box args={[0.5, 0.04, 0.18]} position={[0.25, 0, 0]}>
          <meshStandardMaterial color="#3e2723" />
        </Box>
      </group>

      {/* Right Wing */}
      <group position={[-0.13, 0.08, 0.05]} rotation={[0, 0.2, 0.15]}>
        <Box args={[0.5, 0.04, 0.18]} position={[-0.25, 0, 0]}>
          <meshStandardMaterial color="#3e2723" />
        </Box>
      </group>

    </group>
  </MovingElement>
);