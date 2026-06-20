import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, FileText, Send, Clock, Building, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Full address is required"),
  businessDetails: z.string().min(3, "Please describe your business details"),
  requirement: z.string().min(10, "Please describe your website requirements in detail (min 10 characters)"),
});

const ExitIntentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    // Check if user has visited before (returning/older user)
    const isReturningUser = localStorage.getItem("hasVisitedBefore");
    if (isReturningUser) {
      return; // Do not show the popup to returning users
    }

    const triggerModal = () => {
      setIsOpen(true);
      // Mark as returning user so they do not see the popup again on subsequent visits
      localStorage.setItem("hasVisitedBefore", "true");
    };

    // Trigger popup exactly 1 minute (60000 ms) after the user lands on the website
    const timer = setTimeout(() => {
      triggerModal();
    }, 60000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      businessDetails: "",
      requirement: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Generate pre-filled message format requested:
    // "hey i heard about your offer and here are my details {client details}"
    const formattedDetails = `\nName: ${values.fullName}\nPhone: ${values.phone}\nAddress: ${values.address}\nBusiness Details: ${values.businessDetails}\nRequirement: ${values.requirement}`;
    const text = `hey i heard about your offer and here are my details:${formattedDetails}`;
    
    // Redirect URL using the number from the WhatsApp Widget: 919492827058
    const whatsappUrl = `https://wa.me/919492827058?text=${encodeURIComponent(text)}`;
    
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    toast.success("Redirecting to WhatsApp to submit your request!");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl glass-dark border-white/10 p-0 overflow-y-auto max-h-[90vh] sm:rounded-[2.5rem] scrollbar-hide z-[100]">
        <div className="relative">
          {/* Subtle Google-colored top accent border */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />
          
          <div className="p-6 md:p-10">
            <DialogHeader className="mb-6 text-center">
              <div className="flex justify-center mb-3">
                <span className="badge-google !bg-[#4285F4]/10 !text-[#4285F4] !border-[#4285F4]/20 flex items-center gap-1.5 py-1 px-3 text-[10px] tracking-wider uppercase font-bold">
                  Special Promotion
                </span>
              </div>
              <DialogTitle className="font-serif text-3xl md:text-4xl text-gradient-google tracking-tight leading-tight">
                First-time Website Offer <br />
                <span className="text-white font-bold">Absolutely FREE!</span>
              </DialogTitle>
              <DialogDescription className="text-white/60 text-sm md:text-base mt-2">
                As a new client of Ooma Labs, we will build your first professional website for zero design and development cost. Claim this offer before the timer expires.
              </DialogDescription>
            </DialogHeader>

            {/* Subtle Countdown Timer */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-8 shadow-inner">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#FBBC05]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">Time Remaining to Claim:</span>
              </div>
              <span className={`text-2xl font-mono font-bold tracking-widest ${timeLeft < 60 ? 'text-red-500' : 'text-[#FBBC05]'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {timeLeft <= 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                <h4 className="text-lg font-bold text-white mb-1">Time's Up!</h4>
                <p className="text-white/60 text-sm max-w-xs">This specific promotion has expired. Stay tuned for future offers!</p>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="mt-5 rounded-full border-white/10 hover:border-[#FBBC05]/50 transition-all font-body text-xs tracking-widest uppercase"
                  variant="outline"
                >
                  Close Window
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">
                            <User className="w-3.5 h-3.5 text-[#4285F4]" /> Full Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} className="glass border-white/5 focus:border-[#4285F4]/50 transition-all rounded-xl py-5" />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Phone Number */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">
                            <Phone className="w-3.5 h-3.5 text-[#34A853]" /> Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Enter your phone/WhatsApp number" {...field} className="glass border-white/5 focus:border-[#34A853]/50 transition-all rounded-xl py-5" />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">
                            <MapPin className="w-3.5 h-3.5 text-[#EA4335]" /> Address
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city/address" {...field} className="glass border-white/5 focus:border-[#EA4335]/50 transition-all rounded-xl py-5" />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Business Details */}
                    <FormField
                      control={form.control}
                      name="businessDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">
                            <Building className="w-3.5 h-3.5 text-[#4285F4]" /> Business Details
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Describe your business (e.g. Retail store, SaaS company, Agency...)" {...field} className="glass border-white/5 focus:border-[#4285F4]/50 transition-all rounded-xl py-5" />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Website Requirement details */}
                    <FormField
                      control={form.control}
                      name="requirement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">
                            <FileText className="w-3.5 h-3.5 text-[#FBBC05]" /> Website Requirement Details
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the website you need (e.g. e-commerce, portfolio, landing page, features needed...)" 
                              {...field} 
                              className="glass border-white/5 focus:border-[#FBBC05]/50 transition-all rounded-xl min-h-[100px] resize-none"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-solid py-7 rounded-2xl group relative overflow-hidden bg-gradient-to-r from-[#34A853] to-[#25D366] text-white font-bold text-sm tracking-widest uppercase hover:brightness-110 shadow-lg shadow-green-500/20"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Claim via WhatsApp
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal;
