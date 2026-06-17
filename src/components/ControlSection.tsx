"use client";

import { useState } from "react";

import { SiteContainer } from "@/components/SiteContainer";

const tabs = [
  { id: "lighting", label: "Lighting studies" },
  { id: "materials", label: "Material passes" },
  { id: "delivery", label: "Delivery formats" },
];

export function ControlSection() {
  const [active, setActive] = useState("lighting");

  return (
    <section className="section-border py-24 lg:py-32">
      <SiteContainer>
        <div className="max-w-2xl">
          <h2 className="heading-serif text-4xl text-white lg:text-5xl">
            Everything in your control
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Review lighting, materials, and export settings at every stage —
            full visibility into your production without the back-and-forth.
          </p>
        </div>

        <div className="mt-12 flex gap-6 border-b border-border-subtle">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`pb-3 text-[13px] transition-colors ${
                active === tab.id ? "tab-active" : "text-muted hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated">
          <div className="grid h-72 place-items-center p-8 lg:h-96">
            <div className="w-full max-w-2xl">
              <div className="mb-6 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-white/10"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-muted">
                <span>Draft</span>
                <span>Review</span>
                <span>Final</span>
              </div>
            </div>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
