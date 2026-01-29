'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

// --- Shared Types & Helpers ---

export interface IslandProps {
  health: number; // 0.0 (Dead/Barren) to 1.0 (Lush/Full)
}

// Helper: Stable random number generator to keep positions fixed across re-renders
export const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Generate fixed positions once
export const getStablePositions = (count: number, size: number, seedOffset: number) => {
  return Array.from({ length: count }).map((_, i) => {
    let seed = i * 1357 + seedOffset; // specific seed for this index
    const x = (seededRandom(seed++) - 0.5) * size;
    const z = (seededRandom(seed++) - 0.5) * size;
    const scale = 0.6 + seededRandom(seed++) * 0.6;
    const rotation = seededRandom(seed++) * Math.PI * 2;
    const variant = Math.floor(seededRandom(seed++) * 3);
    
    // Calculate a "threshold" for this item. 
    // If health > threshold, this item is visible.
    // We shuffle the threshold distribution so items disappear randomly, not just from one side.
    const threshold = seededRandom(seed++); 

    return { position: [x, 0, z] as [number, number, number], scale, rotation, variant, threshold };
  });
};

// Component to handle smooth popping/scaling
export const AnimatedElement = ({ 
  isVisible, 
  baseScale, 
  children 
}: { 
  isVisible: boolean; 
  baseScale: number; 
  children: React.ReactNode 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetScale = isVisible ? baseScale : 0;
  
  // Local state to keep track of current visual scale for lerping
  // We use a ref for the actual value to avoid React render loop, but apply it in useFrame
  const currentScale = useRef(isVisible ? baseScale : 0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Lerp factor (speed)
      const speed = 4 * delta;
      
      // Smoothly interpolate current scale towards target
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, speed);
      
      // Apply scale
      const s = currentScale.current;
      groupRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};

// --- Animation Helper ---

export const MovingElement = ({ 
  type, 
  speed = 1, 
  intensity = 0.1, 
  offset = 0,
  children 
}: { 
  type: 'sway' | 'bounce' | 'breathe', 
  speed?: number, 
  intensity?: number, 
  offset?: number,
  children: React.ReactNode 
}) => {
  const ref = useRef<THREE.Group>(null);
  const randomOffset = React.useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime + randomOffset + offset;
      
      if (type === 'sway') {
        // Wind effect for trees/plants
        ref.current.rotation.z = Math.sin(t * speed) * intensity;
        ref.current.rotation.x = Math.cos(t * speed * 0.7) * (intensity * 0.5);
      } else if (type === 'bounce') {
        // Hopping effect
        ref.current.position.y = Math.abs(Math.sin(t * speed)) * intensity;
      } else if (type === 'breathe') {
        // Subtle expansion for large animals
        const s = 1 + Math.sin(t * speed) * intensity;
        ref.current.scale.set(1, s, 1);
      }
    }
  });

  return <group ref={ref}>{children}</group>;
};



// Low Poly Animal Component (Also animates visibility!)
export const SimpleAnimal = ({ position, rotation, isVisible }: { position: [number, number, number], rotation: number, isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.4}>
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Body */}
      <Box args={[1, 0.6, 1.4]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#e65100" />
      </Box>
      {/* Head */}
      <Box args={[0.5, 0.5, 0.6]} position={[0, 1.1, 0.6]}>
        <meshStandardMaterial color="#e65100" />
      </Box>
      {/* Legs */}
      <Box args={[0.2, 0.6, 0.2]} position={[-0.3, 0.3, 0.5]}><meshStandardMaterial color="#3e2723" /></Box>
      <Box args={[0.2, 0.6, 0.2]} position={[0.3, 0.3, 0.5]}><meshStandardMaterial color="#3e2723" /></Box>
      <Box args={[0.2, 0.6, 0.2]} position={[-0.3, 0.3, -0.5]}><meshStandardMaterial color="#3e2723" /></Box>
      <Box args={[0.2, 0.6, 0.2]} position={[0.3, 0.3, -0.5]}><meshStandardMaterial color="#3e2723" /></Box>
    </group>
  </AnimatedElement>
);

// Island Base - changes color slightly based on health?
export const IslandBase = ({ color, size = 12, height = 2, health }: { color: string, size?: number, height?: number, health: number }) => {
   // Mix color with "dead" color (brown/grey) based on health
   const baseColor = new THREE.Color(color);
   const deadColor = new THREE.Color("#8d6e63"); // Dry dirt
   const finalColor = deadColor.lerp(baseColor, Math.max(0.3, health)); // Never go fully dead, keep some tint

   return (
    <group>
      {/* Top Surface */}
      <Box args={[size, height, size]} position={[0, -height/2, 0]}>
        <meshStandardMaterial color={finalColor} roughness={0.8} />
      </Box>
      {/* Underside */}
      <Box args={[size * 0.9, height * 1.5, size * 0.9]} position={[0, -height - (height * 1.5)/2 + 0.1, 0]}>
        <meshStandardMaterial color="#5d4037" roughness={1} />
      </Box>
    </group>
   );
};
