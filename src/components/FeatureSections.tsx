"use client";

import React, { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Image from "next/image";
import * as THREE from "three";



function DigitalTwinCanvas() {
  const [sliderPct, setSliderPct] = useState(50);

  // clipX maps 0–100% → world-X boundary. Torus knot fits within ±1.5 world units
  const clipX = (sliderPct / 100) * 3.0 - 1.5;

  const leftPlane  = useMemo(() => new THREE.Plane(new THREE.Vector3(1, 0, 0),  -clipX), [clipX]);
  const rightPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0),  clipX), [clipX]);

  return (
    <div className="relative w-full h-full select-none" style={{ touchAction: "none" }}>
      {/* Side labels */}
      <div style={{ position: "absolute", top: 8, left: 10, zIndex: 5, pointerEvents: "none" }}>
        <span style={{ fontSize: 8, color: "#a855f7", letterSpacing: "0.12em", textTransform: "uppercase", textShadow: "0 0 8px rgba(168,85,247,0.8)" }}>◄ Wireframe</span>
      </div>
      <div style={{ position: "absolute", top: 8, right: 10, zIndex: 5, pointerEvents: "none" }}>
        <span style={{ fontSize: 8, color: "#06b6d4", letterSpacing: "0.12em", textTransform: "uppercase", textShadow: "0 0 8px rgba(6,182,212,0.8)" }}>PBR Render ►</span>
      </div>

      <Canvas
        gl={{ antialias: true, alpha: true, localClippingEnabled: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 5, 3]}  intensity={3.0} color="#a855f7" />
        <directionalLight position={[-3, -2, 3]} intensity={1.5} color="#06b6d4" />
        <directionalLight position={[0, 4, 2]}   intensity={1.0} color="#ffffff" />

        <RotatingSplitObject leftPlane={leftPlane} rightPlane={rightPlane} />
      </Canvas>

      {/* Glowing vertical divider */}
      <div
        className="absolute top-0 bottom-0 w-[2px] pointer-events-none z-10"
        style={{
          left: `${sliderPct}%`,
          background: "linear-gradient(to bottom, transparent, #a855f7, #06b6d4, #a855f7, transparent)",
          boxShadow: "0 0 8px 2px rgba(168,85,247,0.5)",
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-zinc-950 border border-violet-400/60 flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.7)] cursor-ew-resize">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 7H10M4 7L6 5M4 7L6 9M10 7L8 5M10 7L8 9" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <input
        type="range" min="0" max="100" value={sliderPct}
        onChange={(e) => setSliderPct(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        style={{ margin: 0 }}
      />
    </div>
  );
}


function RotatingSplitObject({ leftPlane, rightPlane }: { leftPlane: THREE.Plane; rightPlane: THREE.Plane }) {
  const outerRef = useRef<THREE.Group>(null);

  // Shared torus-knot geometry (the "pipe" shape)
  const geometry = useMemo(() => new THREE.TorusKnotGeometry(1, 0.32, 180, 32), []);

  // Rotation + gentle float
  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.35;
      outerRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.08;
      outerRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.1) * 0.07;
    }
  });

  return (
    <group ref={outerRef}>
      {/* Left side — neon wireframe, clipped to show only left of divider */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.7}
          clippingPlanes={[leftPlane]}
          clipShadows
        />
      </mesh>

      {/* Right side — polished PBR, clipped to show only right of divider */}
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#7c3aed"
          metalness={0.6}
          roughness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          clippingPlanes={[rightPlane]}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ── Interactive Image Slider Component ──────────────────────

function ImageSlider({ leftImage, rightImage, leftLabel = "CAD", rightLabel = "RENDER" }: { leftImage: string; rightImage: string; leftLabel?: string; rightLabel?: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-ew-resize"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Right Image (Background) */}
      <img
        src={rightImage}
        alt={rightLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute right-3 bottom-3 bg-black/70 border border-zinc-800/80 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-mono text-zinc-300 z-10">
        {rightLabel}
      </div>

      {/* Left Image (Clipped Foreground) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`,
        }}
      >
        <img
          src={leftImage}
          alt={leftLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div 
        className="absolute left-3 bottom-3 bg-black/70 border border-zinc-800/80 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-mono text-zinc-300 z-10" 
        style={{ opacity: position > 15 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {leftLabel}
      </div>

      {/* Divider & Dragger Handle */}
      <div
        className="absolute top-0 bottom-0 w-[1.5px] bg-white/60 z-20 pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0a0a0a]/90 border border-white/20 shadow-lg flex items-center justify-center">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Lifestyle Slideshow ──────────────────────────────────────

function LifestyleSlideshow() {
  const images = [
    "/Lifestyle images/Lifestyle image 01.jpg",
    "/Lifestyle images/Lifestyle image 02.jpg",
    "/Lifestyle images/LIfestyle image 04.jpg",
    "/Lifestyle images/LIfestyle image 05.jpg",
    "/Lifestyle images/Lifestyle image 06.jpg",
    "/Lifestyle images/Lifestyle image 07.png",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // changes every 4 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {images.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src}
            className="absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? "scale(1.05)" : "scale(1.0)",
              zIndex: isActive ? 2 : 1,
            }}
          >
            <img
              src={src}
              alt={`Lifestyle scene ${index + 1}`}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        );
      })}
      
      {/* Soft indicator dots at the bottom right */}
      <div className="absolute bottom-3 right-3 flex gap-1.5 z-[10] bg-black/45 backdrop-blur-[2px] px-2 py-1 rounded-full border border-white/5">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-110" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── FeatureSections Component ───────────────────────────────

export function FeatureSections() {
  return (
    <section className="services-section" id="services">
      <div className="section-inner">
        <div className="section-header-centered">
          <h2 className="section-heading">Services we do.</h2>
          <p className="section-body">
            We replace expensive photography and heavy plugins with responsive, web-native 3D assets.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Lifestyle Rendering (widen to full width) */}
          <div className="bento-card" style={{ gridColumn: "1 / -1" }}>
            <div className="card-visual relative" style={{ minHeight: "360px", aspectRatio: "2.4" }}>
              <LifestyleSlideshow />
            </div>
            <div className="card-info">
              <h3 className="card-title">Lifestyle Rendering</h3>
              <p className="card-desc">
                Superimpose products from a simple white studio background (silo) directly into warm, realistic living spaces or rich environments.
              </p>
            </div>
          </div>

          {/* Card 2: Product Visualization (medium) */}
          <div className="bento-card bento-card--medium">
            <div className="card-visual relative" style={{ minHeight: "260px" }}>
              <img
                src="/slider_watch_render.png"
                alt="Product visualization render"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            </div>
            <div className="card-info">
              <h3 className="card-title">Product Visualization</h3>
              <p className="card-desc">
                Transition raw CAD engineering models directly into photo-realistic 3D product renders. Compare designs against final physical material output.
              </p>
            </div>
          </div>

          {/* Card 3: Digital Twins & CAD Pipeline (large - span 2) */}
          <div className="bento-card bento-card--large">
            <div className="card-visual">
              <DigitalTwinCanvas />
            </div>
            <div className="card-info">
              <h3 className="card-title">Digital Twins & CAD Pipeline</h3>
              <p className="card-desc">
                Optimized CAD conversion that reduces polygon sizes by up to 95% while preserving visual details. Perfect for manufacturing catalogs and technical documentation.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
