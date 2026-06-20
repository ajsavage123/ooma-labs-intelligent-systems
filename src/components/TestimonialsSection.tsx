import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Ooma Labs transformed our entire booking system. The custom solution they built reduced our manual work by 70% and our customers love the seamless experience.",
    name: "Priya Sharma",
    role: "Operations Head",
    company: "MedConnect Health",
    rating: 5,
    color: "border-[#4285F4]/20 hover:border-[#4285F4]/40",
    accentBg: "bg-[#4285F4]/10",
    accentText: "text-[#4285F4]",
  },
  {
    quote: "Working with Ajay and the Ooma team was a game-changer. They didn't just build an app — they understood our workflow and engineered something that actually works in the field.",
    name: "Vikram Reddy",
    role: "Founder & CEO",
    company: "QuickServ Logistics",
    rating: 5,
    color: "border-[#34A853]/20 hover:border-[#34A853]/40",
    accentBg: "bg-[#34A853]/10",
    accentText: "text-[#34A853]",
  },
  {
    quote: "The landing page they designed for our product launch was stunning. Conversion rates jumped by 45% in the first month. Their design sense is next-level.",
    name: "Ananya Kapoor",
    role: "Marketing Director",
    company: "Bloom Digital",
    rating: 5,
    color: "border-[#FBBC05]/20 hover:border-[#FBBC05]/40",
    accentBg: "bg-[#FBBC05]/10",
    accentText: "text-[#FBBC05]",
  },
  {
    quote: "From concept to deployment in 3 weeks — the speed and quality Ooma delivers is unmatched. They integrated AI chatbots into our support flow flawlessly.",
    name: "Rahul Menon",
    role: "CTO",
    company: "NexaBridge Solutions",
    rating: 5,
    color: "border-[#EA4335]/20 hover:border-[#EA4335]/40",
    accentBg: "bg-[#EA4335]/10",
    accentText: "text-[#EA4335]",
  },
  {
    quote: "We needed a custom CRM that fit our unique sales process. Ooma Labs built it from scratch, and it's the backbone of our operations now. Couldn't be happier.",
    name: "Deepa Nair",
    role: "Sales Manager",
    company: "UrbanNest Realty",
    rating: 5,
    color: "border-[#4285F4]/20 hover:border-[#4285F4]/40",
    accentBg: "bg-[#4285F4]/10",
    accentText: "text-[#4285F4]",
  },
  {
    quote: "Professional, responsive, and incredibly talented. Ooma Labs helped us automate our inventory management and we've saved countless hours every week.",
    name: "Karthik Iyer",
    role: "Business Owner",
    company: "FreshBasket Stores",
    rating: 5,
    color: "border-[#34A853]/20 hover:border-[#34A853]/40",
    accentBg: "bg-[#34A853]/10",
    accentText: "text-[#34A853]",
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
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
            Real feedback from businesses we've helped transform through technology.
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className={`group bg-[#0a0a0a] border ${testimonial.color} rounded-[2rem] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden`}
            >
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


