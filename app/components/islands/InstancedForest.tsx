'use client';

import React, { useMemo } from 'react';
import { bakeGeometry, GenericInstanced } from './InstancedShared';

// --- Instanced Forest Geometries ---

// Type 0: Classic Pine
export const InstancedPine = (props: any) => {
  const geo = useMemo(() => bakeGeometry([
    { type: 'Cylinder', args: [0.15, 0.25, 0.6, 6], pos: [0, 0.3, 0], color: "#4e342e" },
    { type: 'Cone', args: [0.7, 1.2, 7], pos: [0, 0.9, 0], color: "#2e7d32" },
    { type: 'Cone', args: [0.5, 1.0, 7], pos: [0, 1.4, 0], color: "#388e3c" }
  ]), []);
  return <GenericInstanced {...props} geometry={geo} />;
};

// Type 1: Round Oak
export const InstancedOak = (props: any) => {
  const geo = useMemo(() => bakeGeometry([
    { type: 'Cylinder', args: [0.15, 0.2, 0.8, 6], pos: [0, 0.4, 0], color: "#5d4037" },
    { type: 'Sphere', args: [0.7, 6, 6], pos: [0, 1.1, 0], scale: [1, 0.8, 1], color: "#43a047" },
    { type: 'Sphere', args: [0.5, 5, 5], pos: [0.4, 1.3, 0], scale: [1, 0.8, 1], color: "#4caf50" },
    { type: 'Sphere', args: [0.5, 5, 5], pos: [-0.3, 1.2, 0.3], scale: [1, 0.8, 1], color: "#388e3c" }
  ]), []);
  return <GenericInstanced {...props} geometry={geo} />;
};

// Type 2: Tall Redwood
export const InstancedRedwood = (props: any) => {
  const geo = useMemo(() => bakeGeometry([
    // Group scale was [1, 1.4, 1], so we pre-multiply Y positions and heights/scales
    { type: 'Cylinder', args: [0.2, 0.3, 1.5, 7], pos: [0, 0.75 * 1.4, 0], scale: [1, 1.4, 1], color: "#3e2723" },
    { type: 'Cone', args: [0.8, 2, 7], pos: [0, 2 * 1.4, 0], scale: [1, 1.4, 1], color: "#1b5e20" }
  ]), []);
  return <GenericInstanced {...props} geometry={geo} />;
};

// Type 3: Birch
export const InstancedBirch = (props: any) => {
  const geo = useMemo(() => bakeGeometry([
    { type: 'Cylinder', args: [0.1, 0.12, 1.2, 5], pos: [0, 0.6, 0], color: "#eeeeee" },
    // Black spots
    { type: 'Box', args: [0.11, 0.05, 0.11], pos: [0, 0.3, 0], rot: [0, 0.2, 0], color: "#212121" },
    { type: 'Box', args: [0.11, 0.05, 0.11], pos: [0, 0.8, 0], rot: [0, -0.5, 0], color: "#212121" },
    { type: 'Sphere', args: [0.6, 5, 5], pos: [0, 1.4, 0], scale: [1, 1.2, 1], color: "#66bb6a" }
  ]), []);
  return <GenericInstanced {...props} geometry={geo} />;
};

// Type 4: Low Bush
export const InstancedLowBush = (props: any) => {
  const geo = useMemo(() => bakeGeometry([
    // Group pos was [0, 0.2, 0]
    { type: 'Sphere', args: [0.4, 4, 4], pos: [0, 0, 0], groupPos: [0, 0.2, 0], color: "#7cb342" },
    { type: 'Sphere', args: [0.3, 4, 4], pos: [0.3, -0.1, 0], groupPos: [0, 0.2, 0], color: "#8bc34a" },
    { type: 'Sphere', args: [0.35, 4, 4], pos: [-0.2, 0.1, 0.2], groupPos: [0, 0.2, 0], color: "#689f38" }
  ]), []);
  return <GenericInstanced {...props} geometry={geo} />;
};

// Type 5: Ferns
export const InstancedFerns = (props: any) => {
  const geo = useMemo(() => bakeGeometry([
    // Group pos was [0, 0.1, 0]
    { type: 'Cone', args: [0.3, 0.6, 3], rot: [0.2, 0, 0], pos: [0, 0, 0.1], groupPos: [0, 0.1, 0], color: "#558b2f" },
    { type: 'Cone', args: [0.3, 0.6, 3], rot: [-0.2, 2, 0], pos: [0.1, 0, -0.1], groupPos: [0, 0.1, 0], color: "#558b2f" },
    { type: 'Cone', args: [0.25, 0.5, 3], rot: [0.1, 4, 0], pos: [-0.1, 0, 0], groupPos: [0, 0.1, 0], color: "#689f38" }
  ]), []);
  return <GenericInstanced {...props} geometry={geo} />;
};
