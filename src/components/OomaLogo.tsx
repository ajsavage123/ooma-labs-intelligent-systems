import React from "react";
import { Link } from "react-router-dom";

export interface OomaLogoProps {
  /** "dark" = for dark backgrounds (white text), "light" = for light backgrounds (slate-900 text) */
  variant?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg";
  subtitle?: string;
  showSubtitle?: boolean;
  className?: string;
  glyphOnly?: boolean;
  linkTo?: string;
}

export const OomaLogoGlyph: React.FC<{
  className?: string;
  strokeColor?: string;
  sizeClass?: string;
  bgTile?: boolean;
}> = ({
  className = "",
  strokeColor = "#FFD700",
  sizeClass = "w-7 h-7",
}) => {
  return (
    <div className={`relative ${sizeClass} flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full fill-none stroke-[5] transition-transform duration-300 group-hover:scale-110"
        style={{ stroke: strokeColor, strokeLinecap: "round" }}
      >
        <path d="M 35 15 A 40 40 0 1 1 20 35" />
      </svg>
    </div>
  );
};

export const OomaLogo: React.FC<OomaLogoProps> = ({
  variant = "light",
  size = "md",
  subtitle = "CLIENT WORKSPACE",
  showSubtitle = true,
  className = "",
  glyphOnly = false,
  linkTo,
}) => {
  const isLight = variant === "light";

  const sizeConfig = {
    xs: {
      glyph: "w-5 h-5",
      title: "text-xs tracking-[0.2em]",
      sub: "text-[6px] tracking-[0.35em]",
    },
    sm: {
      glyph: "w-6 h-6",
      title: "text-[12px] sm:text-xs tracking-[0.22em]",
      sub: "text-[7px] tracking-[0.35em]",
    },
    md: {
      glyph: "w-7 h-7 sm:w-8 sm:h-8",
      title: "text-xs sm:text-sm tracking-[0.25em]",
      sub: "text-[7px] sm:text-[8px] tracking-[0.35em]",
    },
    lg: {
      glyph: "w-9 h-9 sm:w-10 sm:h-10",
      title: "text-sm sm:text-base tracking-[0.3em]",
      sub: "text-[8px] sm:text-[9px] tracking-[0.4em]",
    },
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Signature OOMA Golden Arc Glyph - exact logo, no background */}
      <OomaLogoGlyph
        sizeClass={sizeConfig.glyph}
        strokeColor="#FFD700"
      />

      {/* Brand Name & Subtitle */}
      {!glyphOnly && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-semibold uppercase tracking-[0.14em] font-display ${sizeConfig.title} ${
              isLight ? "text-slate-900" : "text-white"
            } transition-colors group-hover:text-blue-600`}
          >
            OOMA LABS
          </span>
            {showSubtitle && (
              <span
                className={`font-semibold uppercase mt-1 font-display ${sizeConfig.sub} tracking-[0.4em] ${
                  isLight ? "text-slate-500" : "text-white/80"
                }`}
              >
                {subtitle}
              </span>
            )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};

export default OomaLogo;

