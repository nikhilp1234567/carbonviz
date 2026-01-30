'use client';

import React from 'react';
import { Box, Sphere } from '@react-three/drei';
import { AnimatedElement, MovingElement } from '../islands/Shared';

export const Snake = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.35}>
    <MovingElement type="sway" speed={3} intensity={0.1}>
      <group position={[0, 0.05, 0]} rotation={[0, Math.random() * Math.PI, 0]}>
        {/* S-Shape Body created by segments on the ground */}
        {/* Tail */}
        <Sphere args={[0.15, 6, 6]} position={[-0.3, 0, -0.2]}>
            <meshStandardMaterial color="#ffd600" />
        </Sphere>
        {/* Mid 1 */}
        <Sphere args={[0.18, 6, 6]} position={[-0.15, 0, 0]}>
            <meshStandardMaterial color="#212121" />
        </Sphere>
        {/* Mid 2 */}
        <Sphere args={[0.18, 6, 6]} position={[0.1, 0, 0.1]}>
            <meshStandardMaterial color="#ffd600" />
        </Sphere>
        {/* Neck */}
        <Sphere args={[0.16, 6, 6]} position={[0.3, 0.05, 0.2]}>
            <meshStandardMaterial color="#212121" />
        </Sphere>
        {/* Head */}
        <Box args={[0.2, 0.15, 0.25]} position={[0.45, 0.1, 0.3]} rotation={[0, 0.5, 0]}>
          <meshStandardMaterial color="#ffd600" />
        </Box>
        {/* Tongue */}
        <Box args={[0.05, 0.02, 0.2]} position={[0.5, 0.1, 0.5]} rotation={[0, 0.5, 0]}>
           <meshStandardMaterial color="#d50000" />
        </Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);
