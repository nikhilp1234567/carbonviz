'use client';

import React, { useMemo } from 'react';
import { Cone, Cylinder, Sphere, Box } from '@react-three/drei';
import { IslandProps, getStablePositions, IslandBase, AnimatedElement } from './Shared';

// --- Wildlife Components ---

const Eagle = () => (
  <group position={[0, 0, 0]}>
    {/* Body */}
    <Box args={[0.2, 0.15, 0.3]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#3e2723" />
    </Box>
    {/* White Head */}
    <Box args={[0.12, 0.12, 0.15]} position={[0, 0.1, 0.15]}>
      <meshStandardMaterial color="#f5f5f5" />
    </Box>
    {/* Beak */}
    <Cone args={[0.03, 0.1, 4]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0.25]}>
      <meshStandardMaterial color="#ffca28" />
    </Cone>
    {/* Wings */}
    <Box args={[0.6, 0.05, 0.2]} position={[0, 0.05, -0.05]}>
      <meshStandardMaterial color="#3e2723" />
    </Box>
  </group>
);

const Bear = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.7}>
    <group position={[0, 0.5, 0]}>
      {/* Body */}
      <Box args={[0.8, 0.7, 1.2]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#3e2723" />
      </Box>
      {/* Head */}
      <Box args={[0.5, 0.5, 0.5]} position={[0, 0.8, 0.7]}>
        <meshStandardMaterial color="#3e2723" />
      </Box>
      {/* Snout */}
      <Box args={[0.25, 0.2, 0.2]} position={[0, 0.7, 1.0]}>
        <meshStandardMaterial color="#21110e" />
      </Box>
      {/* Legs */}
      <Box args={[0.25, 0.5, 0.25]} position={[-0.25, 0, 0.4]}><meshStandardMaterial color="#2d1b16" /></Box>
      <Box args={[0.25, 0.5, 0.25]} position={[0.25, 0, 0.4]}><meshStandardMaterial color="#2d1b16" /></Box>
      <Box args={[0.25, 0.5, 0.25]} position={[-0.25, 0, -0.4]}><meshStandardMaterial color="#2d1b16" /></Box>
      <Box args={[0.25, 0.5, 0.25]} position={[0.25, 0, -0.4]}><meshStandardMaterial color="#2d1b16" /></Box>
    </group>
  </AnimatedElement>
);

const Wolf = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.5}>
    <group position={[0, 0.4, 0]}>
      {/* Body */}
      <Box args={[0.5, 0.4, 1.0]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#78909c" />
      </Box>
      {/* Head */}
      <Box args={[0.3, 0.3, 0.4]} position={[0, 0.7, 0.55]}>
        <meshStandardMaterial color="#78909c" />
      </Box>
      {/* Snout */}
      <Box args={[0.15, 0.15, 0.2]} position={[0, 0.65, 0.8]}>
        <meshStandardMaterial color="#455a64" />
      </Box>
      {/* Tail */}
      <Box args={[0.1, 0.1, 0.4]} position={[0, 0.5, -0.6]} rotation={[0.2, 0, 0]}>
        <meshStandardMaterial color="#78909c" />
      </Box>
      {/* Legs */}
      <Box args={[0.12, 0.5, 0.12]} position={[-0.15, 0, 0.35]}><meshStandardMaterial color="#546e7a" /></Box>
      <Box args={[0.12, 0.5, 0.12]} position={[0.15, 0, 0.35]}><meshStandardMaterial color="#546e7a" /></Box>
      <Box args={[0.12, 0.5, 0.12]} position={[-0.15, 0, -0.35]}><meshStandardMaterial color="#546e7a" /></Box>
      <Box args={[0.12, 0.5, 0.12]} position={[0.15, 0, -0.35]}><meshStandardMaterial color="#546e7a" /></Box>
    </group>
  </AnimatedElement>
);

// --- Main Island Component ---

export const ForestIsland = ({ health }: IslandProps) => {
  // Generate more items for density and variety
  const items = useMemo(() => getStablePositions(180, 11, 150), []); 
  
  // Separate list for ground animals
  const groundAnimals = useMemo(() => {
    // Generate 8 animals
    const raw = getStablePositions(8, 9, 999);
    return raw.map((item, i) => ({
      ...item,
      type: i % 2 === 0 ? 'wolf' : 'bear' // Alternating types
    }));
  }, []);

  return (
    <group>
      <IslandBase color="#558b2f" size={12} health={health} />
      
      {/* FLORA LAYERS */}
      {items.map((item, i) => {
        // We use the 'variant' (0-2 usually) but modulo it to get more types
        const type = i % 6; 
        // Logic for eagle placement: Only on tall trees (0 or 2), rare chance
        const hasEagle = (type === 0 || type === 5) && (i % 18 === 0);

        return (
          <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
            <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
              
              {/* Type 0: Classic Pine */}
              {type === 0 && (
                <group>
                  <Cylinder args={[0.15, 0.25, 0.6, 6]} position={[0, 0.3, 0]}><meshStandardMaterial color="#4e342e" /></Cylinder>
                  <Cone args={[0.7, 1.2, 7]} position={[0, 0.9, 0]}><meshStandardMaterial color="#2e7d32" /></Cone>
                  <Cone args={[0.5, 1.0, 7]} position={[0, 1.4, 0]}><meshStandardMaterial color="#388e3c" /></Cone>
                  {hasEagle && <group position={[0, 1.9, 0]} rotation={[0, i, 0]}><Eagle /></group>}
                </group>
              )}

              {/* Type 1: Round Oak/Deciduous */}
              {type === 1 && (
                <group>
                  <Cylinder args={[0.15, 0.2, 0.8, 6]} position={[0, 0.4, 0]}><meshStandardMaterial color="#5d4037" /></Cylinder>
                  <Sphere args={[0.7, 6, 6]} position={[0, 1.1, 0]} scale={[1, 0.8, 1]}><meshStandardMaterial color="#43a047" flatShading /></Sphere>
                  <Sphere args={[0.5, 5, 5]} position={[0.4, 1.3, 0]} scale={[1, 0.8, 1]}><meshStandardMaterial color="#4caf50" flatShading /></Sphere>
                  <Sphere args={[0.5, 5, 5]} position={[-0.3, 1.2, 0.3]} scale={[1, 0.8, 1]}><meshStandardMaterial color="#388e3c" flatShading /></Sphere>
                </group>
              )}

              {/* Type 2: Tall Redwood/Pine */}
              {type === 2 && (
                <group scale={[1, 1.4, 1]}>
                  <Cylinder args={[0.2, 0.3, 1.5, 7]} position={[0, 0.75, 0]}><meshStandardMaterial color="#3e2723" /></Cylinder>
                  <Cone args={[0.8, 2, 7]} position={[0, 2, 0]}><meshStandardMaterial color="#1b5e20" /></Cone>
                  {hasEagle && <group position={[0, 3, 0]} rotation={[0, i, 0]} scale={[1, 0.7, 1]}><Eagle /></group>}
                </group>
              )}

              {/* Type 3: Birch Tree (White trunk) */}
              {type === 3 && (
                <group>
                  <Cylinder args={[0.1, 0.12, 1.2, 5]} position={[0, 0.6, 0]}>
                    <meshStandardMaterial color="#eeeeee" />
                  </Cylinder>
                  {/* Black spots on birch */}
                  <Box args={[0.11, 0.05, 0.11]} position={[0, 0.3, 0]} rotation={[0, 0.2, 0]}><meshStandardMaterial color="#212121" /></Box>
                  <Box args={[0.11, 0.05, 0.11]} position={[0, 0.8, 0]} rotation={[0, -0.5, 0]}><meshStandardMaterial color="#212121" /></Box>
                  <Sphere args={[0.6, 5, 5]} position={[0, 1.4, 0]} scale={[1, 1.2, 1]}><meshStandardMaterial color="#66bb6a" flatShading /></Sphere>
                </group>
              )}

              {/* Type 4: Low Bush */}
              {type === 4 && (
                <group position={[0, 0.2, 0]}>
                  <Sphere args={[0.4, 4, 4]} position={[0, 0, 0]}><meshStandardMaterial color="#7cb342" flatShading /></Sphere>
                  <Sphere args={[0.3, 4, 4]} position={[0.3, -0.1, 0]}><meshStandardMaterial color="#8bc34a" flatShading /></Sphere>
                  <Sphere args={[0.35, 4, 4]} position={[-0.2, 0.1, 0.2]}><meshStandardMaterial color="#689f38" flatShading /></Sphere>
                </group>
              )}

              {/* Type 5: Ferns */}
              {type === 5 && (
                 <group position={[0, 0.1, 0]}>
                    <Cone args={[0.3, 0.6, 3]} rotation={[0.2, 0, 0]} position={[0, 0, 0.1]}><meshStandardMaterial color="#558b2f" /></Cone>
                    <Cone args={[0.3, 0.6, 3]} rotation={[-0.2, 2, 0]} position={[0.1, 0, -0.1]}><meshStandardMaterial color="#558b2f" /></Cone>
                    <Cone args={[0.25, 0.5, 3]} rotation={[0.1, 4, 0]} position={[-0.1, 0, 0]}><meshStandardMaterial color="#689f38" /></Cone>
                 </group>
              )}

            </AnimatedElement>
          </group>
        );
      })}
      
      {/* FAUNA LAYERS */}
      {groundAnimals.map((anim, i) => (
        <group key={`anim-${i}`} position={anim.position} rotation={[0, anim.rotation, 0]}>
          {anim.type === 'bear' ? (
            <Bear isVisible={health > anim.threshold} />
          ) : (
            <Wolf isVisible={health > anim.threshold} />
          )}
        </group>
      ))}
    </group>
  );
};