"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Center,
  Environment,
  Html,
  OrbitControls,
  useAnimations,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { Box3, LoopRepeat, MeshPhysicalMaterial, Vector3 } from "three";
import type { Group } from "three";

const DEFAULT_MODEL = "/models/product.glb";

// Pre-defined Materials matching the spline design system
const glassMat = new MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.05,
  roughness: 0.1,
  transmission: 0.9,
  thickness: 1.0,
  ior: 1.45,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  reflectivity: 1.0,
  transparent: true,
});

const iridescentMat = new MeshPhysicalMaterial({
  color: 0x8b5cf6,
  metalness: 0.8,
  roughness: 0.2,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  transmission: 0.2,
  thickness: 0.5,
  ior: 1.6,
  reflectivity: 0.8,
});

const lightPresets = {
  studio: {
    ambient: { color: "#ffffff", intensity: 0.6 },
    key: { color: "#ffffff", intensity: 1.5, position: [4, 6, 4] as [number, number, number] },
    fill: { color: "#8b5cf6", intensity: 0.8, position: [-4, 2, -3] as [number, number, number] },
    rim: { color: "#06b6d4", intensity: 0.5, position: [0, -2, 2] as [number, number, number] },
  },
  cyber: {
    ambient: { color: "#1a0933", intensity: 0.3 },
    key: { color: "#ff007f", intensity: 2.8, position: [4, 6, 4] as [number, number, number] },
    fill: { color: "#00f0ff", intensity: 2.2, position: [-4, 2, -3] as [number, number, number] },
    rim: { color: "#8b5cf6", intensity: 1.8, position: [0, -2, 2] as [number, number, number] },
  },
  sunset: {
    ambient: { color: "#331a0d", intensity: 0.4 },
    key: { color: "#ff7b00", intensity: 3.0, position: [4, 6, 4] as [number, number, number] },
    fill: { color: "#ff0055", intensity: 1.8, position: [-4, 2, -3] as [number, number, number] },
    rim: { color: "#ffd700", intensity: 1.5, position: [0, -2, 2] as [number, number, number] },
  },
};

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-9 w-9">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-violet-400/80" />
        </div>
      </div>
    </Html>
  );
}

function ModelMesh({
  clonedScene,
  animations,
  scale,
  autoRotateSpeed,
  material,
}: {
  clonedScene: Group;
  animations: any;
  scale: number;
  autoRotateSpeed: number;
  material: "original" | "glass" | "iridescent";
}) {
  const outerRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const { actions, names } = useAnimations(animations, modelRef);

  useEffect(() => {
    if (names.length === 0) return;
    names.forEach((name) => {
      const action = actions[name];
      if (!action) return;
      action.reset();
      action.setLoop(LoopRepeat, Infinity);
      action.clampWhenFinished = false;
      action.fadeIn(0.3).play();
    });
    return () => { names.forEach((name) => actions[name]?.stop()); };
  }, [actions, names]);

  useEffect(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }
        if (material === "glass") {
          child.material = glassMat;
        } else if (material === "iridescent") {
          child.material = iridescentMat;
        } else {
          child.material = child.userData.originalMaterial;
        }
      }
    });
  }, [clonedScene, material]);

  useFrame((_, delta) => {
    if (outerRef.current && autoRotateSpeed > 0) {
      outerRef.current.rotation.y += delta * autoRotateSpeed;
    }
  });

  return (
    <group ref={outerRef} scale={scale}>
      <Center>
        <group ref={modelRef}>
          <primitive object={clonedScene} />
        </group>
      </Center>
    </group>
  );
}

function ProceduralMesh({
  geometry,
  material,
  autoRotateSpeed,
}: {
  geometry: "torus" | "sphere";
  material: "original" | "glass" | "iridescent";
  autoRotateSpeed: number;
}) {
  const meshRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (meshRef.current && autoRotateSpeed > 0) {
      meshRef.current.rotation.y += delta * autoRotateSpeed;
      meshRef.current.rotation.x += delta * (autoRotateSpeed * 0.4);
    }
  });

  const activeMaterial =
    material === "glass"
      ? glassMat
      : material === "iridescent"
      ? iridescentMat
      : glassMat;

  return (
    <mesh ref={meshRef} material={activeMaterial}>
      {geometry === "torus" ? (
        <torusKnotGeometry args={[0.95, 0.3, 150, 16]} />
      ) : (
        <sphereGeometry args={[1.15, 48, 48]} />
      )}
    </mesh>
  );
}

function ScaledModel({
  modelPath,
  autoRotateSpeed,
  targetSize,
  geometry,
  material,
}: {
  modelPath: string;
  autoRotateSpeed: number;
  targetSize: number;
  geometry: "original" | "torus" | "sphere";
  material: "original" | "glass" | "iridescent";
}) {
  const { scene, animations } = useGLTF(modelPath);

  // Compute scale based on a clean, cloned scene to ensure no dirty matrices or parent transformations affect it.
  const scale = useMemo(() => {
    const clone = scene.clone();
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? targetSize / maxDim : 1;
  }, [scene, targetSize]);

  // Clone the scene for rendering and material manipulation to keep the cached scene pristine
  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);

  return (
    <>
      {geometry === "original" ? (
        <ModelMesh
          key={modelPath}
          clonedScene={clonedScene}
          animations={animations}
          scale={scale}
          autoRotateSpeed={autoRotateSpeed}
          material={material}
        />
      ) : (
        <ProceduralMesh
          geometry={geometry}
          material={material}
          autoRotateSpeed={autoRotateSpeed}
        />
      )}
    </>
  );
}

function CameraController({
  modelPath,
  controlsRef,
}: {
  modelPath: string;
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    // Reset camera position and target
    camera.position.set(0, 0.15, 5.2);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [modelPath, camera, controlsRef]);

  return null;
}

type ProductViewerProps = {
  modelPath?: string;
  className?: string;
  autoRotateSpeed?: number;
  targetSize?: number;
  geometry?: "original" | "torus" | "sphere";
  material?: "original" | "glass" | "iridescent";
  lighting?: "studio" | "cyber" | "sunset";
};

export function ProductViewer({
  modelPath = DEFAULT_MODEL,
  className = "",
  autoRotateSpeed = 0.18,
  targetSize = 3.0,
  geometry = "original",
  material = "original",
  lighting = "studio",
}: ProductViewerProps) {
  const lights = lightPresets[lighting] || lightPresets.studio;
  const activeModelPath =
    geometry === "torus"
      ? "/models/canvas_shoe.glb"
      : geometry === "sphere"
      ? "/models/modern_arm_chair.glb"
      : modelPath;

  const controlsRef = useRef<any>(null);

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0.15, 5.2], fov: 38, near: 0.01, far: 200 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={lights.ambient.intensity} color={lights.ambient.color} />
        <directionalLight position={lights.key.position} intensity={lights.key.intensity} color={lights.key.color} />
        <directionalLight position={lights.fill.position} intensity={lights.fill.intensity} color={lights.fill.color} />
        <pointLight position={lights.rim.position} intensity={lights.rim.intensity} color={lights.rim.color} />

        <Suspense fallback={<Loader />}>
          <ScaledModel
            modelPath={activeModelPath}
            autoRotateSpeed={autoRotateSpeed}
            targetSize={targetSize}
            geometry="original"
            material={material}
          />
          <Environment files="/pav_studio_03_1k.hdr" environmentIntensity={0.35} background={false} />
        </Suspense>

        <CameraController modelPath={activeModelPath} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.45}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.55}
        />
      </Canvas>
    </div>
  );
}
