"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type SceneProps = {
  reduced: boolean;
  mobile: boolean;
};

const pointer = new THREE.Vector2(0, 0);

/** Gentle bob and sway for the core, so it never sits perfectly still. */
function Float({ children, amount }: { children: React.ReactNode; amount: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.position.y = Math.sin(t * 1.1) * 0.12 * amount;
    g.rotation.x = Math.sin(t * 0.7) * 0.08 * amount;
    g.rotation.z = Math.cos(t * 0.5) * 0.06 * amount;
  });
  return <group ref={ref}>{children}</group>;
}

/** WebGL availability check so unsupported devices get the static backdrop. */
function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Deterministic pseudo-random in [0, 1) so the scene is stable across renders. */
function noise(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * "Aperture": an original object made of orbiting glass shards around a
 * luminous core, wrapped by two thin rings. It reads as a lens, an eye, and
 * a neural cluster at once. Mouse moves tilt the whole group; the camera
 * drifts slowly on its own.
 */
function Aperture({ reduced, mobile }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const shards = useRef<THREE.InstancedMesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);

  const count = mobile ? 26 : 54;

  const shardData = useMemo(() => {
    const items: Array<{ radius: number; angle: number; tilt: number; speed: number; scale: number; y: number }> = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      items.push({
        radius: 1.5 + Math.sin(t * Math.PI * 4) * 0.3 + noise(i, 1) * 0.3,
        angle: t * Math.PI * 2,
        tilt: (noise(i, 2) - 0.5) * 0.9,
        speed: 0.12 + noise(i, 3) * 0.18,
        scale: 0.045 + noise(i, 4) * 0.1,
        y: (noise(i, 5) - 0.5) * 0.9,
      });
    }
    return items;
  }, [count]);

  const dummy = useRef(new THREE.Object3D());
  const shardGeo = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);

  useEffect(() => {
    return () => shardGeo.dispose();
  }, [shardGeo]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const motion = reduced ? 0 : 1;

    if (group.current) {
      const targetX = pointer.y * 0.28 * motion;
      const targetY = pointer.x * 0.42 * motion;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.06);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.06);
    }

    const mesh = shards.current;
    if (mesh) {
      shardData.forEach((s, i) => {
        const a = s.angle + t * s.speed * motion;
        const d = dummy.current;
        d.position.set(
          Math.cos(a) * s.radius,
          s.y + Math.sin(a * 2 + s.tilt) * 0.18 * motion,
          Math.sin(a) * s.radius,
        );
        d.rotation.set(a * 1.3, a * 0.7, s.tilt);
        d.scale.setScalar(s.scale);
        d.updateMatrix();
        mesh.setMatrixAt(i, d.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }

    if (ringA.current) ringA.current.rotation.z += delta * 0.12 * motion;
    if (ringB.current) ringB.current.rotation.x += delta * 0.09 * motion;
    if (core.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.04 * motion;
      core.current.scale.setScalar(s);
    }

    // Slow camera drift: a gentle figure-eight so the scene never sits still.
    if (!reduced) {
      const cam = state.camera;
      cam.position.x = THREE.MathUtils.lerp(cam.position.x, Math.sin(t * 0.18) * 0.35, 0.02);
      cam.position.y = THREE.MathUtils.lerp(cam.position.y, Math.cos(t * 0.13) * 0.22, 0.02);
      cam.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={group} position={mobile ? [0, 1.15, 0] : [1.9, 0.1, 0]} scale={mobile ? 0.72 : 1}>
      <Float amount={reduced ? 0 : 1}>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.72, mobile ? 2 : 4]} />
          <meshPhysicalMaterial
            color="#0c1220"
            emissive="#8be9ff"
            emissiveIntensity={0.55}
            roughness={0.15}
            metalness={0.65}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        <mesh scale={1.08}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshBasicMaterial color="#8be9ff" wireframe transparent opacity={0.18} />
        </mesh>
      </Float>

      <instancedMesh ref={shards} args={[shardGeo, undefined, count]} frustumCulled={false}>
        <meshPhysicalMaterial
          color="#1b2233"
          roughness={0.08}
          metalness={0.55}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive="#c9a0ff"
          emissiveIntensity={0.22}
        />
      </instancedMesh>

      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.35, 0.006, 8, 160]} />
        <meshBasicMaterial color="#8be9ff" transparent opacity={0.55} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.7, 0.4, 0]}>
        <torusGeometry args={[2.75, 0.004, 8, 160]} />
        <meshBasicMaterial color="#c9a0ff" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#8be9ff" />
      <pointLight position={[-4, -2, 3]} intensity={26} color="#c9a0ff" />
      <pointLight position={[0, 4, -4]} intensity={18} color="#ffb86b" />
    </>
  );
}

/**
 * Canvas wrapper. Responsibilities: cap pixel ratio, pause rendering when
 * the hero is off-screen, listen for pointer moves, and pick a lighter
 * configuration on small screens.
 */
export default function HeroScene() {
  const reduced = useReducedMotion();
  const mobile = useMediaQuery("(max-width: 768px)");
  const [active, setActive] = useState(true);
  const [supported, setSupported] = useState<boolean | null>(null);
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setSupported(supportsWebGL()));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [supported]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  if (!supported) return null;

  return (
    <div ref={holder} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={active && !reduced ? "always" : reduced ? "demand" : "never"}
        dpr={[1, mobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 6.2], fov: 42, near: 0.1, far: 40 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <Lights />
        <Aperture reduced={reduced} mobile={mobile} />
      </Canvas>
    </div>
  );
}
