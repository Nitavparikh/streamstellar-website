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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
