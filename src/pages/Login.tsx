import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth, makeUser } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { toast } from "sonner";

const loginSchema = z.object({
  name: z.string().min(2, "Name required"),
  password: z.string().min(4, "Password required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    if (isSignUp) {
      // Sign Up - Create new user
      const existingUser = state.users.find((u) => u.name.toLowerCase() === values.name.toLowerCase());
      if (existingUser) {
        toast.error("User already exists");
        return;
      }
      const newUser = makeUser(values.name, `${values.name.toLowerCase()}@ooma.com`, "partner");
      newUser.password = values.password;
      newUser.workspace_access = true;
      dispatch({ type: "REGISTER_USER", payload: newUser });
      toast.success("Account created! Logging in...");
      dispatch({ type: "LOGIN", payload: newUser });
      navigate("/workspace");
    } else {
      // Sign In - Find user and verify password
      const user = state.users.find((u) => u.name.toLowerCase() === values.name.toLowerCase());
      if (!user) {
        toast.error("User not found");
        return;
      }
      if (user.password !== values.password) {
        toast.error("Invalid password");
        form.reset({ name: values.name, password: "" });
        return;
      }
      if (!user.workspace_access) {
        toast.error("You don't have workspace access");
        return;
      }
      dispatch({ type: "LOGIN", payload: user });
      toast.success(`Welcome, ${user.name}!`);
      navigate("/workspace");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md glass-dark rounded-2xl p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {isSignUp ? "Create Account" : "OOMA Workspace Login"}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {isSignUp 
              ? "Create a new account to access the workspace"
              : "Sign in with your name and password"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your name" 
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

            {/* Submit Button */}
            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* Toggle Sign In / Sign Up */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsSignUp(!isSignUp);
              form.reset();
            }}
          >
            {isSignUp ? "Sign In Instead" : "Create New Account"}
          </Button>
        </div>

        {/* Test Credentials */}
        {!isSignUp && (
          <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Test Credentials:</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <strong>Name:</strong> Test User
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <strong>Password:</strong> test1234
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
