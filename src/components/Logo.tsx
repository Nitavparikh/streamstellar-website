import React from "react";

type LogoProps = {
  className?: string;
  variant?: "nav" | "footer";
};

export function Logo({ className = "", variant = "nav" }: LogoProps) {
  const size = variant === "nav" ? 36 : 22;
  const textSize = variant === "nav" ? "text-[23px]" : "text-[15px]";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {variant !== "nav" && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className="text-white shrink-0"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          <circle
            cx="12"
            cy="12"
            r="6"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="1.5 2.5"
            fill="none"
            opacity="0.75"
          />
          <circle cx="12" cy="6" r="1" fill="currentColor" />
          <circle cx="18" cy="12" r="0.75" fill="currentColor" />
          <circle cx="12" cy="18" r="1.2" fill="currentColor" />
          <circle cx="6" cy="12" r="1" fill="currentColor" />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="2 4"
            fill="none"
            opacity="0.45"
          />
          <circle cx="12" cy="2" r="1.5" fill="currentColor" />
          <circle cx="20.5" cy="7.5" r="1" fill="currentColor" />
          <circle cx="19" cy="17" r="1.5" fill="currentColor" />
          <circle cx="8" cy="21" r="1" fill="currentColor" />
          <circle cx="3" cy="15" r="1.2" fill="currentColor" />
          <circle cx="4.5" cy="8.5" r="0.75" fill="currentColor" />
        </svg>
      )}
      <span className={`font-serif ${textSize} font-normal tracking-tight text-white leading-none`}>
        StreamStellar
      </span>
    </div>
  );
}
