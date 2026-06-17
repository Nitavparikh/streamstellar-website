"use client";

import { useState } from "react";
import { ProductViewer } from "@/components/ProductViewer";

export function ViewerPreviewSection() {
  const [modelType, setModelType] = useState<"shoe" | "chair" | "cube">("shoe");
  const [activeMaterial, setActiveMaterial] = useState<"original" | "glass" | "iridescent">("original");

  const getGeometry = () => {
    if (modelType === "shoe") return "torus"; // mapped in ProductViewer to shoe
    if (modelType === "chair") return "sphere"; // mapped in ProductViewer to chair
    return "original"; // mapped to cube
  };

  return (
    <section className="specs-section bg-black" id="viewer-preview" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "100px 0" }}>
      <div className="section-inner">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column: Creative copy & CTA */}
          <div className="flex-1 text-left">
            <span className="eyebrow">Interactive 3D Previewer</span>
            <h2 className="section-heading mt-2 mb-6" style={{ maxWidth: "500px", lineHeight: "1.15" }}>
              Want to roam around your digital twins and see how they look?
            </h2>
            <p className="section-body text-zinc-400 mb-8" style={{ fontSize: "16px", lineHeight: "1.7", maxWidth: "550px" }}>
              We have created a web-native <strong>3D File Viewer</strong>, so that anyone can preview, rotate, and interact with their GLB or gLTF assets for free. Experiment with material overrides, play with real-time lighting shaders, and test responsiveness instantly. 
            </p>
            <p className="section-body text-zinc-400 mb-8" style={{ fontSize: "15px", lineHeight: "1.7", maxWidth: "550px" }}>
              Try it directly in the interactive sandbox window. Drag to rotate, test presets, and when you are ready, launch the full editor page to upload and inspect your own files.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href="/viewer" className="btn-primary">
                Open Full 3D Viewer
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
              <a href="/viewer" className="btn-secondary">
                Upload your GLB
              </a>
            </div>
          </div>

          {/* Right Column: Embedded mini-viewer window */}
          <div className="flex-1 w-full max-w-[580px] lg:max-w-none">
            <div className="glass-panel overflow-hidden border border-zinc-800/80 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
              
              {/* Window Chrome Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80 bg-zinc-950/60">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-[7px] text-zinc-500 font-bold select-none cursor-pointer"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-[7px] text-zinc-500 font-bold select-none cursor-pointer"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-[7px] text-zinc-500 font-bold select-none cursor-pointer"></span>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-900/80 px-4 py-1.5 rounded-md border border-zinc-800/80 text-[10px] font-mono text-zinc-400 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                  3D_FILE_VIEWER_PREVIEW
                </div>
                <div className="w-16"></div> {/* Spacer to center title */}
              </div>

              {/* Viewer viewport */}
              <div className="relative h-[360px] bg-black">
                <ProductViewer
                  className="w-full h-full"
                  autoRotateSpeed={0.12}
                  targetSize={2.0}
                  geometry={getGeometry()}
                  material={activeMaterial}
                  lighting="studio"
                />
                
                {/* Embedded controls overlay */}
                <div className="absolute left-4 bottom-4 flex flex-col gap-2.5 z-10">
                  {/* Selector swatches */}
                  <div className="bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xl">
                    <span className="font-mono text-[9px] text-zinc-500 tracking-wider mr-1">MODEL</span>
                    <button
                      type="button"
                      onClick={() => setModelType("shoe")}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-mono transition-all duration-200 ${modelType === "shoe" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                    >
                      Shoe
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelType("chair")}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-mono transition-all duration-200 ${modelType === "chair" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                    >
                      Chair
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelType("cube")}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-mono transition-all duration-200 ${modelType === "cube" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                    >
                      Cube
                    </button>
                  </div>

                  {/* Material controls */}
                  <div className="bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xl">
                    <span className="font-mono text-[9px] text-zinc-500 tracking-wider mr-1">SHADING</span>
                    <button
                      type="button"
                      onClick={() => setActiveMaterial("original")}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-mono transition-all duration-200 ${activeMaterial === "original" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                    >
                      Original
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMaterial("glass")}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-mono transition-all duration-200 ${activeMaterial === "glass" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                    >
                      Glass
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMaterial("iridescent")}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-mono transition-all duration-200 ${activeMaterial === "iridescent" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                    >
                      Iridescent
                    </button>
                  </div>
                </div>

                {/* Corner instructions */}
                <div className="absolute right-4 bottom-4 bg-zinc-950/60 border border-zinc-900 backdrop-blur-sm px-2.5 py-1.5 rounded-lg pointer-events-none font-mono text-[9px] text-zinc-500 tracking-wide">
                  🖱️ Drag to rotate
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
