'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cone, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// --- Shared Types & Helpers ---

interface IslandProps {
  health: number; // 0.0 (Dead/Barren) to 1.0 (Lush/Full)
}

// Helper: Stable random number generator to keep positions fixed across re-renders
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Generate fixed positions once
const getStablePositions = (count: number, size: number, seedOffset: number) => {
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
const AnimatedElement = ({ 
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

      // Elastic bounce effect when popping in? (Simplified to just smooth lerp for now for "satisfying" feel)
      // If we want "pop", we could overshoot, but standard ease-out is often cleaner.
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};


// Low Poly Animal Component (Also animates visibility!)
const SimpleAnimal = ({ position, rotation, isVisible }: { position: [number, number, number], rotation: number, isVisible: boolean }) => (
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
const IslandBase = ({ color, size = 12, height = 2, health }: { color: string, size?: number, height?: number, health: number }) => {
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

// --- Ecosystem Components ---

export const ForestIsland = ({ health }: IslandProps) => {
  // Generate 150 potential trees
  const items = useMemo(() => getStablePositions(150, 11, 100), []); 
  const animals = useMemo(() => getStablePositions(5, 10, 200), []);

  return (
    <group>
      <IslandBase color="#66bb6a" size={12} health={health} />
      {items.map((item, i) => (
        <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
           <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
              <group>
                <Cylinder args={[0.15, 0.2, 0.6, 6]} position={[0, 0.3, 0]}>
                  <meshStandardMaterial color="#5d4037" />
                </Cylinder>
                {/* Tree Variation */}
                {item.variant === 0 ? (
                  <Cone args={[0.6, 1.5, 7]} position={[0, 1.0, 0]}>
                    <meshStandardMaterial color="#2e7d32" />
                  </Cone>
                ) : item.variant === 1 ? (
                  <group position={[0, 1.0, 0]}>
                    <Sphere args={[0.6, 5, 5]} scale={[1, 0.8, 1]}>
                      <meshStandardMaterial color="#43a047" flatShading />
                    </Sphere>
                  </group>
                ) : (
                  <group position={[0, 0.8, 0]}>
                    <Cone args={[0.5, 0.8, 6]} position={[0, 0, 0]}><meshStandardMaterial color="#388e3c" /></Cone>
                    <Cone args={[0.4, 0.8, 6]} position={[0, 0.5, 0]}><meshStandardMaterial color="#4caf50" /></Cone>
                  </group>
                )}
              </group>
          </AnimatedElement>
        </group>
      ))}
      
      {animals.map((anim, i) => (
        <SimpleAnimal key={`anim-${i}`} position={anim.position} rotation={anim.rotation} isVisible={health > anim.threshold} />
      ))}
    </group>
  );
};

export const RainforestIsland = ({ health }: IslandProps) => {
  const items = useMemo(() => getStablePositions(150, 11, 300), []);
  
  return (
    <group>
      <IslandBase color="#1b5e20" size={12} health={health} />
      {items.map((item, i) => (
        <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
           <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale * 1.2}>
              <group>
                <Cylinder args={[0.1, 0.15, 1.5, 5]} position={[0, 0.75, 0]}>
                  <meshStandardMaterial color="#3e2723" />
                </Cylinder>
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
           </AnimatedElement>
        </group>
      ))}
    </group>
  );
};

export const GrasslandIsland = ({ health }: IslandProps) => {
  const items = useMemo(() => getStablePositions(300, 11.5, 400), []); // More grass
  const animals = useMemo(() => getStablePositions(8, 10, 500), []);

  return (
    <group>
      <IslandBase color="#aed581" size={12} health={health} />
      {items.map((item, i) => (
         <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
           <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale * 1.5}>
              <group>
                {item.variant === 0 ? (
                  <Cone args={[0.05, 0.8, 3]} position={[0, 0.4, 0]} scale={[1, 1, 0.2]}>
                    <meshStandardMaterial color="#7cb342" />
                  </Cone>
                ) : (
                  <Sphere args={[0.3, 4, 4]} position={[0, 0.1, 0]} scale={[1, 0.6, 1]}>
                    <meshStandardMaterial color="#8bc34a" flatShading />
                  </Sphere>
                )}
              </group>
           </AnimatedElement>
         </group>
      ))}
      
      {/* Rocks (Always visible) */}
      <Sphere args={[0.5, 4, 4]} position={[2, 0.2, 2]} scale={[1, 0.6, 1]}>
        <meshStandardMaterial color="#9e9e9e" flatShading />
      </Sphere>

      {animals.map((anim, i) => (
        <SimpleAnimal key={`anim-${i}`} position={anim.position} rotation={anim.rotation} isVisible={health > anim.threshold} />
      ))}
    </group>
  );
};

export const MangroveIsland = ({ health }: IslandProps) => {
  const items = useMemo(() => getStablePositions(120, 11, 600), []);
  return (
    <group>
      <IslandBase color="#0277bd" size={12} health={health} />
      {/* Sandy patches - fade slightly with health */}
      <Box args={[11, 0.1, 11]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#d7ccc8" opacity={0.5 + health * 0.5} transparent />
      </Box>
      {items.map((item, i) => (
        <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
          <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
            <group>
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
          </AnimatedElement>
        </group>
      ))}
    </group>
  );
};

export const PeatlandIsland = ({ health }: IslandProps) => {
    const items = useMemo(() => getStablePositions(180, 11, 700), []);
    return (
      <group>
        <IslandBase color="#4e342e" size={12} health={health} />
        <Box args={[3, 0.05, 3]} position={[2, 0.03, 2]}>
            <meshStandardMaterial color="#3e2723" roughness={0.4} />
        </Box>
        {items.map((item, i) => (
           <group key={i} position={item.position} rotation={[0, item.rotation, 0]}>
             <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
               <group>
                 <Sphere args={[0.2, 4, 4]} position={[0, 0.1, 0]} scale={[1, 0.4, 1]}>
                    <meshStandardMaterial color="#33691e" flatShading />
                 </Sphere>
               </group>
             </AnimatedElement>
           </group>
        ))}
      </group>
    );
};
