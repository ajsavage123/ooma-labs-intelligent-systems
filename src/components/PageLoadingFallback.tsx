import React from "react";
import { OomaLogoGlyph } from "./OomaLogo";
import { AppleSpinner } from "./AppleSpinner";

export const PageLoadingFallback: React.FC = () => {
  return (
    <div className="min-h-[100dvh] w-full bg-[#050505] text-white flex items-center justify-center p-6 select-none">
      <AppleSpinner size={24} color="rgba(255,255,255,0.88)" label="Loading" />
    </div>
  );
};

export default PageLoadingFallback;
