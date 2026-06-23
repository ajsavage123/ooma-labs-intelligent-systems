import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Zap } from "lucide-react";
import { toast } from "sonner";
import { submitToGoogleSheets } from "@/lib/googleSheets";

const formSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  businessDetails: z.string().min(3, "Describe your business briefly"),
  requirement: z
    .string()
    .min(10, "Please describe your project (min 10 characters)"),
});

const ExitIntentModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("quotationPopupSeen");
    if (hasSeenPopup) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      localStorage.setItem("quotationPopupSeen", "true");
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      businessDetails: "",
      requirement: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Send to Google Sheets first in background
    submitToGoogleSheets("Quick Quotes", {
      fullName: values.fullName,
      phone: values.phone,
      businessDetails: values.businessDetails,
      requirement: values.requirement,
    });

    const msg =
      `Hi Ooma Labs, I'd like an instant quotation.\n\n` +
      `Name: ${values.fullName}\n` +
      `Phone: ${values.phone}\n` +
      `Business: ${values.businessDetails}\n` +
      `Project: ${values.requirement}`;

    const whatsappUrl = `https://wa.me/919492827058?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    toast.success("Opening WhatsApp to send your quotation request!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-md relative"
              style={{
                background: "linear-gradient(145deg, #0f0f14 0%, #12121a 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "1.75rem",
                boxShadow:
                  "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(66,133,244,0.1)",
                overflow: "hidden",
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  height: "2px",
                  background:
                    "linear-gradient(90deg, #4285F4 0%, #7c3aed 50%, #34A853 100%)",
                }}
              />

              <div className="p-7">
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5 text-white/50" />
                </button>

                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(66,133,244,0.12)" }}
                    >
                      <Zap className="w-4 h-4 text-[#4285F4]" />
                    </div>
                    <span
                      className="text-[10px] font-bold tracking-[0.18em] uppercase"
                      style={{ color: "#4285F4" }}
                    >
                      Quick Quote
                    </span>
                  </div>
                  <h2
                    className="text-2xl font-bold text-white leading-tight mb-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Get an Instant Quotation
                  </h2>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Tell us about your project and we'll get back within 24 hrs.
                  </p>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3.5"
                  >
                    {/* Name + Phone row */}
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                {...field}
                                className="rounded-xl text-sm py-5 px-4"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "white",
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="Phone / WhatsApp"
                                {...field}
                                className="rounded-xl text-sm py-5 px-4"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "white",
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="businessDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your business (e.g. SaaS startup, retail brand…)"
                              {...field}
                              className="rounded-xl text-sm py-5 px-4"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "white",
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirement"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your project — what do you want to build?"
                              {...field}
                              className="rounded-xl text-sm px-4 resize-none min-h-[90px]"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "white",
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-semibold tracking-wide text-white transition-all duration-200 group"
                      style={{
                        background:
                          "linear-gradient(135deg, #4285F4 0%, #7c3aed 100%)",
                        boxShadow: "0 8px 24px rgba(66,133,244,0.25)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.filter =
                          "brightness(1.1)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 12px 32px rgba(66,133,244,0.35)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.filter =
                          "brightness(1)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 8px 24px rgba(66,133,244,0.25)";
                      }}
                    >
                      Send via WhatsApp
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </form>
                </Form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;
