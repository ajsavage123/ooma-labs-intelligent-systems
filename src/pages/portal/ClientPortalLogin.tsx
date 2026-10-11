import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useClientPortal, MOCK_CLIENTS } from "../../context/ClientPortalContext";
import { getSupabaseClient, isSupabaseConfigured } from "../../lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, ChevronRight, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

export const ClientPortalLogin: React.FC = () => {
  const { loginClient, switchClient } = useClientPortal();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "facebook" | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      loginClient(email, password);
      setIsSubmitting(false);
      toast.success("Welcome to your Client Portal!");
      navigate("/portal");
    }, 400);
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      setOauthLoading(provider);
      setTimeout(() => {
        if (provider === "google") {
          loginClient("rajesh.sharma@bharatlogistics.in");
          toast.success("Signed in with Google Account (rajesh.sharma@bharatlogistics.in)");
        } else {
          loginClient("priya.nair@swasthyacare.com");
          toast.success("Signed in with Facebook / Meta SSO (priya.nair@swasthyacare.com)");
        }
        setOauthLoading(null);
        navigate("/portal");
      }, 600);
      return;
    }

    setOauthLoading(provider);
    try {
      const redirectUrl = `${window.location.origin}/portal`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: provider === "google" ? {
            access_type: "offline",
            prompt: "consent",
          } : undefined,
        },
      });

      if (error) {
        toast.error(`${provider === "google" ? "Google" : "Facebook"} Sign-in Error: ${error.message}`);
        setOauthLoading(null);
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to initiate ${provider} authentication`);
      setOauthLoading(null);
    }
  };

  const handleQuickDemo = (clientId: string) => {
    switchClient(clientId);
    const client = MOCK_CLIENTS.find((c) => c.id === clientId);
    toast.success(`Logged in as ${client?.name} (${client?.company})`);
    navigate("/portal");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between">
      {/* Top Header - Solid */}
      <header className="p-5 md:px-10 flex items-center justify-between max-w-6xl mx-auto w-full border-b border-[#27272a]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-white stroke-[6]">
              <path d="M 35 15 A 40 40 0 1 1 20 35" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-widest uppercase">
            OOMA LABS <span className="text-zinc-500 font-normal">/ CLIENT PORTAL</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>OAuth Setup Guide</span>
          </button>

          <Link
            to="/"
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Website</span>
          </Link>
        </div>
      </header>

      {/* Main Card - Solid */}
      <main className="flex-1 flex items-center justify-center p-4 my-6">
        <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-lg bg-[#27272a] text-zinc-300 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Client Portal Sign In
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Access your project milestones, live deployment URLs, invoices, and support.
            </p>
          </div>

          {/* Social OAuth Sign In (Google & Facebook) */}
          <div className="space-y-2.5">
            <Button
              type="button"
              variant="outline"
              disabled={oauthLoading !== null}
              onClick={() => handleOAuthLogin("google")}
              className="w-full bg-[#121316] hover:bg-[#202024] border-[#27272a] text-white text-xs font-semibold h-10 flex items-center justify-center gap-2.5"
            >
              {oauthLoading === "google" ? (
                <span>Redirecting to Google...</span>
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
              disabled={oauthLoading !== null}
              onClick={() => handleOAuthLogin("facebook")}
              className="w-full bg-[#121316] hover:bg-[#202024] border-[#27272a] text-white text-xs font-semibold h-10 flex items-center justify-center gap-2.5"
            >
              {oauthLoading === "facebook" ? (
                <span>Redirecting to Facebook...</span>
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

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#27272a]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#18181b] px-3 text-zinc-400 font-semibold text-[11px]">
                Or with Work Email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-zinc-300">Work Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh.sharma@bharatlogistics.in"
                className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1 focus:border-[#2563eb]"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-300">Password</Label>
                <span className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer">Forgot?</span>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1 focus:border-[#2563eb]"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs h-10 mt-1"
            >
              {isSubmitting ? "Signing in..." : "Sign In with Email"}
            </Button>
          </form>

          {/* Quick Demo Client Selector */}
          <div className="pt-4 border-t border-[#27272a] space-y-2.5">
            <span className="text-xs font-semibold text-zinc-400 block text-center uppercase tracking-wider">
              Or Try Demo Client Accounts
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("client-bharatlogistics")}
                className="p-3 rounded-lg bg-[#121316] hover:bg-[#202024] border border-[#27272a] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">Rajesh Sharma</div>
                  <div className="text-[11px] text-zinc-400">BharatLogistics Tech (82% done)</div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("client-swasthyacare")}
                className="p-3 rounded-lg bg-[#121316] hover:bg-[#202024] border border-[#27272a] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">Priya Nair</div>
                  <div className="text-[11px] text-zinc-400">SwasthyaCare Health (94% live)</div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* OAuth Setup Guide Modal */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="max-w-xl bg-[#18181b] border border-[#27272a] text-white rounded-xl p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              Google & Facebook OAuth Setup Guide
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Steps to enable Google and Facebook login using your Supabase backend.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs text-zinc-300">
            {/* Step 1 */}
            <div className="p-3.5 bg-[#121316] rounded-lg border border-[#27272a] space-y-1.5">
              <span className="font-bold text-white text-sm block">1. Google Cloud Console Setup</span>
              <p className="text-zinc-400">
                1. Go to <code className="text-blue-400">console.cloud.google.com</code> & create a new project.
              </p>
              <p className="text-zinc-400">
                2. Configure <strong>OAuth Consent Screen</strong> (App Name: OOMA LABS, User Type: External).
              </p>
              <p className="text-zinc-400">
                3. Go to <strong>Credentials</strong> → <strong>Create Credentials</strong> → <strong>OAuth client ID</strong> (Web application).
              </p>
              <p className="text-zinc-400">
                4. Add Authorized Redirect URI:
              </p>
              <div className="bg-[#18181b] p-2 rounded font-mono text-[11px] text-amber-400 select-all">
                https://kopoxlalsumwxtedvucn.supabase.co/auth/v1/callback
              </div>
              <p className="text-zinc-400">5. Copy your <strong>Client ID</strong> and <strong>Client Secret</strong>.</p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-[#121316] rounded-lg border border-[#27272a] space-y-1.5">
              <span className="font-bold text-white text-sm block">2. Meta (Facebook) for Developers Setup</span>
              <p className="text-zinc-400">
                1. Go to <code className="text-blue-400">developers.facebook.com</code> and click <strong>Create App</strong>.
              </p>
              <p className="text-zinc-400">
                2. Select <strong>Authenticate and request data from users with Facebook Login</strong>.
              </p>
              <p className="text-zinc-400">
                3. Under <strong>Facebook Login → Settings</strong>, add Valid OAuth Redirect URI:
              </p>
              <div className="bg-[#18181b] p-2 rounded font-mono text-[11px] text-amber-400 select-all">
                https://kopoxlalsumwxtedvucn.supabase.co/auth/v1/callback
              </div>
              <p className="text-zinc-400">4. Under <strong>App Settings → Basic</strong>, copy your <strong>App ID</strong> and <strong>App Secret</strong>.</p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-[#121316] rounded-lg border border-[#27272a] space-y-1.5">
              <span className="font-bold text-white text-sm block">3. Enable Providers in Supabase Dashboard</span>
              <p className="text-zinc-400">
                1. Open your Supabase Dashboard: <code className="text-emerald-400">Authentication → Providers</code>.
              </p>
              <p className="text-zinc-400">
                2. Enable <strong>Google</strong> → Paste Client ID & Client Secret → Click <strong>Save</strong>.
              </p>
              <p className="text-zinc-400">
                3. Enable <strong>Facebook</strong> → Paste App ID & App Secret → Click <strong>Save</strong>.
              </p>
              <p className="text-zinc-400">
                4. Under <strong>URL Configuration</strong>, set Site URL to your domain (or <code className="text-white">http://localhost:8080</code> for testing).
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="p-5 text-center text-xs text-zinc-500 border-t border-[#27272a]">
        © {new Date().getFullYear()} OOMA LABS INC. All rights reserved.
      </footer>
    </div>
  );
};
export default ClientPortalLogin;
