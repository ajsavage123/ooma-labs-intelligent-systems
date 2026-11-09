import React from "react";
import { OomaLogoGlyph } from "./OomaLogo";

export const PageLoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Center Spinner & Logo */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          {/* Exact Logo - No background */}
          <OomaLogoGlyph sizeClass="w-12 h-12" strokeColor="#FFD700" className="animate-pulse" />
          {/* Subtle Outer spinner */}
          <div className="absolute -inset-2 rounded-full border-2 border-transparent border-t-[#FFD700] border-r-amber-500/40 animate-spin" />
        </div>

        {/* Text indicators */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="text-xs font-semibold tracking-widest text-zinc-300 uppercase">
            OOMA LABS
          </div>
          <div className="text-[11px] text-zinc-500 tracking-wider">
            Loading client portal...
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoadingFallback;
