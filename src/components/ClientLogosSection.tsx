import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const platforms = [
  {
    name: "Google Business",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    )
  },
  {
    name: "Clutch",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 19C16.343 20.657 14.243 21.5 12 21.5C6.753 21.5 2.5 17.247 2.5 12C2.5 6.753 6.753 2.5 12 2.5C14.243 2.5 16.343 3.343 18 5" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="19" cy="19" r="3" fill="#E23028"/>
      </svg>
    )
  },
  {
    name: "Microsoft",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022"/>
        <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00"/>
        <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF"/>
        <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900"/>
      </svg>
    )
  },
  {
    name: "Razorpay",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2H2v20h20V2z" fill="#02042B"/>
        <path d="M15.42 16.32H11.5L12.55 7.68h3.92c2.13 0 2.96 1.02 2.96 2.3 0 1.53-1.13 2.44-2.8 2.44h-3.04l-.84 3.9z" fill="#3395FF"/>
      </svg>
    )
  },
  {
    name: "Stripe",
    svg: (
      <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16z" fill="#635BFF"/>
        <path d="M14.54 21.758c-3.554 0-6.17-1.173-8.083-2.617l1.458-3.66c1.68 1.258 3.75 2.158 5.922 2.158 2.378 0 3.32-.82 3.32-1.895 0-2.825-9.822-1.32-9.822-7.25 0-2.73 2.38-5.3 7.39-5.3 3.1 0 5.46.94 7.15 2.14l-1.39 3.65c-1.39-1.02-3.32-1.8-5.48-1.8-1.95 0-3.03.88-3.03 1.83.02 2.85 9.8 1.2 9.8 7.34.02 2.92-2.36 5.4-7.25 5.4z" fill="#fff"/>
      </svg>
    )
  },
  {
    name: "GitHub",
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .08 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
      </svg>
    )
  },
  {
    name: "Twilio",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#F22F46" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 13.8c-1 1-2.6 1-3.6 0l-3.6-3.6c-1-1-1-2.6 0-3.6 1-1 2.6-1 3.6 0l3.6 3.6c1 1 1 2.6 0 3.6zM13 13H8v-2h5v2z"/>
        <path fill="white" d="M12 15.1c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1zm0-4.8c-.9 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7 1.7-.8 1.7-1.7-.8-1.7-1.7-1.7z"/>
      </svg>
    )
  },
  {
    name: "Vercel",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L24 22H0L12 1Z"/>
      </svg>
    )
  }
];

const ClientLogosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-14 md:py-16 bg-[#050505] relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/30 font-bold mb-10"
        >
          Technology Partnerships
        </motion.p>

        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 md:gap-24 items-center w-max"
          >
            {/* Double the array for infinite seamless scrolling */}
            {[...platforms, ...platforms, ...platforms].map((platform, i) => (
              <div
                key={i}
                className="flex items-center gap-4 group/client cursor-default transition-transform duration-300 hover:scale-105"
              >
                {platform.svg}
                <span className={`text-xl md:text-2xl font-display font-bold tracking-tight text-white`}>
                  {platform.name}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Edge fades for dark mode */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default ClientLogosSection;
