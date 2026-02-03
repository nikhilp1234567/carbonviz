'use client';

import React, { useMemo } from 'react';
import { bakeGeometry, GenericInstanced } from './InstancedShared';

// --- Geometries & Exports ---

// Type 1: Large Fern
export const InstancedFern = (props: any) => {
  const geo = useMemo(() => bakeGeometry([
    { type: 'Cone', args: [0.15, 1.2, 4], rot: [0, 0, 0.5], pos: [0.2, 0.2, 0], groupPos: [0, 0.2, 0], color: "#43a047" },
    { type: 'Cone', args: [0.15, 1.2, 4], rot: [0, 0, -0.5], pos: [-0.2, 0.2, 0], groupPos: [0, 0.2, 0], color: "#43a047" },
    { type: 'Cone', args: [0.15, 1.0, 4], rot: [0.5, 0, 0], pos: [0, 0.2, 0.2], groupPos: [0, 0.2, 0], color: "#388e3c" }
  ]), []);
  return <GenericInstanced {...props} geometry={geo} />;
};

// Type 4: Banana
export const InstancedBanana = (props: any) => {
  const geo = useMemo(() => bakeGeometry([
    { type: 'Cylinder', args: [0.05, 0.08, 0.4], pos: [0, 0.2, 0], groupPos: [0, 0.4, 0], color: "#33691e" },
    { type: 'Sphere', args: [0.4, 4, 4], scale: [0.1, 1, 0.5], rot: [0, 0, -0.5], pos: [0.3, 0.6, 0], groupPos: [0, 0.4, 0], color: "#7cb342" },
    { type: 'Sphere', args: [0.4, 4, 4], scale: [0.1, 1, 0.5], rot: [0, 0, 0.5], pos: [-0.3, 0.5, 0.2], groupPos: [0, 0.4, 0], color: "#7cb342" }
  ]), []);
  return <GenericInstanced {...props} geometry={geo} />;
};

// Type 6: Dense Bush
export const InstancedBush = (props: any) => {
  const geo = useMemo(() => bakeGeometry([
    { type: 'Sphere', args: [0.5, 5, 5], pos: [0, 0, 0], groupPos: [0, 0.3, 0], color: "#1b5e20" },
    { type: 'Sphere', args: [0.4, 5, 5], pos: [0.4, 0.2, 0], groupPos: [0, 0.3, 0], color: "#2e7d32" },
    { type: 'Sphere', args: [0.4, 5, 5], pos: [-0.3, 0.1, 0.3], groupPos: [0, 0.3, 0], color: "#33691e" }
  ]), []);
  return <GenericInstanced {...props} geometry={geo} />;
};

// Type 7: Tall Grass
export const InstancedTallGrass = (props: any) => {
  const geo = useMemo(() => bakeGeometry([
    { type: 'Cone', args: [0.05, 0.6, 3], rot: [0.2, 0, 0], pos: [0, 0.3, 0], groupPos: [0, 0, 0], color: "#8bc34a" },
    { type: 'Cone', args: [0.05, 0.5, 3], rot: [-0.2, 0, 0.2], pos: [0.1, 0.25, 0], groupPos: [0, 0, 0], color: "#9ccc65" },
    { type: 'Cone', args: [0.05, 0.7, 3], rot: [0, 0, -0.2], pos: [-0.1, 0.35, 0.1], groupPos: [0, 0, 0], color: "#7cb342" }
  ]), []);
  return <GenericInstanced {...props} geometry={geo} />;
};
