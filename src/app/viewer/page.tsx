"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Navbar } from "@/components/Navbar";

// Premium Custom Shaders/Materials matching the StreamStellar design system
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.05,
  roughness: 0.1,
  transmission: 0.9,
  thickness: 1.2,
  ior: 1.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  reflectivity: 1.0,
  transparent: true,
  opacity: 0.9,
});

const iridescentMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x8b5cf6, // base violet
  metalness: 0.95,
  roughness: 0.15,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  transmission: 0.1,
  thickness: 0.5,
  ior: 1.8,
  reflectivity: 1.0,
});

const glowingWireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x8b5cf6, // StreamStellar Violet
  wireframe: true,
  transparent: true,
  opacity: 0.65,
});

const hdriPresets = {
  pav_studio: {
    name: "Pav Studio",
    file: "/pav_studio_03_1k.hdr",
    intensity: 0.85,
  },
  wooden_studio_17: {
    name: "Wooden Studio 17",
    file: "/wooden_studio_17_1k.hdr",
    intensity: 0.85,
  },
  wooden_studio_19: {
    name: "Wooden Studio 19",
    file: "/wooden_studio_19_1k.hdr",
    intensity: 0.85,
  },
  amazon_neutral: {
    name: "Amazon Neutral",
    file: "/Amazon_Neutral_IBL.hdr",
    intensity: 0.85,
  },
};

// 3D Canvas Sub-component
function ModelRenderer({
  gltf,
  materialOverride,
  hdriPreset,
  autoRotate,
  autoRotateSpeed,
  showGrid,
  showAxes,
  bgBlur,
  activeAnimIndex,
  animPlaying,
  animSpeed,
  controlsRef,
}: {
  gltf: any;
  materialOverride: "original" | "wireframe" | "glass" | "iridescent";
  hdriPreset: "pav_studio" | "wooden_studio_17" | "wooden_studio_19" | "amazon_neutral";
  autoRotate: boolean;
  autoRotateSpeed: number;
  showGrid: boolean;
  showAxes: boolean;
  bgBlur: number;
  activeAnimIndex: number;
  animPlaying: boolean;
  animSpeed: number;
  controlsRef: any;
}) {
  const outerGroupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);
  const [scale, setScale] = useState(1);
  const [gridY, setGridY] = useState(-1.1);

  // Auto-scale to fit target size of ~2.2 units and adjust grid floor Y position
  useEffect(() => {
    if (!gltf) return;
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scaleFactor = 2.2 / maxDim;
      setScale(scaleFactor);
      setGridY(-(size.y * scaleFactor) / 2 - 0.005); // slightly below bottom to avoid z-fighting
    } else {
      setScale(1);
      setGridY(-1.1);
    }
  }, [gltf]);

  // Apply Material Overrides
  useEffect(() => {
    if (!gltf) return;
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        // Save original material reference on first load
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }

        if (materialOverride === "glass") {
          child.material = glassMaterial;
        } else if (materialOverride === "iridescent") {
          child.material = iridescentMaterial;
        } else if (materialOverride === "wireframe") {
          child.material = glowingWireframeMaterial;
        } else {
          child.material = child.userData.originalMaterial;
        }
      }
    });
  }, [gltf, materialOverride]);

  // Handle Animation Mixing
  useEffect(() => {
    if (!gltf) return;

    if (gltf.animations && gltf.animations.length > 0 && activeAnimIndex !== -1) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      mixerRef.current = mixer;

      const clip = gltf.animations[activeAnimIndex];
      const action = mixer.clipAction(clip);
      activeActionRef.current = action;

      if (animPlaying) {
        action.play();
      }

      return () => {
        mixer.stopAllAction();
        mixerRef.current = null;
        activeActionRef.current = null;
      };
    }
  }, [gltf, activeAnimIndex, animPlaying]);

  // Handle Play/Pause and Speed
  useEffect(() => {
    if (activeActionRef.current) {
      activeActionRef.current.paused = !animPlaying;
      activeActionRef.current.setEffectiveTimeScale(animSpeed);
    }
  }, [animPlaying, animSpeed]);

  // Animation and Rotation Loops
  useFrame((_, delta) => {
    if (mixerRef.current && animPlaying) {
      mixerRef.current.update(delta);
    }
    if (outerGroupRef.current && autoRotate) {
      outerGroupRef.current.rotation.y += delta * autoRotateSpeed * 0.2;
    }
  });

  const hdri = hdriPresets[hdriPreset] || hdriPresets.pav_studio;

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, 3, -4]} intensity={0.4} color="#ffffff" />

      <Environment files={hdri.file} environmentIntensity={hdri.intensity} background={true} blur={bgBlur} />

      {showGrid && <gridHelper args={[20, 20, "#444444", "#222222"]} position={[0, gridY, 0]} />}
      {showAxes && <axesHelper args={[5]} />}

      <Center>
        <group ref={outerGroupRef} scale={scale}>
          <primitive object={gltf.scene} />
        </group>
      </Center>

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={true}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.6}
        maxDistance={50}
        minDistance={0.5}
      />
    </>
  );
}

export default function GLBViewerPage() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // File & Model state
  const [file, setFile] = useState<File | null>(null);
  const [gltf, setGltf] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<{
    name: string;
    size: string;
    vertices: string;
    polygons: string;
    meshes: number;
    animationsCount: number;
  } | null>(null);

  // Inspector UI settings
  const [materialOverride, setMaterialOverride] = useState<"original" | "wireframe" | "glass" | "iridescent">("original");
  const [hdriPreset, setHdriPreset] = useState<"pav_studio" | "wooden_studio_17" | "wooden_studio_19" | "amazon_neutral">("pav_studio");
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(0.8);
  const [showGrid, setShowGrid] = useState(false);
  const [showAxes, setShowAxes] = useState(false);
  const [bgBlur, setBgBlur] = useState(0.5);
  const [activeAnimIndex, setActiveAnimIndex] = useState(-1);
  const [animPlaying, setAnimPlaying] = useState(true);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(min-width: 768px)");
      setIsDesktop(media.matches);
      const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  // Dispose of loaded model geometries/materials to prevent memory leaks
  useEffect(() => {
    return () => {
      if (gltf) {
        gltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: any) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [gltf]);

  const loadModelFile = (file: File) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setGltf(null);
    setTelemetry(null);

    const url = URL.createObjectURL(file);
    const loader = new GLTFLoader();

    loader.load(
      url,
      (loadedGltf) => {
        let vertices = 0;
        let polygons = 0;
        let meshes = 0;

        loadedGltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            meshes++;
            const geometry = child.geometry;
            if (geometry) {
              const position = geometry.attributes.position;
              if (position) {
                vertices += position.count;
                if (geometry.index) {
                  polygons += geometry.index.count / 3;
                } else {
                  polygons += position.count / 3;
                }
              }
            }
          }
        });

        setTelemetry({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          vertices: vertices.toLocaleString(),
          polygons: Math.round(polygons).toLocaleString(),
          meshes,
          animationsCount: loadedGltf.animations?.length || 0,
        });

        setGltf(loadedGltf);
        setFile(file);
        setLoading(false);

        // Select first animation if any
        if (loadedGltf.animations && loadedGltf.animations.length > 0) {
          setActiveAnimIndex(0);
          setAnimPlaying(true);
        } else {
          setActiveAnimIndex(-1);
          setAnimPlaying(false);
        }
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setProgress(percent);
        } else {
          // Fallback loader simulator
          setProgress((prev) => Math.min(prev + 8, 98));
        }
      },
      (err) => {
        console.error(err);
        setError("Failed to parse the file. Ensure it is a valid binary glTF (.glb) asset.");
        setLoading(false);
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      loadModelFile(selected);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      const ext = dropped.name.split(".").pop()?.toLowerCase();
      if (ext === "glb" || ext === "gltf") {
        loadModelFile(dropped);
      } else {
        setError("Unsupported file format. Please drop a self-contained .glb or .gltf file.");
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setGltf(null);
    setTelemetry(null);
    setError(null);
    setProgress(0);
    setActiveAnimIndex(-1);
    setMaterialOverride("original");
    setHdriPreset("pav_studio");
    setBgBlur(0.5);
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col font-sans">
      <Navbar />

      {/* Main workspace container */}
      <main className="flex-1 flex flex-col md:flex-row relative pt-[72px] h-screen overflow-hidden">
        {file === null ? (
          /* INGESTION CHAMBER / UPLOADER DROPZONE */
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            <div 
              className="pointer-events-none absolute w-[700px] h-[700px] rounded-full" 
              style={{ 
                top: "50%", 
                left: "50%", 
                transform: "translate(-50%, -50%)", 
                background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.03) 50%, transparent 70%)", 
                filter: "blur(90px)" 
              }} 
            />

            <div className="w-full max-w-xl text-center z-10 flex flex-col gap-8">
              <div>
                <span className="eyebrow mb-3">Ingestion chamber</span>
                <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white mt-1">
                  Preview GLB Assets
                </h2>
                <p className="text-zinc-400 mt-3 text-sm md:text-base">
                  Load any local 3D model. All parsing and shaders are computed client-side with full confidentiality.
                </p>
              </div>

              {/* Box drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border border-dashed rounded-[24px] p-12 flex flex-col items-center gap-5 transition-all duration-300 ${
                  isDragging
                    ? "border-violet-500 bg-violet-950/10 shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                    : "border-zinc-800 bg-zinc-950/20 hover:border-zinc-700 hover:bg-zinc-900/10"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".glb,.gltf"
                  className="hidden"
                />

                {/* Cyberpunk box icon */}
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-violet-400 group-hover:border-violet-500/30 transition-all duration-300 shadow-inner">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </div>

                <div>
                  <p className="text-base font-medium text-white">
                    Drag & drop your <span className="text-violet-400">.glb</span> / <span className="text-violet-400">.gltf</span> file here
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    Accepts standalone binary GLB and self-contained glTF files.
                  </p>
                </div>

                <button type="button" className="btn-secondary text-xs py-2 px-5 hover:bg-zinc-900">
                  Select File
                </button>
              </div>

              {/* Progress and error states */}
              {loading && (
                <div className="flex flex-col items-center gap-3 animate-fade-in">
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden border border-zinc-800/50">
                    <div
                      className="bg-violet-500 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-violet-400">
                    Loading Model Assets: {progress}%
                  </span>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/10 text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ACTIVE 3D VIEWER VIEWPORT & SIDEBAR */
          <div 
            className="flex-1 flex flex-col md:flex-row relative w-full"
            style={{ height: isDesktop ? "calc(100vh - 72px)" : "100%" }}
          >
            
            {/* 3D Canvas Area */}
            <div 
              className="flex-1 relative bg-zinc-950/20"
              style={{ height: isDesktop ? "100%" : "60vh" }}
            >
              {/* Backglow ring behind canvas */}
              <div 
                className="pointer-events-none absolute w-[400px] h-[400px] rounded-full" 
                style={{ 
                  top: "50%", 
                  left: "50%", 
                  transform: "translate(-50%, -50%)", 
                  background: hdriPreset.includes("wooden") 
                    ? "radial-gradient(circle, rgba(217, 119, 6, 0.05) 0%, rgba(146, 64, 14, 0.03) 60%, transparent 80%)"
                    : hdriPreset === "amazon_neutral"
                    ? "radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(100, 100, 100, 0.02) 60%, transparent 80%)"
                    : "radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.02) 60%, transparent 80%)",
                  filter: "blur(60px)" 
                }} 
              />

              <Canvas
                camera={{ position: [0, 0.5, 4.5], fov: 40, near: 0.1, far: 200 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, 2]}
                style={{ width: "100%", height: "100%" }}
              >
                <Suspense fallback={null}>
                  <ModelRenderer
                    gltf={gltf}
                    materialOverride={materialOverride}
                    hdriPreset={hdriPreset}
                    autoRotate={autoRotate}
                    autoRotateSpeed={autoRotateSpeed}
                    showGrid={showGrid}
                    showAxes={showAxes}
                    bgBlur={bgBlur}
                    activeAnimIndex={activeAnimIndex}
                    animPlaying={animPlaying}
                    animSpeed={animSpeed}
                    controlsRef={controlsRef}
                  />
                </Suspense>
              </Canvas>

              {/* Top floating control shortcuts */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/70 hover:bg-zinc-900 text-[11px] font-mono text-zinc-300 hover:text-white transition-all backdrop-blur"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Load Another
                </button>

                <button
                  type="button"
                  onClick={handleResetCamera}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/70 hover:bg-zinc-900 text-[11px] font-mono text-zinc-300 hover:text-white transition-all backdrop-blur"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a9 9 0 0118 0v3" />
                  </svg>
                  Reset Cam
                </button>
              </div>

              {/* Sidebar toggle button (Mobile / Desktop floating) */}
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute top-4 right-4 z-20 flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-950/70 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all backdrop-blur"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  )}
                </svg>
              </button>
            </div>

            {/* Scrollable control inspector sidebar */}
            <div
              className={`w-full md:w-[400px] border-t md:border-t-0 md:border-l border-zinc-800 bg-zinc-950/70 backdrop-blur-xl flex flex-col transition-all duration-300 z-10 ${
                sidebarOpen ? "translate-x-0 relative" : "md:translate-x-[400px] md:w-0 overflow-hidden"
              }`}
              style={{ height: isDesktop ? "100%" : "40vh" }}
            >
              {/* Sidebar Header */}
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
                    INSPECTOR_ACTIVE
                  </span>
                </div>
              </div>

              {/* Sidebar Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                
                {/* 1. Telemetry Stats Panel */}
                <div className="floating-panel floating-panel--editor w-full">
                  <div className="panel-header">
                    <span className="panel-dot"></span>
                    <span className="panel-title">Model Telemetry</span>
                  </div>
                  <div className="panel-content flex flex-col gap-3 font-mono text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-zinc-500">Asset Name:</span>
                      <span className="text-white truncate max-w-[180px] font-semibold" title={telemetry?.name}>
                        {telemetry?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-zinc-500">File Size:</span>
                      <span className="text-white font-semibold">{telemetry?.size}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-zinc-500">Total Meshes:</span>
                      <span className="text-white font-semibold">{telemetry?.meshes}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-zinc-500">Vertices:</span>
                      <span className="text-emerald-400 font-semibold">{telemetry?.vertices}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-zinc-500">Polygons (Tri):</span>
                      <span className="text-cyan-400 font-semibold">{telemetry?.polygons}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-zinc-500">Animations:</span>
                      <span className="text-violet-400 font-semibold">{telemetry?.animationsCount} found</span>
                    </div>
                  </div>
                </div>

                {/* 2. Shader Override Panel */}
                <div className="control-group">
                  <span className="group-label">MATERIAL OVERRIDES</span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setMaterialOverride("original")}
                      className={`ctrl-btn py-2 px-3 text-xs justify-center text-center capitalize ${
                        materialOverride === "original" ? "active" : ""
                      }`}
                    >
                      Original
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaterialOverride("wireframe")}
                      className={`ctrl-btn py-2 px-3 text-xs justify-center text-center capitalize ${
                        materialOverride === "wireframe" ? "active" : ""
                      }`}
                    >
                      Wireframe
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaterialOverride("glass")}
                      className={`ctrl-btn py-2 px-3 text-xs justify-center text-center capitalize ${
                        materialOverride === "glass" ? "active" : ""
                      }`}
                    >
                      Glass
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaterialOverride("iridescent")}
                      className={`ctrl-btn py-2 px-3 text-xs justify-center text-center capitalize ${
                        materialOverride === "iridescent" ? "active" : ""
                      }`}
                    >
                      Iridescent
                    </button>
                  </div>
                </div>

                {/* 3. HDRI Environment Selector */}
                <div className="control-group">
                  <span className="group-label">HDRI ENVIRONMENT</span>
                  <div className="flex flex-col gap-2 mt-2">
                    {(Object.keys(hdriPresets) as Array<keyof typeof hdriPresets>).map((presetKey) => {
                      const isActive = hdriPreset === presetKey;
                      const preset = hdriPresets[presetKey];
                      return (
                        <button
                          key={presetKey}
                          type="button"
                          onClick={() => setHdriPreset(presetKey)}
                          className={`ctrl-btn w-full flex justify-between items-center py-2.5 px-4 text-xs ${
                            isActive ? "active" : ""
                          }`}
                        >
                          <span>{preset.name}</span>
                          <span className="flex gap-1.5">
                            {presetKey === "pav_studio" && (
                              <span className="text-[10px] text-zinc-500 font-mono">STUDIO</span>
                            )}
                            {presetKey.includes("wooden") && (
                              <span className="text-[10px] text-amber-500/80 font-mono">WOODEN</span>
                            )}
                            {presetKey === "amazon_neutral" && (
                              <span className="text-[10px] text-cyan-500/80 font-mono">NEUTRAL</span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Animations Playlist (Only show if animations exist) */}
                {telemetry && telemetry.animationsCount > 0 && (
                  <div className="control-group border-t border-zinc-800 pt-5">
                    <span className="group-label">ANIMATIONS</span>
                    
                    {/* Play/Pause & Speed Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setAnimPlaying(!animPlaying)}
                        className="ctrl-btn flex items-center justify-center p-2 rounded-lg"
                        title={animPlaying ? "Pause" : "Play"}
                      >
                        {animPlaying ? (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      {/* Speed Buttons */}
                      <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 ml-auto">
                        {[0.5, 1, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            type="button"
                            onClick={() => setAnimSpeed(speed)}
                            className={`px-2 py-1 text-[10px] font-mono rounded-md transition-all ${
                              animSpeed === speed ? "bg-violet-600/35 text-violet-300" : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Animation Track Selector */}
                    <div className="flex flex-col gap-1.5 mt-3 max-h-[140px] overflow-y-auto pr-1">
                      {gltf.animations.map((clip: THREE.AnimationClip, index: number) => {
                        const isSelected = activeAnimIndex === index;
                        return (
                          <button
                            key={clip.name}
                            type="button"
                            onClick={() => {
                              setActiveAnimIndex(index);
                              setAnimPlaying(true);
                            }}
                            className={`w-full text-left py-2 px-3 rounded-lg border text-xs font-mono transition-all truncate flex items-center justify-between ${
                              isSelected
                                ? "border-violet-500 bg-violet-950/20 text-white font-bold"
                                : "border-zinc-800/60 bg-zinc-900/20 text-zinc-400 hover:text-zinc-300 hover:border-zinc-700"
                            }`}
                          >
                            <span className="truncate pr-2">{clip.name || `Animation ${index + 1}`}</span>
                            <span className="text-[10px] text-zinc-500 shrink-0">
                              {clip.duration.toFixed(2)}s
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. Helpers & Environment controls */}
                <div className="control-group border-t border-zinc-800 pt-5 flex flex-col gap-3.5">
                  <span className="group-label">ENVIRONMENT HELPERS</span>
                  
                  <label className="flex items-center justify-between cursor-pointer group text-xs text-zinc-400 hover:text-white transition-all select-none">
                    <span>Show XYZ Axes</span>
                    <input
                      type="checkbox"
                      checked={showAxes}
                      onChange={(e) => setShowAxes(e.target.checked)}
                      className="w-4 h-4 accent-violet-600 rounded bg-zinc-900 border-zinc-700 cursor-pointer"
                    />
                  </label>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>Background Blur:</span>
                      <span>{(bgBlur * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bgBlur}
                      onChange={(e) => setBgBlur(parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-violet-500 border border-zinc-800"
                    />
                  </div>

                  <label className="flex items-center justify-between cursor-pointer group text-xs text-zinc-400 hover:text-white transition-all select-none">
                    <span>Auto-Rotation</span>
                    <input
                      type="checkbox"
                      checked={autoRotate}
                      onChange={(e) => setAutoRotate(e.target.checked)}
                      className="w-4 h-4 accent-violet-600 rounded bg-zinc-900 border-zinc-700 cursor-pointer"
                    />
                  </label>

                  {autoRotate && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                        <span>Rotation Speed:</span>
                        <span>{autoRotateSpeed.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="4"
                        step="0.1"
                        value={autoRotateSpeed}
                        onChange={(e) => setAutoRotateSpeed(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-violet-500 border border-zinc-800"
                      />
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
