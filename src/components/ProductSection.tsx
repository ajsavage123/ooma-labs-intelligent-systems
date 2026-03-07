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
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
      className="border-t border-border/30 py-16 md:py-24"
    >
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 ${isReversed ? "" : ""}`}>
        {/* Number + text */}
        <div className={`lg:col-span-5 flex flex-col justify-between ${isReversed ? "lg:order-2" : ""}`}>
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-6xl md:text-8xl text-primary/20"
            >
              {product.num}
            </motion.span>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="counter-label mt-4 mb-3"
            >
              {product.tagline}
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mb-6"
            >
              {product.name}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-sm text-muted-foreground leading-relaxed max-w-md font-body"
            >
              {product.description}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-2 mt-8"
          >
            {product.features.map((f) => (
              <span key={f} className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground border border-border px-4 py-2">
                {f}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className={`lg:col-span-7 ${isReversed ? "lg:order-1" : ""}`}
        >
          <div className="relative overflow-hidden aspect-[16/10]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProductSection = () => {
  return (
    <section id="products" className="section-padding max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center gap-6 mb-4"
      >
        <span className="counter-label">Our Products</span>
        <div className="flex-1 line-accent" />
      </motion.div>

      {products.map((product, i) => (
        <ProductCard key={product.name} product={product} index={i} />
      ))}
    </section>
  );
};

export default ProductSection;
