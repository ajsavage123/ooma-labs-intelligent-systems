import React, { useState } from "react";
import { useNavigate, useSearchParams, Link, Navigate } from "react-router-dom";
import { useClientPortal } from "../../context/ClientPortalContext";
import { PortalPayModal } from "../../components/portal/PortalPayModal";
import { PortalRatingModal } from "../../components/portal/PortalRatingModal";
import { PortalSupportDeskModal } from "../../components/portal/PortalSupportDeskModal";
import { PortalMobileView, MobileTabKey } from "../../components/portal/PortalMobileView";
import { OomaLogo, OomaLogoGlyph } from "../../components/OomaLogo";
import { AppleSpinner } from "../../components/AppleSpinner";
import { Button } from "@/components/ui/button";
import { ClientPayment } from "../../types";
import { Cpu, Code2, ArrowRight, LogOut, ShieldCheck, Mail, Phone, ExternalLink, Layers, Plus } from "lucide-react";

export const ClientPortal: React.FC = () => {
  const {
    clientUser,
    authLoading,
    activeProject,
    userProjects,
    projects,
    logoutClient,
    payInvoice,
    submitRating,
    createSupportTicket,
    supabaseStatus,
  } = useClientPortal();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromQuery = (searchParams.get("tab") as MobileTabKey) || "home";

  // Modals state
  const [payModalPayment, setPayModalPayment] = useState<ClientPayment | null>(null);
  const [payModalMethod, setPayModalMethod] = useState<"upi" | "netbanking" | "neft" | "card">("upi");
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // 1. Loading State (only display full-screen blocker if no cached user session exists to render immediately)
  if (authLoading && !clientUser) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center p-4">
        <AppleSpinner size={24} label="Loading" />
      </div>
    );
  }

  // 2. Authentication Required - Auto-redirect directly to login once auth verification finishes
  if (!clientUser && !authLoading) {
    return <Navigate to="/portal/login" replace />;
  }

  // 2b. Authenticated but No Active Projects & hasn't onboarded
  if (clientUser && clientUser.portalRole !== "admin" && clientUser.onboarded === false && !activeProject) {
    return <Navigate to="/portal/onboarding" replace />;
  }

  // 3. Authenticated but No Active Projects Yet (New Project Dashboard)
  if (!activeProject) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between">
        {/* Header */}
        <header className="p-4 sm:p-6 border-b border-[#27272a] max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <OomaLogo linkTo="/" variant="dark" size="sm" subtitle="CLIENT PORTAL" />
            <div className="hidden sm:block h-6 w-px bg-zinc-800" />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-white">{clientUser.name}</div>
              <div className="text-[11px] text-zinc-400">{clientUser.company}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {supabaseStatus === "connected" ? "Live Cloud Connected" : "Connecting..."}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutClient()}
              className="bg-[#18181b] hover:bg-[#27272a] border-[#27272a] text-zinc-300 hover:text-white text-xs h-8 rounded-lg flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Project Dashboard Provisioning Main Card */}
        <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-center space-y-6">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
                  <Cpu className="w-3.5 h-3.5" />
                  Project Dashboard Setup In Progress
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Welcome, {clientUser.name}!
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Your client account is authenticated and securely registered in our PostgreSQL database.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 bg-[#121316] border border-[#27272a] rounded-xl overflow-hidden">
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src="/portal-accent.png"
                  alt=""
                  aria-hidden="true"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#27272a] bg-[#09090b] shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <div className="font-semibold text-white text-xs sm:text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    Dedicated Project Workspace
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px] sm:text-xs">
                    Your workspace is ready. Set up your project details to view development progress, team updates, live demo links, and invoices in one place.
                  </p>
                </div>
              </div>
            </div>

            {/* Complete Onboarding Action */}
            <div>
              <Button
                onClick={() => navigate("/portal/onboarding")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-600/20 text-xs flex items-center justify-center gap-2"
              >
                <Code2 className="w-4 h-4 text-blue-200" />
                <span>Configure Project & View Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                to="/portal/onboarding"
                className="p-4 rounded-xl bg-[#121316] hover:bg-[#202024] border border-[#27272a] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Configure Project Dashboard</div>
                  <div className="text-[11px] text-zinc-400">Configure project requirements and milestones</div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <a
                href="https://wa.me/918006662364?text=Namaste%20OOMA%20LABS%20Lead%20Architect%2C%20I%20have%20registered%20my%20client%20account."
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-[#121316] hover:bg-[#202024] border border-[#27272a] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Direct WhatsApp Desk</div>
                  <div className="text-[11px] text-zinc-400">Connect with Lead Architect Arjun Mehta</div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </a>
            </div>

            {/* Admin Bypass Link if user has admin privileges */}
            {clientUser.portalRole === "admin" && (
              <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
                <span className="text-xs text-zinc-400">Admin Privileges Active:</span>
                <Button
                  size="sm"
                  onClick={() => navigate("/portal/admin")}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg h-8 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Open Admin Project Manager</span>
                </Button>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-xs text-zinc-600 border-t border-[#27272a]">
          OOMA LABS INC. Enterprise Client Portal & Telematics Suite.
        </footer>
      </div>
    );
  }

  // 4. Authenticated & Active Project Present
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* =======================================================================
          UNIFIED CLIENT PROJECT DASHBOARD (MOBILE & DESKTOP PARITY)
          Backed by 100% Real-Time Supabase WebSocket database synchronisation.
         ======================================================================= */}
      <PortalMobileView
        initialTab={["home", "stages", "billing", "rewards", "hub"].includes(tabFromQuery) ? tabFromQuery : "home"}
        onOpenPayModal={(payment, initialMethod) => {
          setPayModalPayment(payment);
          if (initialMethod) setPayModalMethod(initialMethod);
          setIsPayModalOpen(true);
        }}
        onOpenRatingModal={() => setIsRatingModalOpen(true)}
        onOpenTicketModal={() => setIsTicketModalOpen(true)}
      />

      {/* Global Shared Modals (conditionally mounted to eliminate upfront DOM nodes and layout cost) */}
      {isPayModalOpen && (
        <PortalPayModal
          payment={payModalPayment}
          isOpen={isPayModalOpen}
          initialMethod={payModalMethod}
          onClose={() => setIsPayModalOpen(false)}
          onConfirmPay={(id, appliedCoupon, discount) => payInvoice(id, appliedCoupon, discount)}
        />
      )}

      {isRatingModalOpen && (
        <PortalRatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onSubmitRating={submitRating}
        />
      )}

      {isTicketModalOpen && (
        <PortalSupportDeskModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientPortal;
