'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Geometry Construction ---

const createHeatherGeometry = () => {
  const configs = [
    // Base brown sphere
    { type: 'Sphere', args: [0.35, 4, 4], scale: [1, 0.7, 1], pos: [0, 0, 0], color: "#5d4037" },
    // Green highlight 1
    { type: 'Sphere', args: [0.25, 4, 4], scale: [1, 0.7, 1], pos: [0.15, 0.25, 0], color: "#388e3c" },
    // Green highlight 2
    { type: 'Sphere', args: [0.2, 4, 4], scale: [1, 0.7, 1], pos: [-0.15, 0.2, 0.15], color: "#689f38" }
  ];

  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  let indexOffset = 0;

  const vector = new THREE.Vector3();
  const colorObj = new THREE.Color();

  configs.forEach((config) => {
    // @ts-ignore
    const geo = new THREE.SphereGeometry(...config.args);
    
    // Apply Scale
    const scaleMatrix = new THREE.Matrix4().makeScale(...config.scale as [number, number, number]);
    
    // Apply Position offset (relative to group center)
    // Note: The original component puts the group at [0, 0.2, 0]. 
    // We will bake this vertical offset into the geometry so the instance position corresponds to the ground point.
    const finalPos = new THREE.Vector3(...config.pos).add(new THREE.Vector3(0, 0.2, 0));
    
    colorObj.set(config.color);

    const posAttr = geo.attributes.position;
    const normAttr = geo.attributes.normal;
    const indexAttr = geo.index;

    for (let i = 0; i < posAttr.count; i++) {
      // Position
      vector.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      vector.applyMatrix4(scaleMatrix).add(finalPos);
      positions.push(vector.x, vector.y, vector.z);

      // Normal
      vector.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
      // Normal matrix for non-uniform scale is inverse transpose of model matrix
      // Simpler approximation for just scale/translation:
      // If scale is non-uniform, normals need special care. 
      // For low poly flat shading, we can mostly get away with applying normal matrix of scale.
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(scaleMatrix);
      vector.applyNormalMatrix(normalMatrix).normalize();
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

interface InstancedHeatherProps {
  items: Array<{
    position: [number, number, number];
    rotation: number;
    scale: number;
    threshold: number;
  }>;
  health: number;
}

export const InstancedHeather = ({ items, health }: InstancedHeatherProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => createHeatherGeometry(), []);
  
  const currentScales = useRef(new Float32Array(items.length).fill(0));
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (meshRef.current) {
      items.forEach((item, i) => {
        dummy.position.set(...item.position);
        dummy.rotation.set(0, item.rotation, 0);
        dummy.scale.set(0, 0, 0);
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
      const targetScale = health > item.threshold ? item.scale : 0;
      const current = currentScales.current[i];
      
      if (Math.abs(current - targetScale) > 0.001) {
        const next = THREE.MathUtils.lerp(current, targetScale, lerpSpeed);
        currentScales.current[i] = next;

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
      <meshStandardMaterial vertexColors flatShading />
    </instancedMesh>
  );
};
