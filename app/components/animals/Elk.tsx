'use client';

import React from 'react';
import { Box, Cylinder } from '@react-three/drei';
import { AnimatedElement, MovingElement } from '../islands/Shared';

export const Elk = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.55}>
    <MovingElement type="breathe" speed={2} intensity={0.015}>
      <group position={[0, 0.7, 0]}>
         {/* Body */}
         <Box args={[0.6, 0.6, 1.2]} position={[0, 0.3, 0]}>
           <meshStandardMaterial color="#8d6e63" />
         </Box>
         {/* Neck & Head */}
         <group position={[0, 0.8, -0.5]} rotation={[0.3, 0, 0]}>
            <Cylinder args={[0.15, 0.2, 0.6]} position={[0, 0, 0]}><meshStandardMaterial color="#795548" /></Cylinder>
            <Box args={[0.25, 0.25, 0.4]} position={[0, 0.4, -0.1]}><meshStandardMaterial color="#5d4037" /></Box>
            {/* Antlers */}
            <group position={[0, 0.6, 0]}>
               <Cylinder args={[0.02, 0.02, 0.8]} position={[0.3, 0.3, 0]} rotation={[0, 0, -0.5]}><meshStandardMaterial color="#d7ccc8" /></Cylinder>
               <Cylinder args={[0.02, 0.02, 0.8]} position={[-0.3, 0.3, 0]} rotation={[0, 0, 0.5]}><meshStandardMaterial color="#d7ccc8" /></Cylinder>
               <Cylinder args={[0.02, 0.02, 0.4]} position={[0.4, 0.4, 0.2]} rotation={[0.5, 0, 0]}><meshStandardMaterial color="#d7ccc8" /></Cylinder>
               <Cylinder args={[0.02, 0.02, 0.4]} position={[-0.4, 0.4, 0.2]} rotation={[0.5, 0, 0]}><meshStandardMaterial color="#d7ccc8" /></Cylinder>
            </group>
         </group>
         {/* Long Legs */}
         <Box args={[0.1, 0.8, 0.1]} position={[-0.2, -0.4, 0.4]}><meshStandardMaterial color="#4e342e" /></Box>
         <Box args={[0.1, 0.8, 0.1]} position={[0.2, -0.4, 0.4]}><meshStandardMaterial color="#4e342e" /></Box>
         <Box args={[0.1, 0.8, 0.1]} position={[-0.2, -0.4, -0.4]}><meshStandardMaterial color="#4e342e" /></Box>
         <Box args={[0.1, 0.8, 0.1]} position={[0.2, -0.4, -0.4]}><meshStandardMaterial color="#4e342e" /></Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);
