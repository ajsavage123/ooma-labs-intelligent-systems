import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import rakshith360 from "@/assets/rakshith360.jpg";
import medexpert from "@/assets/medexpert.jpg";
import codebluer from "@/assets/codebluer.jpg";

// static featured products that are always shown
const staticProducts = [
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


interface ProductItem {
  num: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  image?: string;
}

const ProductCard = ({ product, index }: { product: ProductItem; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="group relative rounded-lg overflow-hidden transition-all duration-500 hover:shadow-xl"
    >
      {/* Card Container */}
      <div className="glass p-6 h-full flex flex-col">
        {/* Header with number */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-block w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center text-primary text-sm font-serif mb-3">
              {product.num}
            </span>
            <h3 className="text-xl font-serif text-foreground font-bold">{product.name}</h3>
          </div>
        </div>

        {/* Image - Compact */}
        {product.image && (
          <div className="relative overflow-hidden aspect-[16/10] rounded-lg mb-4 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}

        {/* Tagline */}
        <p className="text-sm text-primary/80 font-medium mb-2">{product.tagline}</p>

        {/* Description */}
        <p className="text-xs text-foreground/70 leading-relaxed mb-4 flex-grow">
          {product.description}
        </p>

        {/* Features - Compact */}
        <div className="flex flex-wrap gap-2">
          {product.features.slice(0, 2).map((f) => (
            <span key={f} className="text-[10px] tracking-widest uppercase text-foreground/60 border border-border/50 px-2 py-1 rounded group-hover:border-primary/30 transition-colors">
              {f}
            </span>
          ))}
          {product.features.length > 2 && (
            <span className="text-[10px] tracking-widest uppercase text-foreground/60 border border-border/50 px-2 py-1 rounded">
              +{product.features.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProductSection = () => {
  // Only show static products - no dynamic products from state
  const productsToShow = staticProducts;

  return (
    <section id="products" className="py-16 px-6 md:px-10 bg-background">
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs tracking-widest uppercase text-primary/60 font-medium">Featured Products</span>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-2">Our Ecosystem</h2>
          <div className="flex gap-4 items-center mt-4">
            <div className="h-px w-12 bg-primary/40" />
            <p className="text-sm text-foreground/60">Specialized platforms solving critical operational gaps</p>
          </div>
        </motion.div>

        {/* Product Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsToShow.map((product, i) => (
            <ProductCard key={product.name + i} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
