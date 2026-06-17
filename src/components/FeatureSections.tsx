"use client";

import { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Image from "next/image";

// ── Bento Grid Canvases ─────────────────────────────────────

function ConfiguratorCanvas({ color }: { color: string }) {
  const hexColors: Record<string, string> = {
    white: "#e4e4e7",
    indigo: "#a855f7",
    green: "#10b981",
    red: "#ef4444",
  };

  const hex = hexColors[color] || "#e4e4e7";

  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 3.2], fov: 38 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 2]} intensity={3.0} color="#ffffff" />
      <directionalLight position={[-3, -2, 2]} intensity={1.5} color="#8b5cf6" />
      <Suspense fallback={null}>
        <ChairMesh colorHex={hex} />
      </Suspense>
    </Canvas>
  );
}

function ChairMesh({ colorHex }: { colorHex: string }) {
  const groupRef = useRef<any>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.45, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.9]} />
        <meshPhysicalMaterial
          color={colorHex}
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.2}
        />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.7, -0.41]}>
        <boxGeometry args={[0.9, 0.65, 0.08]} />
        <meshPhysicalMaterial
          color={colorHex}
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.2}
        />
      </mesh>

      {/* Backrest metal supports */}
      <mesh position={[0, 0.38, -0.41]}>
        <boxGeometry args={[0.6, 0.08, 0.04]} />
        <meshPhysicalMaterial
          color="#e4e4e7"
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>

      {/* Legs (4 thin cylinders/boxes) */}
      {/* Front Left */}
      <mesh position={[-0.38, -0.1, 0.38]}>
        <cylinderGeometry args={[0.03, 0.025, 0.7, 8]} />
        <meshPhysicalMaterial
          color="#18181b"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {/* Front Right */}
      <mesh position={[0.38, -0.1, 0.38]}>
        <cylinderGeometry args={[0.03, 0.025, 0.7, 8]} />
        <meshPhysicalMaterial
          color="#18181b"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {/* Back Left */}
      <mesh position={[-0.38, -0.1, -0.38]}>
        <cylinderGeometry args={[0.03, 0.025, 0.7, 8]} />
        <meshPhysicalMaterial
          color="#18181b"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {/* Back Right */}
      <mesh position={[0.38, -0.1, -0.38]}>
        <cylinderGeometry args={[0.03, 0.025, 0.7, 8]} />
        <meshPhysicalMaterial
          color="#18181b"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}

function DigitalTwinCanvas() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 3.2], fov: 38 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <RotatingWireframe />
      </Suspense>
    </Canvas>
  );
}

function RotatingWireframe() {
  const groupRef = useRef<any>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe */}
      <mesh>
        <torusGeometry args={[0.65, 0.25, 16, 64]} />
        <meshBasicMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>
      {/* Inner solid volume */}
      <mesh>
        <torusGeometry args={[0.65, 0.25, 16, 64]} />
        <meshBasicMaterial
          color="#030303"
          transparent
          opacity={0.8}
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

// ── FeatureSections Component ───────────────────────────────

export function FeatureSections() {
  const [activeColor, setActiveColor] = useState("white");

  return (
    <section className="services-section" id="services">
      <div className="section-inner">
        <div className="section-header-centered">
          <span className="eyebrow">Studio Capabilities</span>
          <h2 className="section-heading">Services we do.</h2>
          <p className="section-body">
            We replace expensive photography and heavy plugins with responsive, web-native 3D assets.
          </p>
        </div>

        <div className="bento-grid">
          
          {/* Card 1: Lifestyle Rendering (large) */}
          <div className="bento-card bento-card--large">
            <div className="card-visual relative" style={{ minHeight: "260px" }}>
              <ImageSlider 
                leftImage="/slider_chair_silo.png" 
                rightImage="/slider_chair_lifestyle.png" 
                leftLabel="STUDIO SILO" 
                rightLabel="LIFESTYLE SCENE" 
              />
              <div className="visual-badge" style={{ zIndex: 10 }}>Interactive Slider</div>
            </div>
            <div className="card-info">
              <span className="card-num">01</span>
              <h3 className="card-title">Lifestyle Rendering</h3>
              <p className="card-desc">
                Superimpose products from a simple white studio background (silo) directly into warm, realistic living spaces or rich environments.
              </p>
            </div>
          </div>

          {/* Card 2: Material Configurator (medium) */}
          <div className="bento-card bento-card--medium">
            <div className="card-visual card-visual--config">
              <div className="configurator-preview">
                <ConfiguratorCanvas color={activeColor} />
                <div className="configurator-controls">
                  <button
                    type="button"
                    onClick={() => setActiveColor("white")}
                    className={`config-swatch ${activeColor === "white" ? "active" : ""}`}
                    style={{ "--c": "#ffffff" } as any}
                    aria-label="White Swatch"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveColor("indigo")}
                    className={`config-swatch ${activeColor === "indigo" ? "active" : ""}`}
                    style={{ "--c": "#a855f7" } as any}
                    aria-label="Indigo Swatch"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveColor("green")}
                    className={`config-swatch ${activeColor === "green" ? "active" : ""}`}
                    style={{ "--c": "#10b981" } as any}
                    aria-label="Green Swatch"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveColor("red")}
                    className={`config-swatch ${activeColor === "red" ? "active" : ""}`}
                    style={{ "--c": "#ef4444" } as any}
                    aria-label="Red Swatch"
                  />
                </div>
              </div>
              <div className="visual-badge">3D Chair Configurator</div>
            </div>
            <div className="card-info">
              <span className="card-num">02</span>
              <h3 className="card-title">Real-Time Configurators</h3>
              <p className="card-desc">
                Let users customize finishes, colors, and components. Updates rendering shaders dynamically for instant, lag-free visual feedback.
              </p>
            </div>
          </div>

          {/* Card 3: WebAR Commerce (medium) */}
          <div className="bento-card bento-card--medium">
            <div className="card-visual card-visual--ar">
              <div className="ar-phone-frame">
                <div className="ar-camera-view">
                  <div className="ar-grid-dots"></div>
                  <div className="ar-mock-object">
                    <div className="ar-cube"></div>
                  </div>
                  <div className="ar-reticle"></div>
                  <div className="ar-indicator-badge">AR Active</div>
                </div>
              </div>
              <div className="visual-badge">Augmented Reality</div>
            </div>
            <div className="card-info">
              <span className="card-num">03</span>
              <h3 className="card-title">WebAR Commerce</h3>
              <p className="card-desc">
                Place items directly in physical environments using WebXR. Zero downloads or installations required — compatible with modern iOS & Android devices.
              </p>
            </div>
          </div>

          {/* Card 4: Digital Twins (large) */}
          <div className="bento-card bento-card--large">
            <div className="card-visual">
              <DigitalTwinCanvas />
              <div className="visual-badge">WebGL Wireframe</div>
            </div>
            <div className="card-info">
              <span className="card-num">04</span>
              <h3 className="card-title">Digital Twins & CAD Pipeline</h3>
              <p className="card-desc">
                Optimized CAD conversion that reduces polygon sizes by up to 95% while preserving visual details. Perfect for manufacturing catalogs and technical documentation.
              </p>
            </div>
          </div>

          {/* Card 5: Product Visualizations (medium) */}
          <div className="bento-card bento-card--medium">
            <div className="card-visual relative" style={{ minHeight: "260px" }}>
              <img
                src="/slider_watch_render.png"
                alt="Product visualization render"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="visual-badge" style={{ zIndex: 10 }}>Realistic Render</div>
            </div>
            <div className="card-info">
              <span className="card-num">05</span>
              <h3 className="card-title">Product Visualizations</h3>
              <p className="card-desc">
                Transition raw CAD engineering models directly into photo-realistic 3D product renders. Compare designs against final physical material output.
              </p>
            </div>
          </div>

          {/* Card 6: Product Animation (large) */}
          <div className="bento-card bento-card--large">
            <div className="card-visual relative" style={{ minHeight: "220px" }}>
              <ImageSlider 
                leftImage="/slider_watch_cad.png" 
                rightImage="/slider_watch_render.png" 
                leftLabel="CAD MODEL" 
                rightLabel="REALISTIC RENDER" 
              />
              <div className="visual-badge" style={{ zIndex: 10 }}>Interactive Slider</div>
            </div>
            <div className="card-info">
              <span className="card-num">06</span>
              <h3 className="card-title">Product Animation</h3>
              <p className="card-desc">
                Cinematic 3D animation videos detailing functional features, assembly sequences, and exploded views of complex engineering products.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
