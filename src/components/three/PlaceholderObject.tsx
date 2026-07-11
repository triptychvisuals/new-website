"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

/**
 * Placeholder 3D object — a slowly rotating, gently distorting icosahedron.
 *
 * EDIT: When you supply a GLB, replace the <mesh> below with a loaded model:
 *   const { scene } = useGLTF("/models/your-model.glb");
 *   return <primitive object={scene} />;
 */
export default function PlaceholderObject() {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.15;
    mesh.current.rotation.x += delta * 0.05;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.2, 8]} />
        <MeshDistortMaterial
          color="#6366f1" // EDIT: brand color
          roughness={0.15}
          metalness={0.4}
          distort={0.35}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}
