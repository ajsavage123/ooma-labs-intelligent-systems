import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";

const WORKSPACE_PASSWORD = "ooma2001"; // Universal password for all approved partners

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

const WorkspaceAccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const userId = searchParams.get("user"); // Partner user ID or app ID

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  // Try to get partner from users first, or create from application
  let partner = state.users.find((u) => u.id === userId && u.role === "partner");
  
  // If partner doesn't exist, try to find application and create user
  if (!partner) {
    const app = state.applications.find((a) => a.id === userId);
    if (app) {
      partner = {
        id: app.id,
        name: app.name,
        email: app.email,
        role: "partner" as const,
        workspace_access: true,
        organization: app.organization,
        collaborateIn: app.collaborateIn,
      };
      // Register the user
      dispatch({
        type: "REGISTER_USER",
        payload: partner,
      });
    }
  }

  const onSubmit = (values: FormValues) => {
    if (!partner) {
      toast.error("Partner not found");
      return;
    }

    // Validate email matches partner's email
    if (values.email.toLowerCase() !== partner.email.toLowerCase()) {
      toast.error("Invalid email address");
      return;
    }

    // Validate password
    if (values.password !== WORKSPACE_PASSWORD) {
      toast.error("Invalid password");
      form.reset();
      return;
    }

    // Login the partner
    dispatch({ type: "LOGIN", payload: partner });
    toast.success(`Welcome back, ${partner.name}`);
    navigate("/workspace");
  };

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md glass-dark rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Invalid Access Link</h2>
          <p className="text-gray-400 mb-6">
            This access link is invalid or expired. Please contact the admin for a new link.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

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
              <span className="text-sm font-bold tracking-wider uppercase">OOMA Workspace</span>
            </div>
          </div>
        </div>
      </div>

      {/* Access Form */}
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md glass-dark rounded-2xl p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Access Workspace</h2>
            <p className="text-gray-400 text-sm sm:text-base">Enter your password to access the OOMA workspace</p>
          </div>

          {/* Partner Info Display */}
          <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-gray-400 mb-1">Welcome back,</p>
            <h3 className="text-lg font-bold mb-3">{partner.name}</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              <span className="font-semibold">Email:</span> {partner.email}
            </p>
            {partner.collaborateIn && (
              <p className="text-xs sm:text-sm text-gray-400">
                <span className="font-semibold">Applied For:</span> {
                  partner.collaborateIn === "innovations_research" ? "Innovations and Research" :
                  partner.collaborateIn === "developer_engineer" ? "Developer or Engineer" :
                  "Business and Marketing"
                }
              </p>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base">
                Access Workspace
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-6 border-t border-border/20">
            <p className="text-xs sm:text-sm text-gray-400 text-center">
              Having trouble? Contact the admin for support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceAccess;
