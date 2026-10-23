import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
} from "lucide-react";
import { toast } from "sonner";

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

  // If already authenticated, redirect to portal or onboarding
  useEffect(() => {
    if (clientUser) {
      const activeRef = refParam || localStorage.getItem("ooma_pending_ref_code") || "";
      const onboardingTarget = activeRef ? `/portal/onboarding?ref=${encodeURIComponent(activeRef)}` : "/portal/onboarding";
      if (!clientUser.company || clientUser.onboarded === false) {
        navigate(onboardingTarget);
      } else {
        navigate("/portal");
      }
    }
  }, [clientUser, navigate, refParam]);

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
    } catch (err: any) {
      toast.error(err.message || `Failed to initiate ${provider} authentication`);
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
        toast.error(res.error || "Failed to send verification link.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error resending verification email.");
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
        if (res.error?.toLowerCase().includes("email not confirmed")) {
          setShowResendPrompt(true);
          toast.error("Your email has not been confirmed yet. Please verify your email or click resend below.");
        } else {
          toast.error(res.error || "Authentication failed. Please verify your credentials.");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during sign in.");
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
        toast.error(res.error || "Failed to create account.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while creating your account.");
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
        toast.error(res.error || "Failed to send magic sign-in link.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error sending magic link.");
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
        toast.error(error.message);
      } else {
        toast.success(`Password reset instructions dispatched to ${targetEmail}. Please check your inbox.`);
        setShowForgotModal(false);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to send password reset link.");
    } finally {
      setIsResetting(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="p-5 md:px-10 flex items-center justify-between max-w-6xl mx-auto w-full border-b border-[#27272a]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
            <span className="text-blue-400 font-black text-xs tracking-wider">OL</span>
          </div>
          <span className="text-sm font-bold text-white tracking-widest uppercase">
            OOMA LABS <span className="text-zinc-500 font-normal">/ CLIENT PORTAL</span>
          </span>
        </Link>

        <Link
          to="/"
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Site</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 my-8">
        <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/80">
          
          {/* Header & Tabs */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                {authMode === "signin" && <Lock className="w-5 h-5" />}
                {authMode === "signup" && <UserPlus className="w-5 h-5" />}
                {authMode === "magic" && <Mail className="w-5 h-5" />}
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {authMode === "signin" && "Client Portal Sign In"}
                {authMode === "signup" && "Create Client Account"}
                {authMode === "magic" && "Passwordless Sign In"}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {authMode === "signin" && "Access your live project sprints, SOW milestones, invoices, and telematics."}
                {authMode === "signup" && "Sign up with Google, Facebook, or your work email to view your project dashboard."}
                {authMode === "magic" && "Enter your registered work email to receive an instant secure sign-in link."}
              </p>
            </div>

            {/* Expired Link Banner */}
            {(expiredParam || showResendPrompt) && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{expiredParam ? "Email Verification Link Expired" : "Email Confirmation Required"}</span>
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors disabled:opacity-50"
                  >
                    {isResendingVerification ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                        Sending verification email...
                      </span>
                    ) : (
                      "Resend Verification Link →"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* VIP Referral Invitation Banner */}
            {pendingRefCode && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200">
                  <div className="font-semibold text-white flex items-center gap-1.5 flex-wrap">
                    <span>VIP Partner Invitation Applied</span>
                    <code className="text-amber-300 font-mono text-[11px] bg-amber-500/20 px-1.5 py-0.5 rounded">{pendingRefCode}</code>
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                    Create your account to unlock your <strong>₹50,000 architecture audit fee waiver</strong> and commence project onboarding.
                  </p>
                </div>
              </div>
            )}

            {/* Standard Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#121316] border border-[#27272a] rounded-xl text-xs font-semibold text-zinc-400">
              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className={`py-2 rounded-lg transition-all ${
                  authMode === "signin" ? "bg-[#27272a] text-white shadow-sm" : "hover:text-zinc-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`py-2 rounded-lg transition-all ${
                  authMode === "signup" ? "bg-[#27272a] text-white shadow-sm" : "hover:text-zinc-200"
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Social OAuth Buttons (Google & Facebook) */}
          <div className="space-y-2.5">
            <Button
              type="button"
              variant="outline"
              disabled={oauthLoading !== null || isSubmitting}
              onClick={() => handleOAuth("google")}
              className="w-full bg-[#121316] hover:bg-[#202024] border-[#27272a] text-white text-xs font-semibold h-10 flex items-center justify-center gap-2.5 rounded-xl transition-all"
            >
              {oauthLoading === "google" ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting to Google...
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={oauthLoading !== null || isSubmitting}
              onClick={() => handleOAuth("facebook")}
              className="w-full bg-[#121316] hover:bg-[#202024] border-[#27272a] text-white text-xs font-semibold h-10 flex items-center justify-center gap-2.5 rounded-xl transition-all"
            >
              {oauthLoading === "facebook" ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting to Facebook...
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#27272a]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#18181b] px-3 text-zinc-400 font-semibold text-[11px] tracking-wider">
                Or with work email
              </span>
            </div>
          </div>

          {/* FORM: Sign In */}
          {authMode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-zinc-300">Email Address</Label>
                <div className="relative mt-1.5">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 pl-9 rounded-xl focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-zinc-300">Password</Label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 pl-9 pr-16 rounded-xl focus:border-blue-500"
                    required
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-zinc-400">
                    {password && (
                      <button
                        type="button"
                        onClick={() => setPassword("")}
                        className="hover:text-white transition-colors p-0.5"
                        aria-label="Clear password"
                        title="Clear password"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-white transition-colors p-0.5"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 select-none">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                  />
                  <span>Remember my email</span>
                </label>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 rounded-xl transition-all shadow-md shadow-blue-600/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <span>Sign In to Project Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </Button>

              <div className="pt-2 text-center text-xs text-zinc-400 flex items-center justify-center gap-1.5">
                <span>Want to sign in without a password?</span>
                <button
                  type="button"
                  onClick={() => setAuthMode("magic")}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Use Magic Link
                </button>
              </div>
            </form>
          )}

          {/* FORM: Sign Up */}
          {authMode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-zinc-300">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-10 pl-9 rounded-xl focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-zinc-300">Business Name</Label>
                  <div className="relative mt-1">
                    <Building className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                    <Input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Health or My Business"
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-10 pl-9 rounded-xl focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-zinc-300">Work Email</Label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@apexhealth.in"
                    autoComplete="email"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 pl-9 rounded-xl focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-zinc-300">Phone Number (Optional)</Label>
                <div className="relative mt-1">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 pl-9 rounded-xl focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-zinc-300">Password (min. 6 chars)</Label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    id="signup-password"
                    name="signup_password"
                    type={showPassword ? "text" : "password"}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 pl-9 pr-16 rounded-xl focus:border-blue-500"
                    required
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-zinc-400">
                    {signUpPassword && (
                      <button
                        type="button"
                        onClick={() => setSignUpPassword("")}
                        className="hover:text-white transition-colors p-0.5"
                        aria-label="Clear password"
                        title="Clear password"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-white transition-colors p-0.5"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-zinc-300">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    id="signup-confirm-password"
                    name="signup_confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 pl-9 pr-16 rounded-xl focus:border-blue-500"
                    required
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-zinc-400">
                    {confirmPassword && (
                      <button
                        type="button"
                        onClick={() => setConfirmPassword("")}
                        className="hover:text-white transition-colors p-0.5"
                        aria-label="Clear confirm password"
                        title="Clear confirm password"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="hover:text-white transition-colors p-0.5"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms of Service and Privacy Policy Agreement */}
              <div className="flex items-start gap-2 pt-1 text-xs text-zinc-400">
                <input
                  type="checkbox"
                  id="agreeTermsPortalSignUp"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#27272a] bg-[#121316] text-blue-600 focus:ring-blue-500 cursor-pointer"
                  required
                />
                <label htmlFor="agreeTermsPortalSignUp" className="cursor-pointer leading-tight text-[11px]">
                  I agree to OOMA LABS{" "}
                  <Link to="/terms-of-service" target="_blank" className="text-blue-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" target="_blank" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !agreedTerms}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 rounded-xl transition-all shadow-md shadow-blue-600/20 mt-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering Account...
                  </span>
                ) : (
                  "Create Account & Start Onboarding"
                )}
              </Button>

              <div className="text-center text-xs text-zinc-400 pt-1">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* FORM: Magic Link */}
          {authMode === "magic" && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-zinc-300">Work Email</Label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 pl-9 rounded-xl focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {resetSent && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    A secure sign-in link has been sent to <strong>{email}</strong>. Please click the link in your email to enter the client portal.
                  </span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 rounded-xl transition-all shadow-md shadow-blue-600/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Magic Link...
                  </span>
                ) : (
                  "Send Secure Magic Link"
                )}
              </Button>

              <div className="text-center text-xs text-zinc-400 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className="text-zinc-400 hover:text-white"
                >
                  ← Back to standard password login
                </button>
              </div>
            </form>
          )}



          {/* Security Notice */}
          <div className="pt-1 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>256-Bit SSL Encrypted Project Dashboard</span>
          </div>
        </div>
      </main>

      {/* Provider Disabled Modal */}
      {providerDisabledModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                {providerDisabledModal.provider === "google" ? "Google" : "Facebook"} Provider Status
              </h2>
              <button
                type="button"
                onClick={() => setProviderDisabledModal(null)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Single Sign-On via {providerDisabledModal.provider === "google" ? "Google" : "Facebook"} requires OAuth credentials to be configured in your Supabase Authentication settings.
            </p>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 space-y-1">
              <span className="font-bold block text-white">Recommended Sign-In:</span>
              <span>
                Please register or sign in with your work email and password above, or use the passwordless Magic Link option for instant access.
              </span>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => setProviderDisabledModal(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 rounded-xl font-semibold"
              >
                Continue with Work Email
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Reset Password
              </h2>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Enter your registered work email and we will send you secure password reset instructions.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div>
                <Label className="text-xs font-semibold text-zinc-300">Email Address</Label>
                <Input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1 rounded-xl"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 border-[#27272a] text-zinc-300 hover:text-white text-xs h-9 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isResetting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 rounded-xl font-semibold"
                >
                  {isResetting ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="p-5 text-center text-xs text-zinc-500 border-t border-[#27272a]">
        © {new Date().getFullYear()} OOMA LABS INC. All rights reserved. Hyderabad, India.
      </footer>
    </div>
  );
};

export default ClientPortalLogin;
