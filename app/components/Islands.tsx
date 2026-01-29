'use client';

import React, { useMemo } from 'react';
import { Box, Cone, Sphere, Cylinder } from '@react-three/drei';

// --- Shared Types & Helpers ---

interface IslandProps {
  count: number;
}

// Helper: Square scattering logic instead of circular
const getRandomPositions = (count: number, size: number) => {
  const visualCount = Math.min(count, 200); // Increased limit slightly for better density
  
  return Array.from({ length: visualCount }).map(() => {
    // Square distribution: -size/2 to size/2
    const x = (Math.random() - 0.5) * size; 
    const z = (Math.random() - 0.5) * size;
    const scale = 0.6 + Math.random() * 0.6; // More variance
    const rotation = Math.random() * Math.PI * 2;
    // Random variant type (0, 1, or 2) for variety
    const variant = Math.floor(Math.random() * 3); 
    return { position: [x, 0, z] as [number, number, number], scale, rotation, variant };
  });
};

// Low Poly Animal Component
const SimpleAnimal = ({ position, rotation }: { position: [number, number, number], rotation: number }) => (
  <group position={position} rotation={[0, rotation, 0]} scale={0.4}>
    {/* Body */}
    <Box args={[1, 0.6, 1.4]} position={[0, 0.6, 0]}>
      <meshStandardMaterial color="#e65100" /> {/* Fox/Deer orange */}
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
);

// New Square Base
const IslandBase = ({ color = "#4caf50", size = 12, height = 2 }) => (
  <group>
    {/* Top Surface (Square) */}
    <Box args={[size, height, size]} position={[0, -height/2, 0]}>
      <meshStandardMaterial color={color} roughness={0.8} />
    </Box>
    {/* Underside (Dirt Block) */}
    <Box args={[size * 0.9, height * 1.5, size * 0.9]} position={[0, -height - (height * 1.5)/2 + 0.1, 0]}>
      <meshStandardMaterial color="#5d4037" roughness={1} />
    </Box>
  </group>
);

// --- Ecosystem Components ---

export const ForestIsland = ({ count }: IslandProps) => {
  const items = useMemo(() => getRandomPositions(count, 11), [count]);
  // Add a few animals
  const animals = useMemo(() => getRandomPositions(Math.max(2, count / 20), 10), [count]);

  return (
    <group>
      <IslandBase color="#66bb6a" size={12} />
      {items.map((item, i) => (
        <group key={i} position={item.position} scale={item.scale} rotation={[0, item.rotation, 0]}>
          <Cylinder args={[0.15, 0.2, 0.6, 6]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color="#5d4037" />
          </Cylinder>
          {/* Tree Variation */}
          {item.variant === 0 ? (
            // Pine Style
            <Cone args={[0.6, 1.5, 7]} position={[0, 1.0, 0]}>
              <meshStandardMaterial color="#2e7d32" />
            </Cone>
          ) : item.variant === 1 ? (
             // Bushy Style
            <group position={[0, 1.0, 0]}>
               <Sphere args={[0.6, 5, 5]} scale={[1, 0.8, 1]}>
                 <meshStandardMaterial color="#43a047" flatShading />
               </Sphere>
            </group>
          ) : (
            // Tall Stacked Style
            <group position={[0, 0.8, 0]}>
               <Cone args={[0.5, 0.8, 6]} position={[0, 0, 0]}><meshStandardMaterial color="#388e3c" /></Cone>
               <Cone args={[0.4, 0.8, 6]} position={[0, 0.5, 0]}><meshStandardMaterial color="#4caf50" /></Cone>
            </group>
          )}
        </group>
      ))}
      
      {animals.map((anim, i) => (
        <SimpleAnimal key={`anim-${i}`} position={anim.position} rotation={anim.rotation} />
      ))}
    </group>
  );
};

export const RainforestIsland = ({ count }: IslandProps) => {
  const items = useMemo(() => getRandomPositions(count, 11), [count]);
  
  return (
    <group>
      <IslandBase color="#1b5e20" size={12} />
      {items.map((item, i) => (
        <group key={i} position={item.position} scale={item.scale * 1.2} rotation={[0, item.rotation, 0]}>
          <Cylinder args={[0.1, 0.15, 1.5, 5]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#3e2723" />
          </Cylinder>
          {/* Canopy Variations */}
          {item.variant === 0 ? (
             <Sphere args={[0.8, 5, 5]} position={[0, 1.6, 0]} scale={[1, 0.5, 1]}>
               <meshStandardMaterial color="#2e7d32" flatShading />
             </Sphere>
          ) : (
             <group position={[0, 1.5, 0]}>
                <Cone args={[0.8, 0.5, 5]} rotation={[0,0,Math.PI]} position={[0, 0.2, 0]} >
                   <meshStandardMaterial color="#43a047" />
                </Cone>
                <Sphere args={[0.5, 4, 4]} position={[0, 0.5, 0]}>
                   <meshStandardMaterial color="#1b5e20" flatShading />
                </Sphere>
             </group>
          )}
        </group>
      ))}
    </group>
  );
};

export const GrasslandIsland = ({ count }: IslandProps) => {
  // Much higher density for grass
  const items = useMemo(() => getRandomPositions(count * 4, 11.5), [count]);
  const animals = useMemo(() => getRandomPositions(Math.max(3, count / 15), 10), [count]);

  return (
    <group>
      <IslandBase color="#aed581" size={12} />
      {items.map((item, i) => (
         <group key={i} position={item.position} scale={item.scale * 1.5} rotation={[0, item.rotation, 0]}>
          {item.variant === 0 ? (
            // Tall grass blade
            <Cone args={[0.05, 0.8, 3]} position={[0, 0.4, 0]} scale={[1, 1, 0.2]}>
              <meshStandardMaterial color="#7cb342" />
            </Cone>
          ) : (
            // Small bush/tuft
            <Sphere args={[0.3, 4, 4]} position={[0, 0.1, 0]} scale={[1, 0.6, 1]}>
               <meshStandardMaterial color="#8bc34a" flatShading />
            </Sphere>
          )}
         </group>
      ))}
      
      {/* Rocks */}
      <Sphere args={[0.5, 4, 4]} position={[2, 0.2, 2]} scale={[1, 0.6, 1]}>
        <meshStandardMaterial color="#9e9e9e" flatShading />
      </Sphere>
      <Sphere args={[0.7, 4, 4]} position={[-3, 0.3, -2]} scale={[1, 0.5, 1]}>
        <meshStandardMaterial color="#757575" flatShading />
      </Sphere>

      {animals.map((anim, i) => (
        <SimpleAnimal key={`anim-${i}`} position={anim.position} rotation={anim.rotation} />
      ))}
    </group>
  );
};

// Re-using older logic for Mangrove/Peatland but adapting base to square
export const MangroveIsland = ({ count }: IslandProps) => {
  const items = useMemo(() => getRandomPositions(count, 11), [count]);
  return (
    <group>
      <IslandBase color="#0277bd" size={12} />
      {/* Sandy patches on top of water */}
      <Box args={[11, 0.1, 11]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#d7ccc8" />
      </Box>
      {items.map((item, i) => (
        <group key={i} position={item.position} scale={item.scale} rotation={[0, item.rotation, 0]}>
          <Cylinder args={[0.05, 0.08, 0.6, 4]} position={[0.1, 0.3, 0]} rotation={[0,0, -0.3]}>
            <meshStandardMaterial color="#795548" />
          </Cylinder>
           <Cylinder args={[0.05, 0.08, 0.6, 4]} position={[-0.1, 0.3, 0]} rotation={[0,0, 0.3]}>
            <meshStandardMaterial color="#795548" />
          </Cylinder>
          <Sphere args={[0.4, 5, 5]} position={[0, 0.7, 0]}>
             <meshStandardMaterial color="#558b2f" flatShading />
          </Sphere>
        </group>
      ))}
    </group>
  );
};

export const PeatlandIsland = ({ count }: IslandProps) => {
    const items = useMemo(() => getRandomPositions(count * 1.5, 11), [count]);
    return (
      <group>
        <IslandBase color="#4e342e" size={12} />
        <Box args={[3, 0.05, 3]} position={[2, 0.03, 2]}>
            <meshStandardMaterial color="#3e2723" roughness={0.4} />
        </Box>
        {items.map((item, i) => (
           <group key={i} position={item.position} scale={item.scale} rotation={[0, item.rotation, 0]}>
             <Sphere args={[0.2, 4, 4]} position={[0, 0.1, 0]} scale={[1, 0.4, 1]}>
                <meshStandardMaterial color="#33691e" flatShading />
             </Sphere>
           </group>
        ))}
      </group>
    );
};