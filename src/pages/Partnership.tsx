import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth, makeApplication } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import logo from "@/assets/ooma-logo.png";
import { ArrowLeft } from "lucide-react";
import emailjs from "@emailjs/browser";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(5),
  cityCountry: z.string().min(2),
  currentProfession: z.string().min(2),
  areaOfExpertise: z.string().min(2),
  linkedinProfile: z.string().min(5),
  collaborateIn: z.enum(["innovations_research", "developer_engineer", "business_marketing"]),
});

type FormValues = z.infer<typeof schema>;

const PartnershipPage: React.FC = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { 
      name: "", 
      email: "", 
      phoneNumber: "",
      cityCountry: "",
      currentProfession: "",
      areaOfExpertise: "",
      linkedinProfile: "",
      collaborateIn: "innovations_research",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const app = makeApplication({
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        cityCountry: values.cityCountry,
        currentProfession: values.currentProfession,
        areaOfExpertise: values.areaOfExpertise,
        linkedinProfile: values.linkedinProfile,
        collaborateIn: values.collaborateIn,
      });

      // Send email to admin with all partner details
      try {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (serviceId && templateId && publicKey) {
          emailjs.init(publicKey);
          await emailjs.send(serviceId, templateId, {
            to_email: "oomalabs@gmail.com",
            partner_name: values.name,
            partner_email: values.email,
            partner_phone: values.phoneNumber,
            partner_location: values.cityCountry,
            partner_profession: values.currentProfession,
            partner_expertise: values.areaOfExpertise,
            partner_linkedin: values.linkedinProfile,
            partner_role: values.collaborateIn === "innovations_research" ? "Innovations and Research" : 
                          values.collaborateIn === "developer_engineer" ? "Developer or Engineer" : 
                          "Business and Marketing",
          });
        }
      } catch (emailError) {
        console.warn("Email sent with warning", emailError);
      }

      dispatch({ type: "SUBMIT_APPLICATION", payload: app });
      toast.success("Thank you! We will reach you through mail");
      navigate("/");
    } catch (error) {
      toast.error("Failed to submit application");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/20 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-primary stroke-[6]" style={{ strokeLinecap: 'round' }}>
                  <path d="M 35 15 A 40 40 0 1 1 20 35" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-wider uppercase">OOMA Labs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl glass-dark rounded-2xl p-6 sm:p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Apply for Partnership</h2>
            <p className="text-sm sm:text-base text-gray-400">Fill out the form below to become a partner</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              {/* Grid Layout for Better Mobile UX */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your full name" 
                            className="h-10 sm:h-11 text-sm sm:text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="hello@company.com" 
                            className="h-10 sm:h-11 text-sm sm:text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1 (555) 000-0000" 
                          className="h-10 sm:h-11 text-sm sm:text-base"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City / Country */}
                <FormField
                  control={form.control}
                  name="cityCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">City / Country</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Bengaluru, India" 
                          className="h-10 sm:h-11 text-sm sm:text-base"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Current Profession */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="currentProfession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Current Profession</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="AI Researcher" 
                            className="h-10 sm:h-11 text-sm sm:text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Area of Expertise */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="areaOfExpertise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Area of Expertise</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Experience in marketing" 
                            className="h-10 sm:h-11 text-sm sm:text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* LinkedIn Profile Link */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="linkedinProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">LinkedIn Profile Link</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://linkedin.com/in/yourprofile" 
                            className="h-10 sm:h-11 text-sm sm:text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Collaborate In */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="collaborateIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Collaborate In?</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="innovations_research">Innovations and Research</SelectItem>
                            <SelectItem value="developer_engineer">Developer or Engineer</SelectItem>
                            <SelectItem value="business_marketing">Business and Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/20">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="h-10 sm:h-11 text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-10 sm:h-11 text-sm sm:text-base flex-1"
                >
                  Submit Application
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PartnershipPage;
