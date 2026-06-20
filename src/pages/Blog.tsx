import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Bell, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Blog = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're on the list!", {
      description: "We'll notify you when our blog launches.",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#4285F4]/30 selection:text-white">
      <Navbar onOpenPartner={() => navigate("/partnership")} />

      <div className="pt-28 md:pt-40 pb-24 md:pb-32 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 bg-[#4285F4]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10"
            >
              <BookOpen className="w-12 h-12 text-[#4285F4]" />
            </motion.div>

            {/* Badge */}
            <span className="badge-google mb-6 inline-block">Coming Soon</span>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white font-display tracking-tighter mt-4 mb-6">
              Ooma <span className="text-gradient-google">Insights</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/50 leading-relaxed mb-12 max-w-lg mx-auto">
              We're crafting articles on technology, engineering best practices, startup strategies, and the future of AI-driven business solutions.
            </p>

            {/* Notify form */}
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#4285F4]/50 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#4285F4] hover:bg-[#4285F4]/90 text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Notify Me
              </button>
            </form>

            {/* Back to home */}
            <a
              href="/"
              className="inline-flex items-center gap-2 text-white/30 hover:text-white text-sm font-bold tracking-wider uppercase transition-colors group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
