'use client';

import React from 'react';
import { Box, Sphere } from '@react-three/drei';
import { AnimatedElement } from '../islands/Shared';

export const Turtle = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.3}>
    <group position={[0, 1, 0]}>
      <Sphere args={[0.4, 5, 5]} scale={[1, 0.5, 1.1]} position={[0, 0.1, 0]}><meshStandardMaterial color="#43a047" flatShading /></Sphere>
      <Sphere args={[0.15, 4, 4]} position={[0, 0.1, 0.5]}><meshStandardMaterial color="#8bc34a" /></Sphere>
      <Box args={[0.2, 0.05, 0.3]} position={[0.3, 0, 0.2]} rotation={[0, 0.5, 0]}><meshStandardMaterial color="#8bc34a" /></Box>
      <Box args={[0.2, 0.05, 0.3]} position={[-0.3, 0, 0.2]} rotation={[0, -0.5, 0]}><meshStandardMaterial color="#8bc34a" /></Box>
    </group>
  </AnimatedElement>
);
