import React from "react";
import { OomaLogoGlyph } from "./OomaLogo";
import { AppleSpinner } from "./AppleSpinner";

export const PageLoadingFallback: React.FC = () => {
  return (
    <div className="min-h-[100dvh] w-full bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
          <OomaLogoGlyph sizeClass="w-11 h-11 sm:w-12 sm:h-12" strokeColor="#FFFFFF" className="opacity-95" />
        </div>

        <AppleSpinner size={22} color="rgba(255,255,255,0.88)" label="Loading page" />

        <div className="text-[11px] sm:text-xs text-white/45 tracking-[0.02em] font-medium">
          Loading…
        </div>
      </div>
    </div>
  );
};

export default PageLoadingFallback;
