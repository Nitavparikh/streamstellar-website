"use client";

import { useEffect, useState } from "react";

const steps = [
  {
    circle: "01",
    title: "CAD Ingestion",
    description: "We convert CAD engineering files (STEP, SolidWorks) or high-poly models into lightweight files.",
  },
  {
    circle: "02",
    title: "Retopology",
    description: "Reconstructing mesh topology to ensure optimal execution speeds and sub-100ms load times.",
  },
  {
    circle: "03",
    title: "PBR Texturing",
    description: "Mapping physically accurate textures (metalness, roughness, normal maps) for photo-realistic renders.",
  },
  {
    circle: "04",
    title: "Integration",
    description: "Deploying the lightweight asset via WebGL/WebXR components on your target platforms.",
  },
];

export function IntegrateSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="pipeline-section" id="pipeline">
      <div className="section-inner">
        <div className="section-header-centered">
          <span className="eyebrow">Our Workflow</span>
          <h2 className="section-heading">How We Build 3D for Web</h2>
          <p className="section-body">
            We take raw assets and design details, refining them into responsive interactive media.
          </p>
        </div>

        <div className="pipeline-flow" style={{ overflow: "visible" }}>
          <div className="flow-line"></div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flow-step ${mounted ? "visible" : ""} relative group/step`}
              data-index={idx}
              style={{ overflow: "visible" }}
            >
              <div className="flow-circle">{step.circle}</div>
              <h3 className="flow-title">{step.title}</h3>
              <p className="flow-desc">{step.description}</p>

              {idx === 0 && (
                <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 w-56 h-36 rounded-xl border border-zinc-800 bg-[#080808] p-1.5 opacity-0 scale-95 group-hover/step:opacity-100 group-hover/step:scale-100 transition-all duration-300 pointer-events-none z-50 shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                  <div className="relative w-full h-full rounded-lg overflow-hidden border border-zinc-900">
                    <img 
                      src="/cad_ingestion_placeholder.png" 
                      alt="CAD Ingestion preview" 
                      className="w-full h-full object-cover brightness-95 saturate-[0.85]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="font-mono text-[9px] text-zinc-300 uppercase tracking-wide">CAD Source Wireframe</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
