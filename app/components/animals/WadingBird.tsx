'use client';

import React from 'react';
import { Sphere, Cylinder, Cone } from '@react-three/drei';
import { AnimatedElement, MovingElement } from '../islands/Shared';

export const WadingBird = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.4}>
    <MovingElement type="hop" speed={2} intensity={0.5}>
      <group position={[0, 0.45, 0]}>
        {/* Long Legs */}
        <Cylinder args={[0.02, 0.02, 0.9]} position={[-0.1, 0.45, 0]}><meshStandardMaterial color="#263238" /></Cylinder>
        <Cylinder args={[0.02, 0.02, 0.9]} position={[0.1, 0.45, 0]}><meshStandardMaterial color="#263238" /></Cylinder>
        {/* Body */}
        <Sphere args={[0.3, 4, 4]} position={[0, 0.9, 0]} scale={[1, 0.8, 1.4]}>
          <meshStandardMaterial color="#cfd8dc" flatShading />
        </Sphere>
        {/* Neck & Head */}
        <Cylinder args={[0.04, 0.03, 0.6]} position={[0, 1.3, 0.2]} rotation={[0.2, 0, 0]}>
          <meshStandardMaterial color="#cfd8dc" />
        </Cylinder>
        <Sphere args={[0.15, 4, 4]} position={[0, 1.6, 0.35]}>
          <meshStandardMaterial color="#cfd8dc" />
        </Sphere>
        {/* Long Beak */}
        <Cone args={[0.03, 0.5, 4]} position={[0, 1.6, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ff7043" />
        </Cone>
      </group>
    </MovingElement>
  </AnimatedElement>
);
