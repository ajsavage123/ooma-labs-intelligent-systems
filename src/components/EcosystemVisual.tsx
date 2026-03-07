import { motion } from "framer-motion";
import { Shield, Headphones, Users } from "lucide-react";

const products = [
  { name: "Rakshith 360", icon: Shield, color: "from-red-500/20 to-orange-500/20" },
  { name: "MedExpert", icon: Headphones, color: "from-blue-500/20 to-cyan-500/20" },
  { name: "CodeBlueR", icon: Users, color: "from-indigo-500/20 to-purple-500/20" },
];

export const EcosystemVisual = () => {
  return (
    <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* Central Hub */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="relative z-20 w-24 h-24 rounded-full glass-dark flex items-center justify-center border-primary/40 glow-border"
      >
        <div className="w-12 h-12 bg-primary/20 rounded-full blur-xl animate-pulse absolute" />
        <span className="font-serif text-primary text-xl relative z-10">Ooma</span>
      </motion.div>

      {/* Orbiting Products */}
      {products.map((product, i) => {
        const angle = (i * 360) / products.length;
        const radius = 100;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <div key={product.name} className="absolute inset-0 flex items-center justify-center">
            {/* Connection Line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: radius, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
              style={{
                rotate: angle,
                transformOrigin: "left center",
                left: "calc(50% + 0px)",
              }}
              className="h-px bg-gradient-to-r from-primary to-transparent"
            />

            {/* Product Node */}
            <motion.div
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1, x, y }}
              transition={{
                duration: 1,
                delay: 1 + i * 0.2,
                type: "spring",
                stiffness: 50,
              }}
              className="absolute z-30"
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl glass border-white/10 flex items-center justify-center shadow-2xl transition-transform hover:scale-110`}>
                  <product.icon className="w-5 h-5 text-white/70" />
                </div>
                <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground whitespace-nowrap">
                  {product.name}
                </span>
              </div>
            </motion.div>
          </div>
        );
      })}

      {/* Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2, delay: ring * 0.3 }}
            style={{ width: ring * 120, height: ring * 120 }}
            className="border border-white/10 rounded-full absolute"
          />
        ))}
      </div>
    </div>
  );
};
