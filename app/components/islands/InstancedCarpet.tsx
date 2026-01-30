'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Geometry Construction ---

// Helper to bake the 3 cones of the ShortGrassTuft into a single geometry with vertex colors
const createGrassTuftGeometry = () => {
  const configs = [
    { args: [0.03, 0.3, 3], pos: [0.02, 0, 0.02], rot: [0.1, 0.5, 0.1], color: "#aed581" },
    { args: [0.03, 0.25, 3], pos: [-0.02, 0, -0.01], rot: [-0.1, 0.2, -0.1], color: "#9ccc65" },
    { args: [0.03, 0.2, 3], pos: [0, 0, 0.03], rot: [0.2, 1, 0], color: "#8bc34a" }
  ];

  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  let indexOffset = 0;

  const vector = new THREE.Vector3();
  const axis = new THREE.Vector3();
  const colorObj = new THREE.Color();

  configs.forEach((config) => {
    // @ts-ignore
    const geo = new THREE.ConeGeometry(...config.args);
    
    // Apply transforms physically to the attributes
    // 1. Rotation
    const rotX = new THREE.Matrix4().makeRotationX(config.rot[0]);
    const rotY = new THREE.Matrix4().makeRotationY(config.rot[1]);
    const rotZ = new THREE.Matrix4().makeRotationZ(config.rot[2]);
    const matrix = new THREE.Matrix4().multiply(rotX).multiply(rotY).multiply(rotZ);
    
    // 2. Position (plus the group offset of 0.05 from original component)
    const offset = new THREE.Vector3(config.pos[0], config.pos[1] + 0.05, config.pos[2]);

    colorObj.set(config.color);

    const posAttr = geo.attributes.position;
    const normAttr = geo.attributes.normal;
    const indexAttr = geo.index;

    for (let i = 0; i < posAttr.count; i++) {
      // Transform Position
      vector.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      vector.applyMatrix4(matrix).add(offset);
      positions.push(vector.x, vector.y, vector.z);

      // Transform Normal
      vector.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
      vector.applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(matrix));
      normals.push(vector.x, vector.y, vector.z);

      // Color
      colors.push(colorObj.r, colorObj.g, colorObj.b);
    }

    if (indexAttr) {
      for (let i = 0; i < indexAttr.count; i++) {
        indices.push(indexAttr.getX(i) + indexOffset);
      }
    }
    
    indexOffset += posAttr.count;
  });

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  merged.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  merged.setIndex(indices);

  return merged;
};

interface InstancedCarpetProps {
  items: Array<{
    position: [number, number, number];
    rotation: number;
    scale: number;
    threshold: number;
  }>;
  health: number;
}

export const InstancedCarpet = ({ items, health }: InstancedCarpetProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => createGrassTuftGeometry(), []);
  
  // We keep track of the current visual scale for each item to handle smooth transitions
  // Float32Array is efficient for this
  const currentScales = useRef(new Float32Array(items.length).fill(0));
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initial Setup
  useEffect(() => {
    if (meshRef.current) {
      // Initialize matrices once to set positions/rotations
      items.forEach((item, i) => {
        dummy.position.set(...item.position);
        dummy.rotation.set(0, item.rotation, 0);
        dummy.scale.set(0, 0, 0); // Start hidden
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [items, dummy]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    let needsUpdate = false;
    const lerpSpeed = 4 * delta;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // Determine target scale based on health
      const targetScale = health > item.threshold ? item.scale : 0;
      
      const current = currentScales.current[i];
      
      // Optimization: Only update if not converged
      if (Math.abs(current - targetScale) > 0.001) {
        // Lerp
        const next = THREE.MathUtils.lerp(current, targetScale, lerpSpeed);
        currentScales.current[i] = next;

        // Apply to matrix
        dummy.position.set(...item.position);
        dummy.rotation.set(0, item.rotation, 0);
        dummy.scale.set(next, next, next);
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, items.length]}
      frustumCulled={true}
    >
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
    </instancedMesh>
  );
};
