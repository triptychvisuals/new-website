import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef } from "react"
import * as THREE from "three"

/**
 * MouseTilt3DLogo — a Framer code component.
 *
 * A 3D placeholder logo that tilts toward the cursor and eases back to center
 * when the cursor is still. Built on vanilla Three.js (no React Three Fiber)
 * so it runs reliably inside Framer's runtime.
 *
 * Swap the placeholder geometry for a real GLB later — see loadLogo() below.
 */
export default function MouseTilt3DLogo(props) {
    const {
        shape,
        color,
        metalness,
        roughness,
        background,
        maxTiltDeg, // EDIT: how far the logo can lean toward the cursor
        responsiveness, // EDIT: easing speed toward the target tilt (0..1)
        returnToCenter, // EDIT: ease back to flat when the cursor is idle
        idleSpin, // EDIT: gentle continuous spin when idle
        idleSpinSpeed,
    } = props

    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const mount = mountRef.current
        if (!mount) return

        // ---- Renderer ---------------------------------------------------
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        mount.appendChild(renderer.domElement)
        renderer.domElement.style.width = "100%"
        renderer.domElement.style.height = "100%"
        renderer.domElement.style.display = "block"

        // ---- Scene + Camera ---------------------------------------------
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
        camera.position.set(0, 0, 5)

        // ---- Lighting ---------------------------------------------------
        const key = new THREE.DirectionalLight(0xffffff, 2.4)
        key.position.set(3, 4, 5)
        scene.add(key)

        const rim = new THREE.DirectionalLight(0x88aaff, 1.2)
        rim.position.set(-4, -2, -3)
        scene.add(rim)

        scene.add(new THREE.AmbientLight(0xffffff, 0.6))

        // ---- The logo (placeholder) -------------------------------------
        // Replace this block with a GLB loader when the real asset arrives:
        //   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
        //   new GLTFLoader().load(url, (g) => logo.add(g.scene))
        const logo = new THREE.Group()
        scene.add(logo)

        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            metalness,
            roughness,
        })

        let geometry: THREE.BufferGeometry
        switch (shape) {
            case "torusKnot":
                geometry = new THREE.TorusKnotGeometry(0.9, 0.3, 160, 24)
                break
            case "icosahedron":
                geometry = new THREE.IcosahedronGeometry(1.3, 0)
                break
            case "torus":
                geometry = new THREE.TorusGeometry(1, 0.4, 24, 80)
                break
            case "box":
            default:
                geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6)
                break
        }
        logo.add(new THREE.Mesh(geometry, material))

        // ---- Resize handling --------------------------------------------
        const resize = () => {
            const w = mount.clientWidth || 1
            const h = mount.clientHeight || 1
            renderer.setSize(w, h, false)
            camera.aspect = w / h
            camera.updateProjectionMatrix()
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(mount)

        // ---- Pointer tracking -------------------------------------------
        // Normalized cursor offset from viewport center, range roughly -1..1.
        const target = { x: 0, y: 0 }
        let lastMove = performance.now()

        const onPointerMove = (e: PointerEvent) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1
            const ny = (e.clientY / window.innerHeight) * 2 - 1
            const max = THREE.MathUtils.degToRad(maxTiltDeg)
            // Cursor right -> rotate around Y; cursor down -> rotate around X.
            target.y = nx * max
            target.x = ny * max
            lastMove = performance.now()
        }
        window.addEventListener("pointermove", onPointerMove)

        // ---- Animation loop ---------------------------------------------
        let raf = 0
        const tmp = { x: 0, y: 0 }
        const clock = new THREE.Clock()

        const tick = () => {
            const dt = clock.getDelta()
            const idle = performance.now() - lastMove > 400

            // Frame-rate independent easing toward the target.
            const ease = 1 - Math.pow(1 - responsiveness, dt * 60)

            if (idle && returnToCenter) {
                tmp.x = 0
                tmp.y = 0
            } else {
                tmp.x = target.x
                tmp.y = target.y
            }

            logo.rotation.x += (tmp.x - logo.rotation.x) * ease
            logo.rotation.y += (tmp.y - logo.rotation.y) * ease

            if (idle && idleSpin) {
                logo.rotation.y += idleSpinSpeed * dt
            }

            renderer.render(scene, camera)
            raf = requestAnimationFrame(tick)
        }
        tick()

        // ---- Cleanup ----------------------------------------------------
        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            window.removeEventListener("pointermove", onPointerMove)
            geometry.dispose()
            material.dispose()
            renderer.dispose()
            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement)
            }
        }
    }, [
        shape,
        color,
        metalness,
        roughness,
        maxTiltDeg,
        responsiveness,
        returnToCenter,
        idleSpin,
        idleSpinSpeed,
    ])

    return (
        <div
            ref={mountRef}
            style={{
                width: "100%",
                height: "100%",
                background,
                overflow: "hidden",
                cursor: "default",
            }}
        />
    )
}

// Sensible defaults so it looks right the moment it's dropped on the canvas.
MouseTilt3DLogo.defaultProps = {
    width: 400,
    height: 400,
    shape: "box",
    color: "#e7e7e7",
    metalness: 0.9,
    roughness: 0.25,
    background: "transparent",
    maxTiltDeg: 35,
    responsiveness: 0.12,
    returnToCenter: true,
    idleSpin: false,
    idleSpinSpeed: 0.3,
}

addPropertyControls(MouseTilt3DLogo, {
    shape: {
        type: ControlType.Enum,
        title: "Shape",
        options: ["box", "icosahedron", "torus", "torusKnot"],
        optionTitles: ["Cube", "Icosahedron", "Torus", "Torus Knot"],
    },
    color: { type: ControlType.Color, title: "Color" },
    metalness: {
        type: ControlType.Number,
        title: "Metalness",
        min: 0,
        max: 1,
        step: 0.01,
    },
    roughness: {
        type: ControlType.Number,
        title: "Roughness",
        min: 0,
        max: 1,
        step: 0.01,
    },
    background: { type: ControlType.Color, title: "Background" },
    maxTiltDeg: {
        type: ControlType.Number,
        title: "Max Tilt",
        min: 0,
        max: 90,
        step: 1,
        unit: "°",
    },
    responsiveness: {
        type: ControlType.Number,
        title: "Responsiveness",
        min: 0.01,
        max: 1,
        step: 0.01,
    },
    returnToCenter: { type: ControlType.Boolean, title: "Recenter" },
    idleSpin: { type: ControlType.Boolean, title: "Idle Spin" },
    idleSpinSpeed: {
        type: ControlType.Number,
        title: "Spin Speed",
        min: 0,
        max: 3,
        step: 0.05,
        hidden: (p) => !p.idleSpin,
    },
})
