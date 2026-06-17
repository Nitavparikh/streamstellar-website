"use client";

import { SiteContainer } from "@/components/SiteContainer";

const quotes = [
  {
    text: "Stream Stellar transformed our catalog into cinematic product stories. The renders feel indistinguishable from photography — and convert better.",
    author: "Elena Vasquez",
    role: "Creative Director, Article",
  },
  {
    text: "Their furniture visualization workflow is unmatched. We launch collections faster with assets that look premium across every channel.",
    author: "Marcus Chen",
    role: "Head of Digital, West Elm",
  },
  {
    text: "The interactive 3D experiences they built for our site increased engagement dramatically. True partners, not just vendors.",
    author: "Priya Sharma",
    role: "VP Marketing, Casper",
  },
  {
    text: "From CGI to AR, Stream Stellar delivers work that elevates our brand. The attention to material detail is extraordinary.",
    author: "James Okonkwo",
    role: "Brand Lead, Floyd",
  },
  {
    text: "We needed photoreal renders at scale — they nailed it. Fast turnaround, consistent quality, and a team that gets design.",
    author: "Sofia Lindström",
    role: "E-commerce Director, Moooi",
  },
];

export function Testimonials() {
  return (
    <section className="services-section" style={{ borderTop: "1px solid var(--border)", paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="section-inner">
        <div className="section-header-centered" style={{ marginBottom: "56px" }}>
          <span className="eyebrow">Beyond expectations</span>
          <h2 className="section-heading">Client Success</h2>
          <p className="section-body">
            Stream Stellar partners with brands to create visual experiences that drive discovery, desire, and conversion.
          </p>
        </div>

        <div className="relative overflow-hidden w-full flex">
          <div className="flex w-max gap-6" style={{ animation: "marquee 45s linear infinite" }}>
            {[...quotes, ...quotes].map((q, i) => (
              <blockquote
                key={`${q.author}-${i}`}
                className="w-[340px] shrink-0 p-6 flex flex-col justify-between"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--panel-bg)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderRadius: "16px",
                }}
              >
                <p className="text-[13.5px] leading-relaxed text-zinc-300">
                  &ldquo;{q.text}&rdquo;
                </p>
                <footer className="mt-6 border-t border-white/5 pt-4">
                  <p className="text-[13px] font-semibold text-white">{q.author}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{q.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
