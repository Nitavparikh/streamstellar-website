"use client";

import React, { useState, useEffect } from "react";

export function EfficiencySection() {
  const [topPos, setTopPos] = useState({ x: 80, y: 100 });
  const [bottomPos, setBottomPos] = useState({ x: 80, y: 250 });

  const topTimelineLabels = [
    { text: "Inputs", left: "80" },
    { text: "3D Production", left: "204" },
    { text: "Email Delivery", left: "365", isMulti: true, lines: ["Email", "Delivery"] },
    { text: "Review", left: "530" },
    { text: "Approvals", left: "700" },
  ];

  const bottomTimelineLabels = [
    { text: "Inputs", left: "80" },
    { text: "3D Production", left: "204" },
    { text: "Inhouse Proofing tool", left: "328", isMulti: true, lines: ["Inhouse", "Proofing Tool"] },
    { text: "Review", left: "452" },
    { text: "Feedback", left: "576" },
    { text: "Approvals", left: "700" },
  ];

  // Pixel-perfect requestAnimationFrame loop to coordinate velocity matching
  useEffect(() => {
    let animationFrameId: number;
    const start = performance.now();
    const cycleDuration = 8000; // 8.0 seconds total loop cycle

    const update = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = (elapsed % cycleDuration) / cycleDuration;
      const t = progress * 8.0; // t goes from 0 to 8.0 seconds

      // Constant physical velocity for both balls
      const v = 175; // px/sec

      // ────────────────────────────────────────────────────────
      // 1. Calculate Top Ball (Manual Production)
      // ────────────────────────────────────────────────────────
      const d_top = v * t; // Distance along path
      let x_top = 80;
      let y_top = 100;

      // Path length segments:
      // - Segment 1: Straight 80 -> 365 (length: 285px)
      // - Segment 2: Loop 1 oval (length: 390px)
      // - Segment 3: Loop 2 oval (length: 390px)
      // - Segment 4: Straight 365 -> 700 (length: 335px)
      // Total path length: 1400px
      if (d_top <= 285) {
        x_top = 80 + d_top;
        y_top = 100;
      } else if (d_top <= 285 + 390) {
        const d_loop = d_top - 285;
        const theta = (d_loop / 390) * 2 * Math.PI;
        x_top = 447.5 - 82.5 * Math.cos(theta);
        y_top = 100 + 35 * Math.sin(theta);
      } else if (d_top <= 285 + 780) {
        const d_loop = d_top - (285 + 390);
        const theta = (d_loop / 390) * 2 * Math.PI;
        x_top = 447.5 - 82.5 * Math.cos(theta);
        y_top = 100 + 35 * Math.sin(theta);
      } else {
        const d_end = d_top - (285 + 780);
        x_top = 365 + d_end;
        y_top = 100;
      }

      // ────────────────────────────────────────────────────────
      // 2. Calculate Bottom Ball (Our Workflow)
      // ────────────────────────────────────────────────────────
      let x_bottom = 80;
      const y_bottom = 250;

      // Distance matching top ball velocity (175 px/s)
      // - Segment 1: Straight 80 -> 576 (length: 496px) at constant 175 px/s
      //   Takes exactly 496 / 175 = 2.834 seconds
      // - Segment 2: Straight 576 -> 700 (length: 124px) decelerating to 0 over 0.8 seconds
      //   Takes exactly 0.8 seconds (reaches 700 at 3.634 seconds)
      // - Segment 3: Rest at 700 (Approvals)
      if (t < 2.834) {
        x_bottom = 80 + v * t;
      } else if (t < 3.634) {
        const t_norm = (t - 2.834) / 0.8;
        const easeOut = 1 - Math.pow(1 - t_norm, 2); // smooth ease-out deceleration
        x_bottom = 576 + 124 * easeOut;
      } else {
        x_bottom = 700;
      }

      setTopPos({ x: x_top, y: y_top });
      setBottomPos({ x: x_bottom, y: y_bottom });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden" id="efficiency">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="section-inner relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Vector Workflow Chart (Borderless & Transparent) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="w-full relative min-h-[300px] flex items-center justify-center">
              
              {/* Responsive SVG Container */}
              <svg 
                viewBox="0 0 800 370" 
                className="w-full h-auto select-none"
                style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
              >
                {/* Defs for gradients & glows */}
                <defs>
                  {/* Glowing filter for the purple moving dots */}
                  <filter id="purple-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* ──────────────────────────────────────────────────────── */}
                {/* LANE 1: Manual Production (Traditional Timeline) */}
                {/* ──────────────────────────────────────────────────────── */}
                
                {/* Border Box around Title */}
                <rect x="80" y="22" width="180" height="28" rx="6" fill="none" stroke="#52525b" strokeWidth="1.5" />
                
                {/* Lane Title */}
                <text x="170" y="41" textAnchor="middle" className="text-[13px] sm:text-[14px] font-mono tracking-wider font-bold" fill="#e4e4e7">
                  Manual Production
                </text>

                {/* Main Timeline Line (Solid Blue) */}
                <line x1="80" y1="100" x2="700" y2="100" stroke="#0091ff" strokeWidth="3.5" strokeLinecap="round" />

                {/* Top Dotted Arc connecting Email Delivery and Review */}
                <path 
                  d="M 365 100 A 82.5 35 0 0 1 530 100" 
                  fill="none" 
                  stroke="#0091ff" 
                  strokeWidth="2.5" 
                  strokeDasharray="5,5" 
                  opacity="0.9" 
                />

                {/* Bottom Dotted Arc connecting Review and Email Delivery */}
                <path 
                  d="M 530 100 A 82.5 35 0 0 1 365 100" 
                  fill="none" 
                  stroke="#0091ff" 
                  strokeWidth="2.5" 
                  strokeDasharray="5,5" 
                  opacity="0.9" 
                />

                {/* Looping moving workflow pulse (Purple Glowing, driven by JS loop) */}
                <circle cx={topPos.x} cy={topPos.y} r="6" fill="#c084fc" filter="url(#purple-glow)" />

                {/* Top Timeline Static Nodes */}
                {topTimelineLabels.map((lbl, idx) => {
                  return (
                    <g key={idx}>
                      {/* Standard Node Circle */}
                      <circle 
                        cx={lbl.left} 
                        cy="100" 
                        r="6" 
                        fill="#ffffff" 
                        stroke="#0091ff" 
                        strokeWidth="3.5" 
                      />
                      {/* Label text */}
                      {lbl.isMulti && lbl.lines ? (
                        <text x={lbl.left} y="148" textAnchor="middle" className="font-medium" fill="#e4e4e7" style={{ fontSize: "12.5px" }}>
                          {lbl.lines.map((line, lIdx) => (
                            <tspan key={lIdx} x={lbl.left} dy={lIdx > 0 ? 15 : 0}>{line}</tspan>
                          ))}
                        </text>
                      ) : (
                        <text x={lbl.left} y="148" textAnchor="middle" className="font-medium" fill="#e4e4e7" style={{ fontSize: "12.5px" }}>
                          {lbl.text}
                        </text>
                      )}
                    </g>
                  );
                })}


                {/* ──────────────────────────────────────────────────────── */}
                {/* LANE 2: Our Workflow (Linear Approval Timeline) */}
                {/* ──────────────────────────────────────────────────────── */}
                
                {/* Border Box around Title */}
                <rect x="80" y="174" width="130" height="28" rx="6" fill="none" stroke="#a855f7" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(168,85,247,0.2))" }} />

                {/* Lane Title */}
                <text x="145" y="193" textAnchor="middle" className="text-[13px] sm:text-[14px] font-mono tracking-wider font-bold" fill="#a855f7">
                  Our Workflow
                </text>

                {/* Main Timeline Line (Solid Blue) */}
                <line x1="80" y1="250" x2="700" y2="250" stroke="#0091ff" strokeWidth="3.5" strokeLinecap="round" />

                {/* Fast linear workflow pulse (Purple Glowing, driven by JS loop) */}
                <circle cx={bottomPos.x} cy={bottomPos.y} r="6" fill="#c084fc" filter="url(#purple-glow)" />

                {/* Streamstellar static timeline nodes */}
                {bottomTimelineLabels.map((lbl, idx) => {
                  return (
                    <g key={idx}>
                      {/* Standard Node Circle */}
                      <circle 
                        cx={lbl.left} 
                        cy="250" 
                        r="6" 
                        fill="#ffffff" 
                        stroke="#0091ff" 
                        strokeWidth="3.5" 
                      />
                      {/* Label text */}
                      {lbl.isMulti && lbl.lines ? (
                        <text x={lbl.left} y="280" textAnchor="middle" className="font-medium" fill="#e4e4e7" style={{ fontSize: "12.5px" }}>
                          {lbl.lines.map((line, lIdx) => (
                            <tspan key={lIdx} x={lbl.left} dy={lIdx > 0 ? 15 : 0}>{line}</tspan>
                          ))}
                        </text>
                      ) : (
                        <text x={lbl.left} y="280" textAnchor="middle" className="font-medium" fill="#e4e4e7" style={{ fontSize: "12.5px" }}>
                          {lbl.text}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
          
          {/* Right Column: Text Content (order-1 on mobile, order-2 on desktop) */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <h2 className="section-heading text-left text-white leading-tight font-bold" style={{ fontSize: "clamp(30px, 3.8vw, 42px)" }}>
              Virtually Proofing <br className="hidden sm:inline" />
              inhouse End-to-End Tool
            </h2>
            <p className="text-zinc-400 text-[15px] sm:text-[16px] leading-relaxed max-w-md">
              Significantly shorten the time for your virtual digital twin approvals, with our inhouse made Proofing tool.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
