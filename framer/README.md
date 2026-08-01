# MouseTilt3DLogo — Framer code component

A 3D placeholder logo that tilts toward the cursor and eases back to center when
the cursor is idle. Vanilla Three.js (no React Three Fiber) for reliability
inside Framer's runtime.

## How to add it to Framer

1. In your Framer project, open the **Assets** panel → **Code** → **New** →
   **New Code File**.
2. Name it `MouseTilt3DLogo` and paste the contents of
   `MouseTilt3DLogo.tsx`.
3. Framer auto-installs the `three` import on save. Drag the component onto the
   canvas.

## Property controls

| Control          | What it does                                              |
| ---------------- | -------------------------------------------------------- |
| Shape            | Placeholder geometry: Cube / Icosahedron / Torus / Knot  |
| Color            | Material base color                                       |
| Metalness        | 0 = matte plastic, 1 = chrome                             |
| Roughness        | Surface blur of reflections                              |
| Background       | Component background (set transparent to layer over art) |
| Max Tilt         | How far the logo leans toward the cursor (degrees)       |
| Responsiveness   | Easing speed toward the target tilt (higher = snappier)  |
| Recenter         | Ease back to flat when the cursor is idle                |
| Idle Spin        | Gentle continuous spin when the cursor is idle           |
| Spin Speed       | Speed of the idle spin                                    |

## Swapping in a real logo (GLB)

Replace the placeholder geometry block (marked in the source) with a loader:

```ts
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

new GLTFLoader().load(modelUrl, (gltf) => {
    logo.add(gltf.scene)
})
```

The mouse-tilt logic already drives the `logo` group, so the real model will
inherit the same behavior. Add a `modelUrl` property control of
`ControlType.File` (or `ControlType.String`) to expose the asset slot in Framer.
