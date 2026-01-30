'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Geometry Construction ---

const createSedgeGeometry = () => {
  const configs = [
    { args: [0.04, 0.6, 3], pos: [0, 0.3, 0], rot: [0.1, 0, 0], color: "#827717" },
    { args: [0.04, 0.5, 3], pos: [0.05, 0.25, 0.05], rot: [-0.1, 0.2, 0.2], color: "#9e9d24" },
    { args: [0.04, 0.7, 3], pos: [-0.05, 0.35, -0.05], rot: [0.05, -0.2, -0.1], color: "#afb42b" }
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
    const geo = new THREE.ConeGeometry(...config.args);
    
    const rotX = new THREE.Matrix4().makeRotationX(config.rot[0]);
    const rotY = new THREE.Matrix4().makeRotationY(config.rot[1]);
    const rotZ = new THREE.Matrix4().makeRotationZ(config.rot[2]);
    const matrix = new THREE.Matrix4().multiply(rotX).multiply(rotY).multiply(rotZ);
    
    // Offset for group position (0,0,0) in original component, but cones have specific pos
    const offset = new THREE.Vector3(...config.pos);

    colorObj.set(config.color);

    const posAttr = geo.attributes.position;
    const normAttr = geo.attributes.normal;
    const indexAttr = geo.index;

    for (let i = 0; i < posAttr.count; i++) {
      vector.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      vector.applyMatrix4(matrix).add(offset);
      positions.push(vector.x, vector.y, vector.z);

      vector.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
      vector.applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(matrix));
      normals.push(vector.x, vector.y, vector.z);

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

interface InstancedSedgeProps {
  items: Array<{
    position: [number, number, number];
    rotation: number;
    scale: number;
    threshold: number;
  }>;
  health: number;
}

export const InstancedSedge = ({ items, health }: InstancedSedgeProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => createSedgeGeometry(), []);
  
  const currentScales = useRef(new Float32Array(items.length).fill(0));
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initial Setup
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
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
    </instancedMesh>
  );
};
