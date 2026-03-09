import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const loginSchema = z.object({
  username: z.string().min(2, "Username required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  designation: z.string().min(1, "Designation required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", designation: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      // In a real Supabase Auth flow, we'd use email.
      // But Task 3 specifically asks for Username, Password, Designation.
      // We will assume username is used as the email prefix or handled by a custom edge function,
      // but for standard Supabase Auth we'll use email = username + "@oomalabs.com"
      const email = `${values.username.toLowerCase()}@oomalabs.com`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: values.password,
      });

      if (error) throw error;

      // Verify designation matches
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('designation, role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.designation !== values.designation && profile.role !== 'admin') {
        await supabase.auth.signOut();
        toast.error("Invalid designation for this user");
        return;
      }

      toast.success(`Welcome back, ${values.username}!`);
      navigate("/workspace");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md glass-dark rounded-2xl p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">OOMA Workspace Login</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Sign in with your credentials and designation
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your username"
                      className="h-10 sm:h-11"
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
                      placeholder="••••••••"
                      className="h-10 sm:h-11"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Designation Field */}
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Designation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Innovation & Research Team">Innovation & Research Team</SelectItem>
                      <SelectItem value="Developer & Engineering Team">Developer & Engineering Team</SelectItem>
                      <SelectItem value="Business Strategy & Marketing Team">Business Strategy & Marketing Team</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
