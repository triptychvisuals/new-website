"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import PlaceholderObject from "./PlaceholderObject";

/**
 * Persistent, full-viewport WebGL layer that sits behind the DOM content.
 *
 * Lives in the root layout so the canvas survives across the whole single-page
 * experience. Scroll-driven camera/object moves will be wired here per-section
 * as we replicate each reference recording.
 */
export default function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* EDIT: lighting rig — swap for drei <Environment> once you pick an HDRI */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={2.2} />
          <pointLight position={[-5, -3, -2]} intensity={25} color="#ff4d6d" />
          <PlaceholderObject />
        </Suspense>
      </Canvas>
    </div>
  );
}
