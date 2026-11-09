import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useClientPortal } from "../../context/ClientPortalContext";
import { getSupabaseClient } from "../../lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Lock,
  ArrowLeft,
  Mail,
  Building,
  User,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  UserPlus,
  Award,
  ArrowRight,
  Send,
  HelpCircle,
  AlertCircle,
  X,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import { OomaLogo } from "../../components/OomaLogo";

export const ClientPortalLogin: React.FC = () => {
  const {
    signInWithPassword,
    signUpWithPassword,
    resendVerificationEmail,
    signInWithOtp,
    signInWithOAuth,
    clientUser,
  } = useClientPortal();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refParam = searchParams.get("ref") || "";
  const modeParam = searchParams.get("mode");
  const [pendingRefCode, setPendingRefCode] = useState<string>("");

  // Mode: "signin" | "signup" | "magic"
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "magic">("signin");
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [showResendPrompt, setShowResendPrompt] = useState(false);
  const expiredParam = searchParams.get("expired") === "true";

  useEffect(() => {
    const saved = localStorage.getItem("ooma_pending_ref_code") || "";
    const activeRef = refParam || saved;
    if (activeRef) {
      setPendingRefCode(activeRef);
      try {
        localStorage.setItem("ooma_pending_ref_code", activeRef);
      } catch (e) {
        console.error(e);
      }
    }

    if (modeParam === "signup" || refParam) {
      setAuthMode("signup");
    }
  }, [modeParam, refParam]);

  // Sign In fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password & state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "facebook" | null>(null);
  const [providerDisabledModal, setProviderDisabledModal] = useState<{
    open: boolean;
    provider: "google" | "facebook";
    message: string;
  } | null>(null);

  const [resetSent, setResetSent] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Notice: Do not force-redirect away from the authentication page so the user can freely view/use sign-in and sign-up
  // Instead, if already logged in, offer a quick banner to go to portal or sign out

  // Load remembered email if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ooma_remembered_email");
      if (saved) {
        setEmail(saved);
        setForgotEmail(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleOAuth = async (provider: "google" | "facebook") => {
    setOauthLoading(provider);
    try {
      const res = await signInWithOAuth(provider);
      if (res?.isProviderDisabled || res?.error?.toLowerCase().includes("provider is not enabled")) {
        setProviderDisabledModal({
          open: true,
          provider,
          message: res.error || "Provider is not enabled in your Supabase project dashboard.",
        });
      } else if (res?.error) {
        toast.error(`${provider === "google" ? "Google" : "Facebook"} Sign-in error: ${res.error}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to initiate ${provider} authentication`;
      toast.error(msg);
    } finally {
      setOauthLoading(null);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      toast.error("Please enter your registered work email above first.");
      return;
    }
    setIsResendingVerification(true);
    try {
      const res = await resendVerificationEmail(email.trim(), pendingRefCode || undefined);
      if (res.success) {
        toast.success(`Fresh verification link sent to ${email.trim()}! Please check your inbox.`);
        setShowResendPrompt(false);
      } else {
        const msg = res.error || "Failed to send verification link.";
        if (msg.toLowerCase().includes("rate limit") || msg.includes("429")) {
          toast.error("Too many email requests. Please wait 60 seconds before trying again.");
        } else {
          toast.error(msg);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error resending verification email.";
      if (msg.toLowerCase().includes("rate limit") || msg.includes("429")) {
        toast.error("Too many email requests. Please wait 60 seconds before trying again.");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await signInWithPassword(email.trim(), password);
      if (res.success) {
        if (rememberMe) {
          localStorage.setItem("ooma_remembered_email", email.trim());
        } else {
          localStorage.removeItem("ooma_remembered_email");
        }
        toast.success("Welcome back! Redirecting to your project dashboard...");
        navigate("/portal");
      } else {
        const msg = res.error || "Authentication failed. Please verify your credentials.";
        if (msg.toLowerCase().includes("email not confirmed")) {
          setShowResendPrompt(true);
          toast.error("Your email has not been confirmed yet. Please verify your email or click resend below.");
        } else if (msg.toLowerCase().includes("rate limit") || msg.includes("429")) {
          toast.error("Too many sign in attempts. Please wait 60 seconds before trying again.");
        } else {
          toast.error(msg);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during sign in.";
      if (msg.toLowerCase().includes("rate limit") || msg.includes("429")) {
        toast.error("Too many sign in attempts. Please wait 60 seconds before trying again.");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !companyName.trim() || !email.trim() || !signUpPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (signUpPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (signUpPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreedTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy to create an account.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUpWithPassword({
        name: fullName.trim(),
        company: companyName.trim(),
        email: email.trim(),
        password: signUpPassword,
        phone: phone.trim() || undefined,
        referralCode: pendingRefCode || undefined,
      });

      if (res.success) {
        toast.success("Account created! Let's set up your project dashboard.");
        const targetUrl = pendingRefCode ? `/portal/onboarding?ref=${encodeURIComponent(pendingRefCode)}` : "/portal/onboarding";
        navigate(targetUrl);
      } else {
        const msg = res.error || "Failed to create account.";
        if (msg.toLowerCase().includes("rate limit") || msg.includes("429")) {
          toast.error("Too many signup requests. Please wait 60 seconds before trying again.");
        } else {
          toast.error(msg);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while creating your account.";
      if (msg.toLowerCase().includes("rate limit") || msg.includes("429")) {
        toast.error("Too many signup requests. Please wait 60 seconds before trying again.");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signInWithOtp(email.trim());
      if (res.success) {
        toast.success(`Magic sign-in link sent to ${email.trim()}! Check your inbox.`);
        setResetSent(true);
      } else {
        const msg = res.error || "Failed to send magic sign-in link.";
        if (msg.toLowerCase().includes("rate limit") || msg.includes("429")) {
          toast.error("Too many magic link requests. Please wait 60 seconds before trying again.");
        } else {
          toast.error(msg);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending magic link.";
      if (msg.toLowerCase().includes("rate limit") || msg.includes("429")) {
        toast.error("Too many magic link requests. Please wait 60 seconds before trying again.");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = (forgotEmail || email).trim();
    if (!targetEmail) {
      toast.error("Please enter your work email to receive a password reset link.");
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      toast.error("Database connection unavailable.");
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/portal`,
      });
      if (error) {
        const msg = error.message || "Failed to send password reset link.";
        if (msg.toLowerCase().includes("rate limit") || msg.includes("429")) {
          toast.error("Too many password reset requests. Please wait 60 seconds before trying again.");
        } else {
          toast.error(msg);
        }
      } else {
        toast.success(`Password reset instructions dispatched to ${targetEmail}. Please check your inbox.`);
        setShowForgotModal(false);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send password reset link.";
      if (msg.toLowerCase().includes("rate limit") || msg.includes("429")) {
        toast.error("Too many password reset requests. Please wait 60 seconds before trying again.");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsResetting(false);
    }
  };



  return (
    <div
      className="min-h-[100dvh] bg-[#000000] text-white font-sans flex flex-col selection:bg-[#D946EF] selection:text-white relative overflow-x-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 12%, rgba(123, 33, 209, 0.22) 0%, rgba(0, 0, 0, 0) 60%), radial-gradient(circle at 20% 80%, rgba(217, 70, 239, 0.08) 0%, rgba(0, 0, 0, 0) 50%)",
      }}
    >
      {/* Top Header */}
      <header className="shrink-0 px-3 py-2 sm:px-8 sm:py-4 flex items-center justify-between max-w-5xl mx-auto w-full border-b border-white/5 relative z-20 gap-2">
        <OomaLogo linkTo="/" variant="dark" size="sm" subtitle="CLIENT PORTAL" />

        <Link
          to="/"
          className="text-xs text-purple-200/70 hover:text-white flex items-center gap-1.5 transition-colors font-medium shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden min-[360px]:inline">Back to Site</span>
          <span className="min-[360px]:hidden">Back</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 py-2 sm:p-4 sm:my-6 relative z-10 w-full min-w-0 min-h-0">
        {/* Card Container */}
        <div className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md relative my-auto">
          
          {/* 3D Character Sitting on Top - smooth swap on mode change */}
          <motion.div
            layout
            transition={{ layout: { type: "spring", stiffness: 380, damping: 32 } }}
            className="relative z-30 flex justify-center pointer-events-none -mb-1 sm:-mb-3 px-1 sm:px-2 min-h-[56px] sm:min-h-[120px]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {(() => {
                const isSignin = authMode === "signin";
                const charKey = isSignin ? "signin" : "signup";
                return (
                  <motion.img
                    key={charKey}
                    src={isSignin ? "/auth-signin-character.png" : "/auth-signup-character.png"}
                    alt={isSignin ? "Welcome Back" : "Get Started Free"}
                    initial={{ opacity: 0, y: 14, scale: 0.94, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, scale: 1.03, filter: "blur(3px)" }}
                    transition={{
                      duration: 0.28,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`w-auto drop-shadow-[0_16px_32px_rgba(170,52,248,0.4)] object-contain select-none will-change-transform ${
                      authMode === "signup"
                        ? "h-[56px] min-[380px]:h-[68px] sm:h-auto sm:max-w-[380px]"
                        : "h-[96px] min-[380px]:h-[116px] sm:h-auto sm:max-w-[380px]"
                    }`}
                  />
                );
              })()}
            </AnimatePresence>
          </motion.div>

          {/* Main Glowing Neon Glass Card */}
          <div className="neon-glass-card p-4 min-[380px]:p-5 sm:p-7 space-y-3 sm:space-y-4 relative z-20">
            {/* Ambient 3D Glowing Purple Orbs (Sampled from Reference Image) */}
            <div className="absolute top-20 -left-2 sm:-left-3.5 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#DC33CE] to-[#7B21D1] shadow-[0_0_16px_rgba(220,51,206,0.9)] pointer-events-none" />
            <div className="absolute top-28 -right-1.5 sm:-right-3 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-[#AA34F8] to-[#7B21D1] shadow-[0_0_14px_rgba(170,52,248,0.9)] pointer-events-none" />
            <div className="absolute top-44 -right-1 sm:-right-1.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-[#DC33CE] to-[#AA34F8] shadow-[0_0_10px_rgba(220,51,206,0.9)] pointer-events-none" />

            {/* Mode Switcher Tabs */}
                <div className="flex items-center justify-center p-1 bg-white/[0.04] border border-purple-500/20 rounded-full text-xs font-semibold text-purple-200/70">
              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                  className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
                    authMode === "signin"
                      ? "bg-gradient-to-r from-[#AA34F8] to-[#DC33CE] text-white font-bold shadow-[0_2px_12px_rgba(220,51,206,0.45)]"
                      : "hover:text-white"
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
                    authMode === "signup"
                      ? "bg-gradient-to-r from-[#AA34F8] to-[#DC33CE] text-white font-bold shadow-[0_2px_12px_rgba(220,51,206,0.45)]"
                      : "hover:text-white"
                  }`}
              >
                Get Started
              </button>
            </div>

            {/* Card Header Title */}
            <div>
              {authMode === "signin" && (
                <>
                  <h1 className="text-xl min-[380px]:text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    Welcome Back!
                  </h1>
                  <p className="text-xs text-purple-200/70 mt-1 leading-snug">
                    Welcome back we missed you
                  </p>
                </>
              )}
              {authMode === "signup" && (
                <>
                  <h1 className={`text-xl min-[380px]:text-2xl sm:text-3xl font-extrabold text-white tracking-tight ${authMode === "signup" ? "text-lg min-[380px]:text-xl sm:text-3xl" : ""}`}>
                    Get Started{" "}
                    <span className="bg-gradient-to-r from-[#AA34F8] via-[#DC33CE] to-[#F8477E] bg-clip-text text-transparent">
                      Free
                    </span>
                  </h1>
                  <p className="text-[11px] sm:text-xs text-purple-200/70 mt-0.5 sm:mt-1 leading-snug hidden min-[380px]:block">
                    Free Forever. No Credit Card Needed.
                  </p>
                </>
              )}
              {authMode === "magic" && (
                <>
                  <h1 className="text-xl min-[380px]:text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Passwordless{" "}
                    <span className="bg-gradient-to-r from-[#AA34F8] to-[#F8477E] bg-clip-text text-transparent">
                      Login
                    </span>
                  </h1>
                  <p className="text-xs text-purple-200/70 mt-1 leading-snug">
                    Instant secure magic link to your work inbox
                  </p>
                </>
              )}
            </div>

            {/* Expired Link Banner */}
            {(expiredParam || showResendPrompt) && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {expiredParam ? "Email Verification Link Expired" : "Email Confirmation Required"}
                  </span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  {expiredParam
                    ? "Supabase security tokens expire after a limited duration or if pre-scanned by email security filters. Enter your work email and request a fresh link below."
                    : "Your account was created, but your email address has not been verified yet."}
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DC33CE] hover:text-[#F8477E] underline underline-offset-4 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isResendingVerification ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-fuchsia-400/30 border-t-fuchsia-400 rounded-full animate-spin" />
                        Sending verification email...
                      </span>
                    ) : (
                      "Resend Verification Link →"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Referral Invitation Banner */}
            {pendingRefCode && (
              <div className="p-3 bg-purple-900/30 border border-purple-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-purple-200">
                <Award className="w-4 h-4 text-[#DC33CE] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5 flex-wrap">
                    <span>Referral Invitation</span>
                    <code className="text-purple-300 font-mono text-[11px] bg-purple-500/20 px-1.5 py-0.5 rounded">
                      {pendingRefCode}
                    </code>
                  </div>
                  <p className="text-[11px] text-purple-200/80 mt-1 leading-snug">
                    Create your account to get started with your project workspace.
                  </p>
                </div>
              </div>
            )}

            {/* Already Signed In Indicator Banner */}
            {clientUser && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-200">
                <div>
                  <span className="font-semibold text-white">Signed in as {clientUser.name}</span>
                  <div className="text-[11px] text-purple-200/70">{clientUser.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/portal"
                    className="neon-btn-pill px-3 py-1 text-white text-xs font-semibold transition-all"
                  >
                    Go to Portal
                  </Link>
                </div>
              </div>
            )}

            {/* FORM: Sign In */}
            {authMode === "signin" && (
              <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-3.5">
                {/* Username / Email */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1.5">
                    <User className="w-3.5 h-3.5 text-[#DC33CE]" />
                    <span>Username</span>
                  </div>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#C4B5FD] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="signin-email"
                      name="signin_email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="username"
                      autoComplete="email"
                      className="neon-input h-12 pl-10 pr-4 text-xs font-medium placeholder:text-purple-300/40"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#DC33CE]" />
                      <span>Password</span>
                    </div>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#C4B5FD] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="signin-password"
                      name="signin_password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="neon-input h-11 sm:h-12 pl-10 pr-12 text-xs font-medium placeholder:text-purple-300/40 tracking-widest"
                      required
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-[#C4B5FD]">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-white transition-colors p-1 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 sm:pt-1.5">
                    <label
                      htmlFor="signin-remember-me"
                      className="flex items-center gap-1.5 cursor-pointer text-[11px] text-purple-200/70 select-none"
                    >
                      <Checkbox
                        id="signin-remember-me"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                        className="rounded border-purple-400/40 data-[state=checked]:bg-[#DC33CE] data-[state=checked]:border-[#DC33CE] "
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setShowForgotModal(true);
                      }}
                      className="text-xs text-purple-300/80 hover:text-white transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="neon-btn-pill w-full h-11 sm:h-12 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </form>
            )}

            {/* FORM: Sign Up */}
            {authMode === "signup" && (
              <form onSubmit={handleSignUp} className="space-y-2 sm:space-y-3">
                {/* Email Address */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white mb-1 sm:mb-1.5">
                    <Mail className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#DC33CE]" />
                    <span>Email</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#C4B5FD] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="signup-email"
                      name="signup_email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="youname@gmail.com"
                      autoComplete="email"
                      className="neon-input h-10 sm:h-11 pl-10 pr-4 text-xs font-medium placeholder:text-purple-300/40"
                      required
                    />
                  </div>
                </div>

                {/* Your Name & Business Name */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white mb-1 sm:mb-1.5">
                      <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#DC33CE]" />
                      <span>Name</span>
                    </div>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C4B5FD] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="signup-fullname"
                        name="signup_fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                        className="neon-input h-10 sm:h-11 pl-8 sm:pl-10 pr-2 sm:pr-3 text-xs font-medium placeholder:text-purple-300/40"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white mb-1 sm:mb-1.5">
                      <Building className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#DC33CE]" />
                      <span>Business</span>
                    </div>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C4B5FD] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="signup-company"
                        name="signup_company"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company"
                        autoComplete="organization"
                        className="neon-input h-10 sm:h-11 pl-8 sm:pl-10 pr-2 sm:pr-3 text-xs font-medium placeholder:text-purple-300/40"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white mb-1 sm:mb-1.5">
                    <Phone className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#DC33CE]" />
                    <span>Phone <span className="text-purple-300/50 font-normal">(optional)</span></span>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#C4B5FD] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="signup-phone"
                      name="signup_phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      autoComplete="tel"
                      className="neon-input h-10 sm:h-11 pl-10 pr-3 text-xs font-medium placeholder:text-purple-300/40"
                    />
                  </div>
                </div>

                {/* Password & Confirm - side by side on sm, stacked on very small */}
                <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 sm:gap-2.5">
                  <div>
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-white mb-1 sm:mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Key className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#DC33CE]" />
                        <span>Password</span>
                      </div>
                      {signUpPassword.length >= 6 && (
                        <span className="text-[10px] font-semibold text-emerald-400 hidden sm:inline">Strong</span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C4B5FD] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="signup-password"
                        name="signup_password"
                        type={showPassword ? "text" : "password"}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="••••••"
                        autoComplete="new-password"
                        className="neon-input h-10 sm:h-11 pl-8 sm:pl-10 pr-9 text-xs font-medium placeholder:text-purple-300/40 tracking-widest"
                        required
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center text-[#C4B5FD]">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="hover:text-white transition-colors p-0.5 cursor-pointer"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white mb-1 sm:mb-1.5">
                      <Lock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#DC33CE]" />
                      <span>Confirm</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C4B5FD] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="signup-confirm-password"
                        name="signup_confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••"
                        autoComplete="new-password"
                        className="neon-input h-10 sm:h-11 pl-8 sm:pl-10 pr-9 text-xs font-medium placeholder:text-purple-300/40 tracking-widest"
                        required
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center text-[#C4B5FD]">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="hover:text-white transition-colors p-0.5 cursor-pointer"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 pt-0.5 text-xs text-purple-200/70">
                  <input
                    type="checkbox"
                    id="agreeTermsPortalSignUp"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-purple-400/30 bg-[#1A1433] text-[#DC33CE] focus:ring-[#D946EF] cursor-pointer shrink-0"
                    required
                  />
                  <label htmlFor="agreeTermsPortalSignUp" className="cursor-pointer leading-tight text-[10px] sm:text-[11px]">
                    I agree to{" "}
                    <Link to="/terms-of-service" target="_blank" className="text-[#DC33CE] hover:underline">
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link to="/privacy-policy" target="_blank" className="text-[#DC33CE] hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !agreedTerms}
                  className="neon-btn-pill w-full h-11 sm:h-12 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-0.5"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span>Sign up →</span>
                  )}
                </button>
              </form>
            )}

            {/* FORM: Magic Link */}
            {authMode === "magic" && (
              <form onSubmit={handleMagicLink} className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#DC33CE]" />
                    <span>Email Address</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#C4B5FD] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="magic-email"
                      name="magic_email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="youname@gmail.com"
                      autoComplete="email"
                      className="neon-input h-11 sm:h-12 pl-10 pr-4 text-xs font-medium placeholder:text-purple-300/40"
                      required
                    />
                  </div>
                </div>

                {resetSent && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      A secure sign-in link has been sent to <strong>{email}</strong>. Please check your inbox.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="neon-btn-pill w-full h-11 sm:h-12 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Magic Link...
                    </span>
                  ) : (
                    <span>Send Magic Link →</span>
                  )}
                </button>

                <div className="text-center text-xs text-purple-200/70 pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className="text-purple-200/70 hover:text-white transition-colors cursor-pointer"
                  >
                    ← Back to standard password login
                  </button>
                </div>
              </form>
            )}

            {/* Divider - compact on mobile */}
            <div className="relative my-2 sm:my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/20" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="bg-[#120B24] px-3 text-purple-200/60 font-medium">
                  {authMode === "signin" ? "Or continue with" : "Or sign up with"}
                </span>
              </div>
            </div>

            {/* Social OAuth Buttons */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {/* Google */}
              <button
                type="button"
                disabled={oauthLoading !== null || isSubmitting}
                onClick={() => handleOAuth("google")}
                className="neon-oauth-tile h-11 sm:h-12 flex items-center justify-center cursor-pointer disabled:opacity-50"
                title="Continue with Google"
                aria-label="Continue with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>

              {/* Apple */}
              <button
                type="button"
                disabled={oauthLoading !== null || isSubmitting}
                onClick={() => toast.info("Apple Sign-In is configured for production deployments.")}
                className="neon-oauth-tile h-11 sm:h-12 flex items-center justify-center cursor-pointer disabled:opacity-50"
                title="Continue with Apple"
                aria-label="Continue with Apple"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.03-.49 2.64-1.24z" />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                disabled={oauthLoading !== null || isSubmitting}
                onClick={() => handleOAuth("facebook")}
                className="neon-oauth-tile h-11 sm:h-12 flex items-center justify-center cursor-pointer disabled:opacity-50"
                title="Continue with Facebook"
                aria-label="Continue with Facebook"
              >
                <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>

            {/* Magic Link Switcher for Sign In mode */}
            {authMode === "signin" && (
              <div className="pt-1 text-center text-xs text-purple-200/60 flex items-center justify-center gap-1.5">
                <span>Want to sign in without password?</span>
                <button
                  type="button"
                  onClick={() => setAuthMode("magic")}
                  className="text-[#DC33CE] hover:underline font-semibold cursor-pointer"
                >
                  Use Magic Link →
                </button>
              </div>
            )}

            {/* Already have an account link for Sign Up mode */}
            {authMode === "signup" && (
              <div className="text-center text-xs text-purple-200/70 pt-1">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className="text-[#DC33CE] hover:underline font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Security Notice - hidden on small mobile to save space */}
            <div className="pt-1 text-center text-[11px] text-purple-300/50 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400/60" />
              <span>256-Bit SSL Encrypted Project Dashboard</span>
            </div>
          </div>
        </div>
      </main>

      {/* Provider Disabled Modal */}
      {providerDisabledModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md neon-glass-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                {providerDisabledModal.provider === "google" ? "Google" : "Facebook"} Provider Status
              </h2>
              <button
                type="button"
                onClick={() => setProviderDisabledModal(null)}
                className="text-[#C4B5FD] hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-purple-200/80 leading-relaxed">
              Single Sign-On via {providerDisabledModal.provider === "google" ? "Google" : "Facebook"}{" "}
              requires OAuth credentials to be configured in your Supabase Authentication settings.
            </p>

            <div className="p-3 bg-white/[0.04] border border-purple-500/20 rounded-2xl text-xs text-purple-200 space-y-1">
              <span className="font-bold block text-white">Recommended Sign-In:</span>
              <span className="text-[11px] text-purple-200/80">
                Please register or sign in with your work email and password above, or use the passwordless
                Magic Link option for instant access.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setProviderDisabledModal(null)}
                className="neon-btn-pill w-full text-white text-xs h-11 font-bold cursor-pointer"
              >
                Continue with Work Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-sm neon-glass-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#DC33CE]" />
                Reset Password
              </h2>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-[#C4B5FD] hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-purple-200/70">
              Enter your registered work email and we will send you secure password reset instructions.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#DC33CE]" />
                  <span>Email Address</span>
                </div>
                <Input
                  id="forgot-email"
                  name="forgot_email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="neon-input h-11 pl-3 text-xs font-medium placeholder:text-purple-300/40"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 h-11 rounded-full bg-white/[0.05] border border-purple-500/20 text-purple-200 hover:text-white text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="neon-btn-pill flex-1 text-white text-xs h-11 font-bold cursor-pointer disabled:opacity-50"
                >
                  {isResetting ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer - compact/hidden feel on very small screens to save space */}
      <footer className="shrink-0 px-3 py-2 sm:p-5 text-center text-xs text-purple-300/40 border-t border-white/5 relative z-20 leading-tight">
        © {new Date().getFullYear()} OOMA LABS INC. All rights reserved.
      </footer>
    </div>
  );
};

export default ClientPortalLogin;
