import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MessageCircle, Phone, Mail, Send, User, AtSign, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactOptions = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "9492827058",
      href: "https://wa.me/919492827058?text=Hi,%20I%20heard%20about%20your%20services%20and%20want%20to%20know%20more.",
      color: "text-[#25D366]",
      bg: "bg-[#25D366]/10"
    },
    {
      icon: Phone,
      label: "Direct Call",
      value: "9381167058",
      href: "tel:+919381167058",
      color: "text-[#4285F4]",
      bg: "bg-[#4285F4]/10"
    },
    {
      icon: Mail,
      label: "Official Gmail",
      value: "oomalabs@gmail.com",
      href: "mailto:oomalabs@gmail.com?body=hi%20i%20am%20looking%20for%20colabration%20in%20your%20company%20and%20my%20name%20is%20.....",
      color: "text-[#EA4335]",
      bg: "bg-[#EA4335]/10"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1200));

    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="connect" className="py-24 md:py-40 bg-[#050505] relative overflow-hidden" ref={ref}>
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#34A853]/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Grid lines */}
      <div className="absolute inset-0 stitch-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-7xl font-bold tracking-tighter text-white font-display mb-8 text-center"
        >
          Build Your <span className="text-gradient-google">Product</span> with us.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white/40 text-center max-w-xl mx-auto mb-16 md:mb-20"
        >
          Reach out through any channel or fill the form below — we'll get back to you within 24 hours.
        </motion.p>

        {/* Contact Icons */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-12 md:gap-20 mb-20 md:mb-24">
          {contactOptions.map((option, i) => (
            <motion.a
              key={i}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="group flex flex-col items-center gap-6 transition-all duration-300 transform"
            >
              {/* Icon Container with Floating Effect */}
              <div className={`relative w-20 h-20 md:w-24 md:h-24 ${option.bg} ${option.color} rounded-[2rem] flex items-center justify-center group-hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] group-hover:-translate-y-4 transition-all duration-500`}>
                <option.icon className="w-8 h-8 md:w-10 md:h-10" />
              </div>

              {/* Text Layout */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl md:text-2xl font-display font-bold text-white transition-colors duration-300 tracking-tight">
                  {option.label}
                </span>
                <span className="text-xs font-mono text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-widest font-bold">
                  {option.value}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#34A853]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#34A853]/10 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5 text-[#34A853]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Send us a message</h3>
                  <p className="text-white/30 text-xs mt-0.5">We reply within 24 hours</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="w-full pl-11 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#34A853]/50 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                      className="w-full pl-11 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#34A853]/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (optional)"
                    className="w-full pl-11 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#34A853]/50 transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    required
                    rows={4}
                    className="w-full pl-11 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#34A853]/50 transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#34A853] hover:bg-[#34A853]/90 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#34A853]/30 to-transparent" />
    </section>
  );
};

export default CTASection;
