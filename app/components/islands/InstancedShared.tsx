'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Shared Geometry Builder ---

export const bakeGeometry = (configs: any[]) => {
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  let indexOffset = 0;

  const vector = new THREE.Vector3();
  const colorObj = new THREE.Color();

  configs.forEach((config) => {
    let geo;
    if (config.type === 'Cone') geo = new THREE.ConeGeometry(...(config.args as [number, number, number]));
    else if (config.type === 'Cylinder') geo = new THREE.CylinderGeometry(...(config.args as [number, number, number, number]));
    else if (config.type === 'Sphere') geo = new THREE.SphereGeometry(...(config.args as [number, number, number]));
    else if (config.type === 'Box') geo = new THREE.BoxGeometry(...(config.args as [number, number, number]));
    else return;

    // Transforms
    const scaleMatrix = new THREE.Matrix4().makeScale(...((config.scale || [1, 1, 1]) as [number, number, number]));
    
    const rotX = new THREE.Matrix4().makeRotationX(config.rot ? config.rot[0] : 0);
    const rotY = new THREE.Matrix4().makeRotationY(config.rot ? config.rot[1] : 0);
    const rotZ = new THREE.Matrix4().makeRotationZ(config.rot ? config.rot[2] : 0);
    const rotMatrix = new THREE.Matrix4().multiply(rotX).multiply(rotY).multiply(rotZ);
    
    const matrix = new THREE.Matrix4().multiply(rotMatrix).multiply(scaleMatrix);
    
    // Group Offset + Element Position
    // The "Group Offset" is the parent group's position in the original component
    const groupOffset = config.groupPos ? new THREE.Vector3(...(config.groupPos as [number, number, number])) : new THREE.Vector3(0, 0, 0);
    const elementPos = config.pos ? new THREE.Vector3(...(config.pos as [number, number, number])) : new THREE.Vector3(0, 0, 0);
    const finalPos = elementPos.add(groupOffset);

    colorObj.set(config.color);

    const posAttr = geo.attributes.position;
    const normAttr = geo.attributes.normal;
    const indexAttr = geo.index;

    for (let i = 0; i < posAttr.count; i++) {
      vector.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      vector.applyMatrix4(matrix).add(finalPos);
      positions.push(vector.x, vector.y, vector.z);

      vector.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);
      vector.applyNormalMatrix(normalMatrix).normalize();
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

// --- Generic Instanced Component ---

export const GenericInstanced = ({ items, health, geometry, swayParams }: { items: any[], health: number, geometry: THREE.BufferGeometry, swayParams?: { speed: number, intensity: number } }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const currentScales = useRef(new Float32Array(items.length).fill(0));
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Random offset for sway to prevent uniform movement if we were to implement per-instance logic,
  // but for high performance instanced sway we usually do it in vertex shader.
  // Here we will just do static placement updates for scale.
  // Implementing swaying in JS for 1000 instances is heavy. 
  // We will skip sway for instanced items for now to prioritize FPS.

  useEffect(() => {
    if (meshRef.current) {
      items.forEach((item, i) => {
        dummy.position.set(...(item.position as [number, number, number]));
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
    
    // We only update if scales are changing (growing/shrinking)
    // Once grown, we stop updating to save CPU.
    let activeUpdates = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const targetScale = health > item.threshold ? item.scale : 0;
      const current = currentScales.current[i];
      
      if (Math.abs(current - targetScale) > 0.001) {
        const next = THREE.MathUtils.lerp(current, targetScale, lerpSpeed);
        currentScales.current[i] = next;
        dummy.position.set(...(item.position as [number, number, number]));
        dummy.rotation.set(0, item.rotation, 0);
        dummy.scale.set(next, next, next);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
        activeUpdates++;
      }
    }
    
    if (needsUpdate) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, items.length]} frustumCulled={true}>
      <meshStandardMaterial vertexColors flatShading side={THREE.DoubleSide} />
    </instancedMesh>
  );
};
