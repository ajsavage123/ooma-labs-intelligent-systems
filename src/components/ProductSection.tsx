import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import rakshith360 from "@/assets/rakshith360.jpg";
import medexpert from "@/assets/medexpert.jpg";
import codebluer from "@/assets/codebluer.jpg";

const products = [
  {
    num: "01",
    name: "Rakshith 360",
    tagline: "Emergency Coordination Platform",
    description: "Ensuring patients and ambulances reach the right hospital with the right resources at the right time.",
    features: ["Ambulance Routing", "Hospital Network", "AI Decision Support"],
    image: rakshith360,
  },
  {
    num: "02",
    name: "MedExpert",
    tagline: "Healthcare Workforce Coordination",
    description: "Connecting hospitals with skilled medical technicians for short-term and urgent requirements.",
    features: ["Platform Dashboard", "Staffing Coordination", "Professional Network"],
    image: medexpert,
  },
  {
    num: "03",
    name: "CodeBlueR",
    tagline: "Professional Community Platform",
    description: "A professional community for emergency response professionals to share knowledge, expand networking, and support career development.",
    features: ["Community Discussions", "Knowledge Sharing", "Career Insights"],
    image: codebluer,
  },
];

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
      className="editorial-card group relative mb-12 p-8 md:p-12 rounded-[2rem] glass"
    >
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center`}>
        {/* Number + text */}
        <div className={`lg:col-span-5 flex flex-col justify-center ${isReversed ? "lg:order-2" : ""}`}>
          <div>
            <div className="flex items-center gap-4 mb-6">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8 }}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-primary/30 text-primary font-serif text-xl"
              >
                {product.num}
              </motion.span>
              <div className="h-px w-12 bg-primary/30" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-medium">An Ooma Labs Product</span>
            </div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-5xl md:text-6xl tracking-tighter text-gradient mb-6"
            >
              {product.name}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="counter-label text-primary/80 mb-4"
            >
              {product.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm text-foreground/70 leading-relaxed max-w-md font-body mb-8"
            >
              {product.description}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {product.features.map((f) => (
              <span key={f} className="text-[10px] tracking-[0.1em] uppercase text-foreground/60 glass px-4 py-2 rounded-full border-white/5 group-hover:border-primary/20 transition-colors">
                {f}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.1 }}
          className={`lg:col-span-7 ${isReversed ? "lg:order-1" : ""}`}
        >
          <div className="relative overflow-hidden aspect-[16/10] rounded-[1.5rem] shadow-2xl glow-border">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProductSection = () => {
  return (
    <section id="products" className="section-padding max-w-[1400px] mx-auto py-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-20 text-center"
      >
        <span className="counter-label mb-4">The Intelligent Core</span>
        <h2 className="font-serif text-5xl md:text-7xl text-gradient mb-6">Our Ecosystem</h2>
        <div className="w-24 h-px bg-primary/40" />
      </motion.div>

      <div className="space-y-12">
        {products.map((product, i) => (
          <ProductCard key={product.name} product={product} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
