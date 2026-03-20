import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import rakshith360 from "@/assets/rakshith360.jpg";
import medexpert from "@/assets/medexpert.jpg";
import codebluer from "@/assets/codebluer.jpg";

const staticProducts = [
  {
    name: "Rakshith 360",
    tagline: "Emergency Coordination Platform",
    description: "Ensuring patients and ambulances reach the right hospital with the right resources at the right time.",
    color: "text-[#EA4335]",
    border: "group-hover:border-[#EA4335]/40",
    bgHover: "group-hover:bg-[#EA4335]/5",
    image: rakshith360,
  },
  {
    name: "MedExpert",
    tagline: "Healthcare Workforce Coordination",
    description: "Connecting hospitals with skilled medical technicians for short-term and urgent requirements.",
    color: "text-[#34A853]",
    border: "group-hover:border-[#34A853]/40",
    bgHover: "group-hover:bg-[#34A853]/5",
    image: medexpert,
  },
  {
    name: "CodeBlueR",
    tagline: "Professional Community Platform",
    description: "A professional community for emergency response professionals to share knowledge and expand networking.",
    color: "text-[#4285F4]",
    border: "group-hover:border-[#4285F4]/40",
    bgHover: "group-hover:bg-[#4285F4]/5",
    image: codebluer,
  },
];

const ProductCard = ({ product, index }: { product: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group w-full flex flex-col md:flex-row gap-6 md:gap-8 items-center rounded-[2rem] sm:rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 p-5 sm:p-6 md:p-8 transition-all duration-500 hover:shadow-2xl ${product.border} ${product.bgHover}`}
    >
      <div className="w-full md:w-2/5 relative overflow-hidden aspect-[16/9] md:aspect-[4/3] rounded-xl sm:rounded-2xl shadow-2xl bg-[#111] border border-white/5 shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
             <div className="font-mono text-[10px] text-[#4285F4] opacity-50 mb-2">{`// internal system`}</div>
             <div className="font-mono text-xs text-[#4285F4] font-bold">System Online</div>
          </div>
        )}
      </div>

      <div className="w-full md:w-3/5 flex flex-col py-2">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3 font-display">{product.name}</h3>
        <p className={`text-[10px] sm:text-sm font-bold tracking-widest uppercase mb-4 md:mb-6 ${product.color}`}>{product.tagline}</p>
        <p className="text-white/60 text-sm sm:text-lg leading-relaxed mb-6 md:mb-8">
          {product.description}
        </p>
        
        <button className={`mt-auto align-self-start px-5 py-2.5 sm:px-6 sm:py-3 w-fit border border-white/10 rounded-xl text-white font-bold text-[10px] sm:text-sm bg-white/5 hover:bg-white/10 transition-colors uppercase tracking-widest`}>
          Explore {product.name}
        </button>
      </div>
    </motion.div>
  );
};

const ProductSection = () => {
  return (
    <section id="products" className="py-16 md:py-32 bg-[#050505] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-24 text-center"
        >
          <span className="badge-google mb-6 inline-block">The Ecosystem</span>
          <h2 className="font-display font-bold text-responsive-h2 text-white mt-4 tracking-tighter">
            <span className="text-[#EA4335]">Launched</span> Products.
          </h2>
          <p className="text-responsive-body text-white/50 max-w-2xl mx-auto mt-6">
            We architect targeted interventions for critical coordination challenges.
          </p>
        </motion.div>

        {/* Vertical List View */}
        <div className="flex flex-col gap-6 md:gap-8 w-full">
          {staticProducts.map((product, i) => (
            <ProductCard key={product.name + i} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
