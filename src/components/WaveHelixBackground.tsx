import { motion } from "framer-motion";

const WaveHelixBackground = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Deep dark base layer */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Radiant atmospheric coral/red radial glows matching the wave's light source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[#FF3300]/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-[15%] -translate-y-1/2 w-[500px] h-[500px] bg-[#FF5522]/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-[10%] w-[400px] h-[400px] bg-[#991100]/20 blur-[120px] rounded-full pointer-events-none" />

      {/* The 3D Wave Helix Graphic with gentle breathing & floating animation */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          scale: [1, 1.025, 1],
          filter: [
            "drop-shadow(0 0 35px rgba(255,51,0,0.25)) brightness(1)",
            "drop-shadow(0 0 60px rgba(255,85,34,0.45)) brightness(1.1)",
            "drop-shadow(0 0 35px rgba(255,51,0,0.25)) brightness(1)"
          ]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <img
          src="/wave-helix.png"
          alt="3D Sinusoidal Disc Wave Helix"
          className="w-full h-full object-cover object-center max-w-none opacity-85 md:opacity-95 contrast-125 saturate-125 mix-blend-screen scale-105 md:scale-110 pointer-events-none"
        />
      </motion.div>

      {/* Subtle futuristic scan/shimmer light pass across the helix */}
      <motion.div
        animate={{
          x: ["-100%", "200%"],
          opacity: [0, 0.4, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 2
        }}
        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#FF6633]/15 to-transparent skew-x-12 pointer-events-none"
      />

      {/* Seamless edge blending to match the surrounding page */}
      <div className="absolute top-0 inset-x-0 h-32 md:h-44 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-32 md:h-44 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />
      <div className="absolute left-0 inset-y-0 w-24 md:w-48 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-24 md:w-48 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />

      {/* Soft center contrast mask so form inputs & text remain crystal clear */}
      <div className="absolute inset-0 bg-[#050505]/20 backdrop-blur-[0.5px] pointer-events-none" />
    </div>
  );
};

export default WaveHelixBackground;
