'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cone, Cylinder, Sphere, Box } from '@react-three/drei';
import { IslandProps, getStablePositions, getCircularPositions, IslandBase, AnimatedElement, ISLAND_CONFIG } from './Shared';
import * as THREE from 'three';

// --- Animation Helper ---

const MovingElement = ({ 
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
  const randomOffset = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime + randomOffset + offset;
      
      if (type === 'sway') {
        // Wind effect for grass/shrubs
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

// --- Fauna Components ---

const Bison = ({ isVisible }: { isVisible: boolean }) => (
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

const Elk = ({ isVisible }: { isVisible: boolean }) => (
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

const Bear = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatedElement isVisible={isVisible} baseScale={0.5}>
    <MovingElement type="bounce" speed={1} intensity={0.05}>
      <group position={[0, 0.4, 0]}>
        {/* Body */}
        <Box args={[0.7, 0.6, 1.1]} position={[0, 0.3, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        {/* Head */}
        <Box args={[0.45, 0.45, 0.45]} position={[0, 0.6, 0.7]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        {/* Snout */}
        <Box args={[0.2, 0.15, 0.2]} position={[0, 0.55, 0.95]}>
          <meshStandardMaterial color="#424242" />
        </Box>
        {/* Ears */}
        <Box args={[0.1, 0.1, 0.05]} position={[0.18, 0.85, 0.65]}><meshStandardMaterial color="#1a1a1a" /></Box>
        <Box args={[0.1, 0.1, 0.05]} position={[-0.18, 0.85, 0.65]}><meshStandardMaterial color="#1a1a1a" /></Box>
        {/* Legs */}
        <Box args={[0.2, 0.5, 0.2]} position={[-0.25, 0, 0.35]}><meshStandardMaterial color="#1a1a1a" /></Box>
        <Box args={[0.2, 0.5, 0.2]} position={[0.25, 0, 0.35]}><meshStandardMaterial color="#1a1a1a" /></Box>
        <Box args={[0.2, 0.5, 0.2]} position={[-0.25, 0, -0.35]}><meshStandardMaterial color="#1a1a1a" /></Box>
        <Box args={[0.2, 0.5, 0.2]} position={[0.25, 0, -0.35]}><meshStandardMaterial color="#1a1a1a" /></Box>
      </group>
    </MovingElement>
  </AnimatedElement>
);

// --- Flora Components ---

const ShortGrassTuft = () => (
  // Simple tuft for carpeting, static or very low movement
  <group position={[0, 0.05, 0]}>
     <Cone args={[0.03, 0.3, 3]} position={[0.02, 0, 0.02]} rotation={[0.1, 0.5, 0.1]}><meshStandardMaterial color="#aed581" /></Cone>
     <Cone args={[0.03, 0.25, 3]} position={[-0.02, 0, -0.01]} rotation={[-0.1, 0.2, -0.1]}><meshStandardMaterial color="#9ccc65" /></Cone>
     <Cone args={[0.03, 0.2, 3]} position={[0, 0, 0.03]} rotation={[0.2, 1, 0]}><meshStandardMaterial color="#8bc34a" /></Cone>
  </group>
);

const TallPrairieGrass = () => (
  <MovingElement type="sway" speed={2} intensity={0.15}>
    <group position={[0, 0.5, 0]}>
       <Cone args={[0.1, 1.2, 3]} position={[0, 0, 0]} rotation={[0.05, 0, 0]}><meshStandardMaterial color="#c5e1a5" /></Cone>
       <Cone args={[0.08, 1.0, 3]} position={[0.1, -0.1, 0.1]} rotation={[-0.05, 1, 0.05]}><meshStandardMaterial color="#aed581" /></Cone>
       <Cone args={[0.08, 1.1, 3]} position={[-0.1, -0.1, -0.05]} rotation={[0.05, 2, -0.05]}><meshStandardMaterial color="#dcedc8" /></Cone>
    </group>
  </MovingElement>
);

const WheatStalks = () => (
  <MovingElement type="sway" speed={1.5} intensity={0.2}>
    <group position={[0, 0.6, 0]}>
       {/* Stalk 1 */}
       <Cylinder args={[0.02, 0.02, 1.2]} position={[0, 0, 0]}><meshStandardMaterial color="#f0f4c3" /></Cylinder>
       <Box args={[0.06, 0.25, 0.06]} position={[0, 0.6, 0]}><meshStandardMaterial color="#fff59d" /></Box>
       {/* Stalk 2 */}
       <Cylinder args={[0.02, 0.02, 1.0]} position={[0.15, -0.1, 0]} rotation={[0, 0, -0.1]}><meshStandardMaterial color="#f0f4c3" /></Cylinder>
       <Box args={[0.06, 0.25, 0.06]} position={[0.2, 0.45, 0]} rotation={[0, 0, -0.1]}><meshStandardMaterial color="#fff59d" /></Box>
    </group>
  </MovingElement>
);

const FloweringShrub = () => (
  <MovingElement type="sway" speed={3} intensity={0.05}>
    <group position={[0, 0.25, 0]}>
      <Sphere args={[0.4, 5, 5]} position={[0, 0, 0]} scale={[1, 0.7, 1]}><meshStandardMaterial color="#689f38" flatShading /></Sphere>
      <Sphere args={[0.3, 5, 5]} position={[0.25, 0.2, 0]} scale={[1, 0.7, 1]}><meshStandardMaterial color="#7cb342" flatShading /></Sphere>
      {/* Flowers */}
      <Sphere args={[0.08, 3, 3]} position={[0.1, 0.35, 0.2]}><meshStandardMaterial color="#e91e63" /></Sphere>
      <Sphere args={[0.08, 3, 3]} position={[-0.15, 0.2, 0.25]}><meshStandardMaterial color="#fff" /></Sphere>
      <Sphere args={[0.08, 3, 3]} position={[0.3, 0.4, -0.1]}><meshStandardMaterial color="#ffeb3b" /></Sphere>
    </group>
  </MovingElement>
);

const DenseGrassClump = () => (
  <group position={[0, 0.15, 0]}>
    <Cone args={[0.4, 0.6, 5]} position={[0, 0, 0]}><meshStandardMaterial color="#558b2f" /></Cone>
    <Cone args={[0.35, 0.5, 5]} position={[0.2, 0, 0.2]}><meshStandardMaterial color="#33691e" /></Cone>
    <Cone args={[0.35, 0.5, 5]} position={[-0.2, 0, -0.1]}><meshStandardMaterial color="#689f38" /></Cone>
  </group>
);

const WildflowerPatch = () => (
  <MovingElement type="sway" speed={2.5} intensity={0.1}>
    <group position={[0, 0.2, 0]}>
       {/* Stem 1 */}
       <Cylinder args={[0.02, 0.02, 0.5]} position={[0, 0, 0]}><meshStandardMaterial color="#33691e" /></Cylinder>
       <Sphere args={[0.12, 4, 4]} position={[0, 0.25, 0]}><meshStandardMaterial color="#9c27b0" /></Sphere>
       {/* Stem 2 */}
       <Cylinder args={[0.02, 0.02, 0.4]} position={[0.1, -0.05, 0.1]} rotation={[0.2, 0, 0]}><meshStandardMaterial color="#33691e" /></Cylinder>
       <Sphere args={[0.1, 4, 4]} position={[0.1, 0.15, 0.15]}><meshStandardMaterial color="#ba68c8" /></Sphere>
    </group>
  </MovingElement>
);


// --- Main Island Component ---

export const GrasslandIsland = ({ health }: IslandProps) => {
  // 1. CARPET LAYER: 800 small items to cover the ground
  const carpet = useMemo(() => getCircularPositions(900, ISLAND_CONFIG.contentRadius + 0.3, 800), []);

  // 2. FLORA LAYER: 350 larger items (Tall stuff)
  const items = useMemo(() => getCircularPositions(500, ISLAND_CONFIG.contentRadius + 0.1, 450), []);
  
  // 3. FAUNA LAYER: 10 animals
  const fauna = useMemo(() => {
    const raw = getCircularPositions(10, ISLAND_CONFIG.faunaRadius, 600);
    return raw.map((item, i) => ({
      ...item,
      // Distribute types: 0=Bison, 1=Elk, 2=Bear
      type: i % 3
    }));
  }, []);

  return (
    <group>
      {/* Lighter Green Base for Prairie */}
      <IslandBase color="#efb556" health={health} />
      
      {/* CARPET LAYER (Rendered first, lowest) */}
      {carpet.map((item, i) => (
         <group key={`carpet-${i}`} position={item.position} rotation={[0, item.rotation, 0]}>
             <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
                 <ShortGrassTuft />
             </AnimatedElement>
         </group>
      ))}

      {/* FLORA LAYER */}
      {items.map((item, i) => {
        // 5 Variants
        const type = i % 5; 
        return (
          <group key={`flora-${i}`} position={item.position} rotation={[0, item.rotation, 0]}>
            <AnimatedElement isVisible={health > item.threshold} baseScale={item.scale}>
               {type === 0 && <TallPrairieGrass />}
               {type === 1 && <FloweringShrub />}
               {type === 2 && <WheatStalks />}
               {type === 3 && <DenseGrassClump />}
               {type === 4 && <WildflowerPatch />}
            </AnimatedElement>
          </group>
        );
      })}

      {/* ROCKS (Static decoration) */}
      <group position={[3, 0.3, -2]} scale={[1.5, 1, 1.5]}>
         <Sphere args={[0.5, 4, 4]}><meshStandardMaterial color="#757575" flatShading /></Sphere>
         <Sphere args={[0.3, 4, 4]} position={[0.5, -0.2, 0.3]}><meshStandardMaterial color="#9e9e9e" flatShading /></Sphere>
      </group>

      {/* FAUNA LAYER */}
      {fauna.map((anim, i) => (
         <group key={`anim-${i}`} position={anim.position} rotation={[0, anim.rotation, 0]}>
            {anim.type === 0 && <Bison isVisible={health > anim.threshold} />}
            {anim.type === 1 && <Elk isVisible={health > anim.threshold} />}
            {anim.type === 2 && <Bear isVisible={health > anim.threshold} />}
         </group>
      ))}
    </group>
  );
};