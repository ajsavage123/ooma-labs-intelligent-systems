import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Code2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FreeQuotationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || "";
  const navigate = useNavigate();

  useEffect(() => {
    if (refCode) {
      try {
        localStorage.setItem("ooma_pending_ref_code", refCode);
      } catch (e) {
        console.error(e);
      }
    }
    const targetUrl = refCode
      ? `/portal/login?mode=signup&ref=${encodeURIComponent(refCode)}`
      : "/portal/login?mode=signup";
    navigate(targetUrl, { replace: true });
  }, [refCode, navigate]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Code2 className="w-6 h-6 text-blue-400" />
      </div>
      <h2 className="text-xl font-bold">Redirecting to OOMA Project Dashboard Setup...</h2>
      <p className="text-sm text-zinc-400 mt-2 max-w-md">
        We are routing you to create your account and complete your project onboarding & scope configuration.
      </p>
      <Button
        onClick={() => {
          const targetUrl = refCode
            ? `/portal/login?mode=signup&ref=${encodeURIComponent(refCode)}`
            : "/portal/login?mode=signup";
          navigate(targetUrl, { replace: true });
        }}
        className="mt-6 bg-blue-600 hover:bg-blue-500 text-white gap-2 font-semibold"
      >
        <span>Continue to Registration & Onboarding</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
