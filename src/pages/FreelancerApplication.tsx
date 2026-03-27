import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  linkedin: z.string().url("Please enter a valid LinkedIn URL"),
  contactNumber: z.string().min(5, "Contact number is required"),
  address: z.string().min(5, "Address is required"),
  resume: z
    .any()
    .refine((files) => files?.length == 1, "Resume is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf, .doc and .docx formats are supported."
    ),
});

type FormValues = z.infer<typeof schema>;

const FreelancerApplication: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      linkedin: "",
      contactNumber: "",
      address: "",
      resume: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Here you would typically handle the file upload to your server/storage
      // const file = values.resume[0];
      // const formData = new FormData();
      // formData.append("resume", file);
      // ... append other fields ...

      console.log("Form values:", {
        name: values.name,
        linkedin: values.linkedin,
        contactNumber: values.contactNumber,
        address: values.address,
        resumeName: values.resume[0]?.name,
      });

      toast.success("Application submitted successfully! We will contact you soon.");
      form.reset();
      navigate("/");
    } catch (error) {
      toast.error("Failed to submit application");
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
        <div className="w-full max-w-2xl glass-dark rounded-2xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">Join as a Freelancer</h2>
            <p className="text-sm sm:text-base text-gray-400">Fill out the form below to collaborate with us</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base text-gray-200">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your full name" 
                            className="h-10 sm:h-11 text-sm sm:text-base bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* LinkedIn Profile */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base text-gray-200">LinkedIn Profile Link</FormLabel>
                        <FormControl>
                          <Input 
                            type="url"
                            placeholder="https://linkedin.com/in/yourprofile" 
                            className="h-10 sm:h-11 text-sm sm:text-base bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Number */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base text-gray-200">Contact Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1 (555) 000-0000" 
                            className="h-10 sm:h-11 text-sm sm:text-base bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base text-gray-200">Address / Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="City, Country" 
                            className="h-10 sm:h-11 text-sm sm:text-base bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Resume Upload */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base text-gray-200">Upload Resume</FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-400">
                                  <span className="font-semibold text-white">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PDF, DOC, DOCX (MAX. 5MB)
                                </p>
                                {value && value.length > 0 && (
                                  <p className="mt-2 text-sm text-[#4285f4] font-medium">
                                    Selected: {value[0].name}
                                  </p>
                                )}
                              </div>
                              <Input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={(event) => {
                                  onChange(event.target.files);
                                }}
                                {...fieldProps} 
                              />
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="h-10 sm:h-11 text-sm sm:text-base bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="h-10 sm:h-11 text-sm sm:text-base flex-1 bg-[#4285F4] hover:bg-[#3367d6] text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default FreelancerApplication;
