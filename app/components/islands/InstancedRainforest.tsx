'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Shared Geometry Builder ---

const bakeGeometry = (configs: any[]) => {
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

const GenericInstanced = ({ items, health, geometry }: { items: any[], health: number, geometry: THREE.BufferGeometry }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const currentScales = useRef(new Float32Array(items.length).fill(0));
  const dummy = useMemo(() => new THREE.Object3D(), []);

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
