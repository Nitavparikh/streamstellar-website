"use client";

import React from "react";

export function EfficiencySection() {
  return (
    <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden" id="efficiency">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="section-inner relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="eyebrow inline-block">Workflow Optimization</span>
            <h2 className="section-heading text-left text-white leading-tight font-bold" style={{ fontSize: "clamp(32px, 4vw, 46px)" }}>
              Efficient from <br />
              End-to-End
            </h2>
            <p className="text-zinc-400 text-[15px] sm:text-[16px] leading-relaxed max-w-md">
              Significantly shorten your time-to-market with virtual sampling and remote collaboration.
            </p>
            <div className="pt-4">
              <a 
                href="#contact" 
                className="btn-primary inline-flex items-center gap-2 group"
                style={{ 
                  background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", 
                  color: "#ffffff", 
                  border: "none", 
                  boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)" 
                }}
              >
                <span>Learn More</span>
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Video Visual Column */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-2 sm:p-4 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
              {/* Window chrome header details */}
              <div className="flex items-center justify-between pb-3 px-2 border-b border-white/5 mb-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase">Workflow_Timeline_Simulation.mp4</span>
                <span className="w-4 h-4 text-zinc-600" />
              </div>

              {/* Video wrapper with custom CSS filter to invert white background to transparent/black */}
              <div className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center min-h-[220px]">
                <video
                  src="https://cdn.clo3d.com/resource/videos/artwork/efficient_en.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover select-none pointer-events-none"
                  style={{
                    filter: "invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.1)",
                    mixBlendMode: "screen",
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
