'use client';

import React from 'react';
import { Box, Cone } from '@react-three/drei';
import { AnimatedElement, MovingElement } from '../islands/Shared';

export const Bison = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.6}>
    <MovingElement type="breathe" speed={1.5} intensity={0.02}>
      <group position={[0, 0.6, 0]}>
        {/* Massive Hump/Shoulders */}
        <Box args={[0.9, 0.9, 1.0]} position={[0, 0.3, -0.2]}>
          <meshStandardMaterial color="#3e2723" />
        </Box>
        {/* Hindquarters */}
        <Box args={[0.8, 0.7, 0.8]} position={[0, 0.1, 0.6]}>
          <meshStandardMaterial color="#4e342e" />
        </Box>
        {/* Head (Lower than hump) */}
        <group position={[0, 0.1, -0.9]}>
           <Box args={[0.5, 0.6, 0.6]}><meshStandardMaterial color="#21110e" /></Box>
           {/* Horns */}
           <Cone args={[0.08, 0.4, 4]} position={[0.25, 0.4, 0]} rotation={[0, 0, -0.5]}><meshStandardMaterial color="#eeeeee" /></Cone>
           <Cone args={[0.08, 0.4, 4]} position={[-0.25, 0.4, 0]} rotation={[0, 0, 0.5]}><meshStandardMaterial color="#eeeeee" /></Cone>
           {/* Beard */}
           <Box args={[0.15, 0.3, 0.1]} position={[0, -0.35, -0.2]}><meshStandardMaterial color="#1a0f0d" /></Box>
        </group>
        {/* Legs */}
        <Box args={[0.2, 0.5, 0.2]} position={[-0.3, -0.5, -0.2]}><meshStandardMaterial color="#21110e" /></Box>
        <Box args={[0.2, 0.5, 0.2]} position={[0.3, -0.5, -0.2]}><meshStandardMaterial color="#21110e" /></Box>
        <Box args={[0.2, 0.5, 0.2]} position={[-0.3, -0.5, 0.7]}><meshStandardMaterial color="#21110e" /></Box>
        <Box args={[0.2, 0.5, 0.2]} position={[0.3, -0.5, 0.7]}><meshStandardMaterial color="#21110e" /></Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);
