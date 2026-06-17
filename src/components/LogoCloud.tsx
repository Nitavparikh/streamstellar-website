"use client";

import Image from "next/image";

const platforms = [
  { name: "Shopify", src: "/platforms/shopify.png", width: 120, height: 40, isPng: true },
  { name: "Amazon", src: "/platforms/amazon.png", width: 100, height: 32, isPng: true },
  { name: "Wayfair", src: "/platforms/wayfair.png", width: 110, height: 35, isPng: true },
  { name: "BigCommerce", src: "/platforms/bigcommerce.png", width: 140, height: 40, isPng: true },
  { name: "Lowe's", src: "/platforms/lowes.png", width: 90, height: 35, isPng: true },
];

const TargetLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 md:h-10 w-auto text-white" aria-label="Target logo">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm0-3a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0-3a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
    />
  </svg>
);

const IkeaLogo = () => (
  <svg viewBox="0 0 90 35" fill="currentColor" className="h-8 md:h-10 w-auto text-white" aria-label="Ikea logo">
    <rect width="90" height="35" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <ellipse cx="45" cy="17.5" rx="40" ry="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <text
      x="45"
      y="23.5"
      fontFamily="'Outfit', 'Helvetica Neue', Arial, sans-serif"
      fontWeight="900"
      fontSize="16"
      letterSpacing="1"
      textAnchor="middle"
      fill="currentColor"
    >
      IKEA
    </text>
  </svg>
);

const allLogos = [
  { name: "Shopify", src: "/platforms/shopify.png", width: 120, height: 40, isPng: true },
  { name: "Amazon", src: "/platforms/amazon.png", width: 100, height: 32, isPng: true },
  { name: "Wayfair", src: "/platforms/wayfair.png", width: 110, height: 35, isPng: true },
  { name: "BigCommerce", src: "/platforms/bigcommerce.png", width: 140, height: 40, isPng: true },
  { name: "Lowe's", src: "/platforms/lowes.png", width: 90, height: 35, isPng: true },
  { name: "Target", isSvg: true },
  { name: "Ikea", isSvg: true },
];

export function LogoCloud() {
  return (
    <section className="services-section" style={{ borderTop: "1px solid var(--border)", padding: "100px 0" }}>
      <div className="section-inner">
        <div className="section-header-centered" style={{ marginBottom: "56px" }}>
          <span className="eyebrow">Compatibility</span>
          <h2 className="section-heading">Create a digital twin once. Deploy everywhere.</h2>
          <p className="section-body">
            Our 3D models are optimized to be compatible with various platforms and built for modern commerce.
          </p>
        </div>

        <div className="logo-marquee-container">
          <div className="logo-marquee-track">
            {[...allLogos, ...allLogos].map((logo, idx) => (
              <div
                key={idx}
                className="logo-marquee-item"
              >
                {logo.isPng ? (
                  <Image
                    src={logo.src!}
                    alt={`${logo.name} compatibility logo`}
                    width={logo.width}
                    height={logo.height}
                    className="h-8 md:h-10 w-auto object-contain brightness-0 invert"
                    priority
                  />
                ) : logo.name === "Target" ? (
                  <TargetLogo />
                ) : (
                  <IkeaLogo />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
