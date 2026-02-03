'use client';

import React, { useMemo } from 'react';
import { IslandProps, getCircularPositions, IslandBase, ISLAND_CONFIG } from './Shared';
import { ForestBear } from '../animals/ForestBear';
import { Eagle } from '../animals/Eagle';
import { Wolf } from '../animals/Wolf';
import { InstancedPine, InstancedOak, InstancedRedwood, InstancedBirch, InstancedLowBush, InstancedFerns } from './InstancedForest';

// --- Main Island Component ---

export const ForestIsland = ({ health }: IslandProps) => {
  // Generate more items for density and variety
  const items = useMemo(() => getCircularPositions(180, ISLAND_CONFIG.contentRadius, 150), []); 
  
  // Separate list for ground animals
  const groundAnimals = useMemo(() => {
    // Generate 8 animals
    const raw = getCircularPositions(8, ISLAND_CONFIG.faunaRadius, 999);
    return raw.map((item, i) => ({
      ...item,
      type: i % 2 === 0 ? 'wolf' : 'bear' // Alternating types
    }));
  }, []);

  // Filter items by type for Instanced Meshes
  const pines = useMemo(() => items.filter((_, i) => i % 6 === 0), [items]);
  const oaks = useMemo(() => items.filter((_, i) => i % 6 === 1), [items]);
  const redwoods = useMemo(() => items.filter((_, i) => i % 6 === 2), [items]);
  const birches = useMemo(() => items.filter((_, i) => i % 6 === 3), [items]);
  const bushes = useMemo(() => items.filter((_, i) => i % 6 === 4), [items]);
  const ferns = useMemo(() => items.filter((_, i) => i % 6 === 5), [items]);

  // Eagle Logic:
  // Original: hasEagle = (type === 0 || type === 5) && (i % 18 === 0)
  // But strictly rendered only in Type 0 (Pine) and Type 2 (Redwood).
  // However, since hasEagle was false for Type 2 (unless I misread 5 as 2), it only appeared on Pine.
  // We will place eagles on Pines (Type 0) where i % 18 == 0.
  const eaglePositions = useMemo(() => {
    return items
      .map((item, i) => ({ ...item, originalIndex: i }))
      .filter(item => {
         const type = item.originalIndex % 6;
         // Only on Pines (0) for now to match effective original behavior
         return (type === 0) && (item.originalIndex % 18 === 0);
      });
  }, [items]);

  return (
    <group>
      <IslandBase color="#558b2f" health={health} />
      
      {/* INSTANCED FLORA LAYERS */}
      <InstancedPine items={pines} health={health} />
      <InstancedOak items={oaks} health={health} />
      <InstancedRedwood items={redwoods} health={health} />
      <InstancedBirch items={birches} health={health} />
      <InstancedLowBush items={bushes} health={health} />
      <InstancedFerns items={ferns} health={health} />
      
      {/* EAGLES (Individual because they animate/are rare) */}
      {eaglePositions.map((item, i) => (
         <group key={`eagle-${i}`} position={item.position} rotation={[0, item.rotation, 0]}>
             {/* Height matches the Pine tree top (approx 1.9) */}
             <group position={[0, 1.9, 0]} rotation={[0, item.originalIndex, 0]}>
                <Eagle />
             </group>
         </group>
      ))}

      {/* FAUNA LAYERS */}
      {groundAnimals.map((anim, i) => (
        <group key={`anim-${i}`} position={anim.position} rotation={[0, anim.rotation, 0]}>
          {anim.type === 'bear' ? (
            <ForestBear isVisible={health > anim.threshold} />
          ) : (
            <Wolf isVisible={health > anim.threshold} />
          )}
        </group>
      ))}
    </group>
  );
};