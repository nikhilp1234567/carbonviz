'use client';

import React from 'react';
import { Box, Cone } from '@react-three/drei';
import { AnimatedElement, MovingElement } from '../islands/Shared';

export const Fox = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.5}>
    <MovingElement type="bounce" speed={2.5} intensity={0.03}>
      <group position={[0, 0.35, 0]}>
        {/* Body */}
        <Box args={[0.4, 0.4, 0.9]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#e65100" />
        </Box>
        {/* Head */}
        <group position={[0, 0.5, 0.5]}>
          <Box args={[0.3, 0.3, 0.35]}><meshStandardMaterial color="#e65100" /></Box>
          <Box args={[0.15, 0.15, 0.2]} position={[0, -0.05, 0.25]}><meshStandardMaterial color="#fff" /></Box>
          <Box args={[0.08, 0.08, 0.1]} position={[0, 0.05, 0.35]}><meshStandardMaterial color="#212121" /></Box>
          {/* Ears */}
          <Cone args={[0.08, 0.2, 4]} position={[0.1, 0.25, 0]}><meshStandardMaterial color="#e65100" /></Cone>
          <Cone args={[0.08, 0.2, 4]} position={[-0.1, 0.25, 0]}><meshStandardMaterial color="#e65100" /></Cone>
        </group>
        {/* Tail */}
        <group position={[0, 0.3, -0.6]} rotation={[0.6, 0, 0]}>
           <Box args={[0.2, 0.2, 0.5]}><meshStandardMaterial color="#e65100" /></Box>
           <Box args={[0.15, 0.15, 0.2]} position={[0, 0, -0.35]}><meshStandardMaterial color="#fff" /></Box>
        </group>
        {/* Legs */}
        <Box args={[0.1, 0.35, 0.1]} position={[0.15, 0, 0.3]}><meshStandardMaterial color="#212121" /></Box>
        <Box args={[0.1, 0.35, 0.1]} position={[-0.15, 0, 0.3]}><meshStandardMaterial color="#212121" /></Box>
        <Box args={[0.1, 0.35, 0.1]} position={[0.15, 0, -0.3]}><meshStandardMaterial color="#212121" /></Box>
        <Box args={[0.1, 0.35, 0.1]} position={[-0.15, 0, -0.3]}><meshStandardMaterial color="#212121" /></Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);
