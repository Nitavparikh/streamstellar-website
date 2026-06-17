"use client";

import { useState } from "react";
import { ProductViewer } from "@/components/ProductViewer";

export function Hero() {
  const [geometry, setGeometry] = useState<"original" | "torus" | "sphere">("original");
  const [material, setMaterial] = useState<"original" | "glass" | "iridescent">("original");
  const [lighting, setLighting] = useState<"studio" | "cyber" | "sunset">("studio");

  const polyCounts = {
    original: "48,200",
    torus: "114,600",
    sphere: "72,400",
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-inner">
        {/* LEFT COLUMN: COPY & INSPECTOR */}
        <div className="hero-copy">
          <h1 className="hero-title">
            Turn Products<br />Into Experiences.
          </h1>

          <p className="hero-desc">
            Transform your product catalog into interactive 3D experiences, digital twins, and configurators designed for modern commerce.
          </p>

          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Start a Project</a>
            <a href="#services" className="btn-secondary">Explore Services</a>
          </div>

          {/* FLOATING INTERACTIVE DESIGN PANEL (INTEGRATED UNDER TEXT) */}
          <div className="floating-panel floating-panel--editor" id="editorPanel">
            <div className="panel-header">
              <span className="panel-dot"></span>
              <span className="panel-title">SCENE_INSPECTOR</span>
              <span className="value-mono font-mono text-[9px] text-zinc-500 ml-auto mr-1">
                {polyCounts[geometry]} POLY
              </span>
            </div>
            <div className="panel-content">
              <div className="control-group">
                <span className="group-label">GEOMETRY</span>
                <div className="control-row">
                  <button
                    type="button"
                    onClick={() => setGeometry("original")}
                    className={`ctrl-btn ${geometry === "original" ? "active" : ""}`}
                  >
                    Cube
                  </button>
                  <button
                    type="button"
                    onClick={() => setGeometry("torus")}
                    className={`ctrl-btn ${geometry === "torus" ? "active" : ""}`}
                  >
                    Shoe
                  </button>
                  <button
                    type="button"
                    onClick={() => setGeometry("sphere")}
                    className={`ctrl-btn ${geometry === "sphere" ? "active" : ""}`}
                  >
                    Chair
                  </button>
                </div>
              </div>

              <div className="control-group">
                <span className="group-label">MATERIAL</span>
                <div className="control-row">
                  <button
                    type="button"
                    onClick={() => setMaterial("original")}
                    className={`ctrl-btn ${material === "original" ? "active" : ""}`}
                  >
                    Original
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterial("glass")}
                    className={`ctrl-btn ${material === "glass" ? "active" : ""}`}
                  >
                    Glass
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterial("iridescent")}
                    className={`ctrl-btn ${material === "iridescent" ? "active" : ""}`}
                  >
                    Iridescent
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D CANVAS & MONITOR */}
        <div className="hero-visual" style={{ position: "relative" }}>
          {/* Subtle soft glowing background light trails behind the 3D Viewer */}
          <div 
            className="pointer-events-none absolute w-[650px] h-[650px] rounded-full" 
            style={{ 
              zIndex: 0, 
              top: "50%", 
              left: "50%", 
              transform: "translate(-50%, -50%)", 
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.09) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 70%)", 
              filter: "blur(80px)" 
            }} 
          />
          <div className="hero-canvas-frame" style={{ zIndex: 1 }}>
            <ProductViewer
              className="w-full h-full"
              autoRotateSpeed={0.18}
              targetSize={2.1}
              geometry={geometry}
              material={material}
              lighting={lighting}
            />
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <span className="scroll-arrow">↓</span> Scroll to explore
      </div>
    </section>
  );
}
