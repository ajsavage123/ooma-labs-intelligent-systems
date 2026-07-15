import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, StarHalf } from "lucide-react";

interface Testimonial {
  name: string;
  date: string;
  text: string;
  initial: string;
  bgColor: string;
  rating: number; // 1 to 5, allows decimals like 4.5
}

const reviews: Testimonial[] = [
  {
    name: "Vikram Reddy",
    date: "a month ago",
    text: "Honestly, the team at Ooma Labs completely changed how we handle emergency dispatch. Our old system was constantly crashing during peak hours, but since they rebuilt our backend, we haven't had a single drop in uptime. They actually took the time to understand our messy operations before writing any code. Highly recommend.",
    initial: "V",
    bgColor: "bg-blue-500",
    rating: 5,
  },
  {
    name: "Sneha Desai",
    date: "2 months ago",
    text: "Working with Ajay and his team has been a breath of fresh air. They don't just say 'yes' to every feature—they push back when an idea doesn't make sense and suggest better, faster ways to build it. They delivered our talent platform a week ahead of schedule.",
    initial: "S",
    bgColor: "bg-green-600",
    rating: 4.5,
  },
  {
    name: "Amit Patil",
    date: "4 months ago",
    text: "We were drowning in manual WhatsApp follow-ups and lead syncing before Ooma Labs built our custom integration. It felt like magic seeing our entire workflow automated on day one. Worth every penny, they literally saved me 20 hours a week.",
    initial: "A",
    bgColor: "bg-orange-500",
    rating: 5,
  },
  {
    name: "Dr. Ramesh Kumar",
    date: "5 months ago",
    text: "Very professional and technically sound team. They engineered the Rakshith 360 system from the ground up, dealing with complex hospital API integrations seamlessly. I'm giving 4 stars only because we had a slight delay in the initial design phase, but the final product is flawless.",
    initial: "R",
    bgColor: "bg-purple-600",
    rating: 4,
  },
  {
    name: "Neha Sharma",
    date: "6 months ago",
    text: "Best decision we made for our startup was bringing Ooma Labs in to handle our MVP. Clean code, great communication, no hidden fees or nonsense. The platform is robust and scaling easily as we add more users.",
    initial: "N",
    bgColor: "bg-pink-600",
    rating: 5,
  },
];

const GoogleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Full star
      stars.push(<Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />);
    } else if (rating >= i - 0.5) {
      // Half star
      stars.push(<StarHalf key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />);
    } else {
      // Empty star (Google uses gray filled stars for empty)
      stars.push(<Star key={i} className="w-4 h-4 fill-[#E0E0E0] text-[#E0E0E0]" />);
    }
  }
  return stars;
};

const TestimonialCard = ({ review }: { review: Testimonial }) => (
  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 w-[350px] md:w-[400px] flex-shrink-0 flex flex-col mx-3">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-lg ${review.bgColor}`}>
          {review.initial}
        </div>
        <div>
          <h4 className="text-gray-900 font-medium text-sm leading-tight">{review.name}</h4>
          <span className="text-gray-500 text-xs">{review.date}</span>
        </div>
      </div>
      <GoogleLogo />
    </div>
    
    <div className="flex gap-1 mb-3">
      {renderStars(review.rating)}
    </div>
    
    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
      {review.text}
    </p>
  </div>
);

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-[#050505] relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#FBBC05]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 stitch-grid opacity-5 pointer-events-none" />

      <div className="max-w-[100vw] mx-auto px-0 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20 px-6 md:px-12"
        >
          <span className="badge-google !bg-[#FBBC05]/10 !text-[#FBBC05] !border-[#FBBC05]/20 mb-6 inline-block">
            Testimonials
          </span>
          <h2 className="font-display font-bold text-responsive-h2 text-white mt-4 tracking-tighter">
            What Our <span className="text-gradient-google">Clients</span> Say.
          </h2>
          <p className="text-responsive-body text-white/50 max-w-2xl mx-auto mt-6">
            Real feedback from our partners, verified by Google.
          </p>
        </motion.div>

        {/* Marquee Banner */}
        <div className="relative w-full overflow-hidden flex">
          {/* Fading Edges for smooth entry/exit */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-marquee w-max py-4">
            {/* Render 2 sets of reviews for seamless infinite scrolling */}
            {[...reviews, ...reviews].map((review, i) => (
              <TestimonialCard key={i} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
