import React from "react";

export const PageLoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Center Spinner & Logo */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          {/* Pulsing ring */}
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <span className="text-blue-400 font-black text-sm tracking-widest">OL</span>
          </div>
          
          {/* Outer spinner */}
          <div className="absolute -inset-2 rounded-2xl border-2 border-transparent border-t-blue-500 border-r-blue-400/50 animate-spin" />
        </div>

        {/* Text indicators */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="text-xs font-semibold tracking-widest text-zinc-300 uppercase">
            OOMA LABS
          </div>
          <div className="text-[11px] text-zinc-500 tracking-wider">
            Loading project dashboard...
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoadingFallback;
