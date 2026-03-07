import React, { useState } from "react";
import emailjs from "@emailjs/browser";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Send, Globe, Briefcase, User, Phone, MapPin, Linkedin } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  location: z.string().min(2, "City / Country is required"),
  profession: z.string().min(2, "Current profession is required"),
  expertise: z.string().min(2, "Area of expertise is required"),
  linkedin: z.string().url("Valid LinkedIn URL is required").or(z.literal("")),
  interest: z.string().min(1, "Please select an area of interest"),
});

interface PartnerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PartnerModal = ({ isOpen, onOpenChange }: PartnerModalProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      profession: "",
      expertise: "",
      linkedin: "",
      interest: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      console.log("Submitting form...", { serviceId, templateId });

      if (!serviceId || serviceId === "service_id_placeholder") {
        console.warn("EmailJS configuration missing in .env");
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        emailjs.init(publicKey);
        await emailjs.send(
          serviceId,
          templateId,
          {
            ...values,
            to_email: "oomalabs@gmail.com",
          }
        );
      }

      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
      
      setTimeout(() => {
        onOpenChange(false);
        setTimeout(() => {
          setIsSubmitted(false);
          form.reset();
        }, 500);
      }, 5000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send application. Please try again later.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-dark border-white/10 p-0 overflow-y-auto max-h-[90vh] sm:rounded-[2rem] custom-scrollbar">
        <div className="relative">
          {/* Decorative background for the modal */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
          
          <div className="p-6 md:p-12">
            {!isSubmitted ? (
              <>
                <DialogHeader className="mb-8">
                  <DialogTitle className="font-serif text-4xl md:text-5xl tracking-tighter text-gradient">
                    Partner with <em className="text-primary italic">AN</em>
                  </DialogTitle>
                  <DialogDescription className="text-foreground/60 text-sm md:text-base mt-2">
                    Join the Ooma Labs intelligence ecosystem as a strategic collaborator.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/80">
                              <User className="w-3 h-3" /> Full Name
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Ajay Narava" {...field} className="glass border-white/5 focus:border-primary/50 transition-all rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/80">
                              <Globe className="w-3 h-3" /> Email Address
                            </FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="hello@company.com" {...field} className="glass border-white/5 focus:border-primary/50 transition-all rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/80">
                              <Phone className="w-3 h-3" /> Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" {...field} className="glass border-white/5 focus:border-primary/50 transition-all rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/80">
                              <MapPin className="w-3 h-3" /> City / Country
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Bengaluru, India" {...field} className="glass border-white/5 focus:border-primary/50 transition-all rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Professional Details */}
                      <FormField
                        control={form.control}
                        name="profession"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/80">
                              <Briefcase className="w-3 h-3" /> Current Profession
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="AI Researcher" {...field} className="glass border-white/5 focus:border-primary/50 transition-all rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="expertise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/80">
                              <Globe className="w-3 h-3" /> Area of Expertise
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Deep Learning, Large Models" {...field} className="glass border-white/5 focus:border-primary/50 transition-all rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/80">
                              <Linkedin className="w-3 h-3" /> LinkedIn Profile
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/yourprofile" {...field} className="glass border-white/5 focus:border-primary/50 transition-all rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Partnership Interest */}
                      <FormField
                        control={form.control}
                        name="interest"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/80">
                              Collaborate In?
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="glass border-white/5 focus:border-primary/50 transition-all rounded-xl py-6">
                                  <SelectValue placeholder="Select area of interest" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="glass-dark border-white/10 rounded-xl">
                                <SelectItem value="Technology and Development" className="focus:bg-primary/20 hover:bg-primary/10 py-3">
                                  <div className="flex flex-col">
                                    <span className="font-bold">Technology and Development</span>
                                    <span className="text-[10px] opacity-60">Product builder, AI specialists, Developers, Engineers</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Healthcare Domain" className="focus:bg-primary/20 hover:bg-primary/10 py-3">
                                  <div className="flex flex-col">
                                    <span className="font-bold">Healthcare Domain</span>
                                    <span className="text-[10px] opacity-60">Knowledge exploration in healthcare, Researching</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Business and Marketing" className="focus:bg-primary/20 hover:bg-primary/10 py-3">
                                  <div className="flex flex-col">
                                    <span className="font-bold">Business and Marketing</span>
                                    <span className="text-[10px] opacity-60">Marketing, Branding, Business strategies</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Research and Innovation" className="focus:bg-primary/20 hover:bg-primary/10 py-3">
                                  <div className="flex flex-col">
                                    <span className="font-bold">Research and Innovation</span>
                                    <span className="text-[10px] opacity-60">Research projects, Technology, AI Strategy, Cybersecurity Innovation</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={form.formState.isSubmitting}
                      className="w-full btn-solid py-8 rounded-2xl group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {form.formState.isSubmitting ? "Processing..." : "Submit Application"}
                        {!form.formState.isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      </span>
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-12 h-12 text-primary animate-in zoom-in duration-500" />
                </div>
                <h3 className="font-serif text-4xl mb-4 text-gradient">Application Received</h3>
                <p className="text-foreground/60 max-w-sm leading-relaxed mb-8">
                  Our team will review your application and contact you if there is a suitable collaboration opportunity.
                </p>
                <Button 
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="rounded-full border-white/10 hover:border-primary/50 transition-all font-body text-xs tracking-widest uppercase"
                >
                  Close Window
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerModal;
