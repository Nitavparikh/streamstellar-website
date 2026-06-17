"use client";

const specs = [
  {
    metric: "WebGL 2.0 & WebGPU",
    label: "Adding WebGPU support. Native browser rendering — zero plugins or apps required.",
  },
  {
    metric: "1.8 MB – < 5 MB",
    label: "Optimized model sizing (typically 1.8 MB to < 5 MB, always less than 10MB) using streamstellar compression.",
  },
  {
    metric: "WebXR",
    label: "Built-in support for augmented reality on iOS Safari and Android Chrome.",
  },
  {
    metric: "PBR Shading",
    label: "Physically-based rendering for accurate reflections and shadows.",
  },
];

export function Deliverability() {
  return (
    <section className="specs-section" id="specs">
      <div className="section-inner">
        <div className="specs-panel">
          <div className="specs-intro">
            <span className="eyebrow">Technical Architecture</span>
            <h2 className="specs-title">Engineered for Performance</h2>
            <p className="specs-desc">
              StreamStellar assets are designed to run smoothly at 60 FPS on standard mobile and desktop configurations. Built using industry-standard 3D workflows and open ecosystem technologies. Members of Metaverse Standards.
            </p>
          </div>
          <div className="specs-grid">
            {specs.map((spec) => (
              <div key={spec.metric} className="spec-card">
                <span className="spec-metric">{spec.metric}</span>
                <span className="spec-label">{spec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
