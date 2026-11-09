import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { getSupabaseClient } from "../lib/supabase";

export const AuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    // Parse hash parameters returned by Supabase Auth redirects
    const cleanHash = hash.startsWith("#") ? hash.substring(1) : hash;
    const params = new URLSearchParams(cleanHash);

    const errorCode = params.get("error_code");
    const errorDesc = params.get("error_description");
    const error = params.get("error");
    const accessToken = params.get("access_token");
    const type = params.get("type"); // "signup" | "magiclink" | "recovery" | "invite"

    // 1. Handle Auth Errors (such as otp_expired, access_denied)
    if (errorCode || error) {
      console.warn("[Supabase Auth] Redirect error received:", { errorCode, errorDesc, error });

      // Clean the hash from the browser address bar immediately
      try {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      } catch (e) {
        console.error(e);
      }

      if (errorCode === "otp_expired" || errorDesc?.toLowerCase().includes("expired")) {
        toast.error("Email verification link expired or already used.", {
          description: "Verification links expire for security. Please sign in or resend a new confirmation link.",
          duration: 8000,
        });
        navigate("/portal/login?mode=signin&expired=true");
      } else {
        const friendlyMessage = errorDesc
          ? decodeURIComponent(errorDesc.replace(/\+/g, " "))
          : "Authentication error from email link.";
        toast.error(friendlyMessage, { duration: 6000 });
        navigate("/portal/login?mode=signin");
      }
      return;
    }

    // 2. Handle Successful Auth Redirects (token exchange)
    if (accessToken) {
      console.log("[Supabase Auth] Received valid access token in redirect of type:", type);

      const refreshToken = params.get("refresh_token") || "";
      const supabase = getSupabaseClient();

      const establishSession = async () => {
        if (supabase && refreshToken) {
          try {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          } catch (err) {
            console.error("[Supabase Auth] Error establishing session:", err);
          }
        }

        // Clean the hash from browser URL after session is established
        try {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        } catch (e) {
          console.error(e);
        }

        const pendingRef = localStorage.getItem("ooma_pending_ref_code") || "";
        const onboardingTarget = pendingRef
          ? `/portal/onboarding?ref=${encodeURIComponent(pendingRef)}`
          : "/portal/onboarding";

        if (type === "signup" || type === "invite") {
          toast.success("Email verified successfully! Let's set up your project dashboard.", {
            duration: 5000,
          });
          navigate(onboardingTarget);
        } else if (type === "magiclink") {
          toast.success("Signed in successfully via email magic link!", { duration: 4000 });
          navigate("/portal");
        } else if (type === "recovery") {
          toast.info("Password reset verified. You may now enter your new password in Settings.", {
            duration: 5000,
          });
          navigate("/portal");
        } else {
          // Generic authenticated redirect (e.g. Google OAuth)
          toast.success("Signed in successfully with Google!", { duration: 4000 });
          navigate("/portal");
        }
      };

      establishSession();
    }
  }, [navigate, location]);

  return null;
};

export default AuthRedirectHandler;
