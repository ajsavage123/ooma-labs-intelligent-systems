import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  color: string;
  accentBg: string;
  accentText: string;
  cardStyle: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Ooma Labs built the entire Rakshith 360 AI emergency medical system. The real-time hospital dashboard and ambulance dispatch coordination works flawlessly in critical scenarios.",
    name: "Dr. Ramesh Kumar",
    role: "Emergency Operations Director",
    company: "Rakshith Emergency Services",
    rating: 5,
    color: "border-[#EA4335]/25 hover:border-[#EA4335]/50",
    accentBg: "bg-[#EA4335]/10",
    accentText: "text-[#EA4335]",
    cardStyle: "from-[#EA4335]/10 via-[#EA4335]/3 to-[#EA4335]/0 hover:shadow-[0_0_40px_rgba(234,67,53,0.12)]",
  },
  {
    quote: "With MedExpert, Ooma Labs created a robust medical professional recruitment ecosystem. The system connects healthcare centers with talent securely and efficiently.",
    name: "Sarah D'Souza",
    role: "Talent Acquisition Head",
    company: "MedExpert Network",
    rating: 5,
    color: "border-[#34A853]/25 hover:border-[#34A853]/50",
    accentBg: "bg-[#34A853]/10",
    accentText: "text-[#34A853]",
    cardStyle: "from-[#34A853]/10 via-[#34A853]/3 to-[#34A853]/0 hover:shadow-[0_0_40px_rgba(52,168,83,0.12)]",
  },
  {
    quote: "The CodeBlueR network has become a vital node for global responder intelligence. Ooma's engineering enabled seamless practitioner coordination at scale.",
    name: "Vikram Malhotra",
    role: "First Responder Coordinator",
    company: "CodeBlueR Community",
    rating: 5,
    color: "border-[#4285F4]/25 hover:border-[#4285F4]/50",
    accentBg: "bg-[#4285F4]/10",
    accentText: "text-[#4285F4]",
    cardStyle: "from-[#4285F4]/10 via-[#4285F4]/3 to-[#4285F4]/0 hover:shadow-[0_0_40px_rgba(66,133,244,0.12)]",
  },
  {
    quote: "We automated our entire lead sync and WhatsApp follow-up operations using Ooma's custom integration tools. Manual work went down by 80% in the first two weeks.",
    name: "Amit Patil",
    role: "Founder & CEO",
    company: "Aura Commerce Agency",
    rating: 5,
    color: "border-[#FBBC05]/25 hover:border-[#FBBC05]/50",
    accentBg: "bg-[#FBBC05]/10",
    accentText: "text-[#FBBC05]",
    cardStyle: "from-[#FBBC05]/10 via-[#FBBC05]/3 to-[#FBBC05]/0 hover:shadow-[0_0_40px_rgba(251,188,5,0.12)]",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-[#050505] relative overflow-hidden" ref={ref}>
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#FBBC05]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 stitch-grid opacity-5 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="badge-google !bg-[#FBBC05]/10 !text-[#FBBC05] !border-[#FBBC05]/20 mb-6 inline-block">
            Testimonials
          </span>
          <h2 className="font-display font-bold text-responsive-h2 text-white mt-4 tracking-tighter">
            What Our <span className="text-gradient-google">Clients</span> Say.
          </h2>
          <p className="text-responsive-body text-white/50 max-w-2xl mx-auto mt-6">
            Real feedback linked to active custom products engineered by Ooma Labs.
          </p>
        </motion.div>

        {/* Testimonial Grid (Clean 2-Column Balanced Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-6 md:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className={`group bg-gradient-to-b ${testimonial.cardStyle} border ${testimonial.color} rounded-[2rem] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden flex flex-col justify-between`}
            >
              <div>
                {/* Quote icon */}
                <div className={`w-12 h-12 ${testimonial.accentBg} rounded-2xl flex items-center justify-center mb-6`}>
                  <Quote className={`w-6 h-6 ${testimonial.accentText}`} />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 font-medium">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author info */}
              <div className="mt-auto border-t border-white/5 pt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${testimonial.accentBg} rounded-full flex items-center justify-center`}>
                    <span className={`text-lg font-bold ${testimonial.accentText}`}>
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{testimonial.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


