import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import rakshith360 from "@/assets/rakshith360.jpg";
import medexpert from "@/assets/medexpert.jpg";
import codebluer from "@/assets/codebluer.jpg";

const products = [
  {
    name: "Rakshith 360",
    tagline: "Emergency Coordination Platform",
    description: "Ensuring patients and ambulances reach the right hospital with the right resources at the right time.",
    features: ["Ambulance Routing System", "Hospital Network Coordination", "AI Emergency Decision Support"],
    image: rakshith360,
    gradient: "from-primary/20 to-accent/10",
  },
  {
    name: "MedExpert",
    tagline: "Healthcare Workforce Coordination",
    description: "Connecting hospitals with skilled medical technicians for short-term and urgent requirements.",
    features: ["Platform Dashboard", "Hospital Staffing Coordination", "Healthcare Professional Network"],
    image: medexpert,
    gradient: "from-accent/20 to-neon/10",
  },
  {
    name: "CodeBlueR",
    tagline: "Professional Community Platform",
    description: "A professional community for emergency response professionals to share knowledge, expand networking, discuss challenges, and support career development.",
    features: ["Community Discussions", "Knowledge Sharing", "Career Insights"],
    image: codebluer,
    gradient: "from-neon/10 to-primary/20",
  },
];

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 md:py-32"
    >
      <div className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}>
        {/* Text */}
        <div className="flex-1 space-y-6">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm uppercase tracking-[0.3em] text-accent font-medium"
          >
            {product.tagline}
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display"
          >
            {product.name}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-lg"
          >
            {product.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-3 pt-4"
          >
            {product.features.map((feature) => (
              <span
                key={feature}
                className="glass-card px-4 py-2 text-sm text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 w-full"
        >
          <div className="relative rounded-2xl overflow-hidden glow-border">
            <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} z-10 pointer-events-none`} />
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-2xl"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProductSection = () => {
  return (
    <section id="products" className="section-padding max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm uppercase tracking-[0.3em] text-accent mb-4"
        >
          Our Products
        </motion.p>
      </div>
      {products.map((product, i) => (
        <ProductCard key={product.name} product={product} index={i} />
      ))}
    </section>
  );
};

export default ProductSection;
