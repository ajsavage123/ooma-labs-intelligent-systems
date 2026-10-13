import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClientPortal } from "../../context/ClientPortalContext";
import { PortalPayModal } from "../../components/portal/PortalPayModal";
import { PortalRatingModal } from "../../components/portal/PortalRatingModal";
import { PortalTicketModal } from "../../components/portal/PortalTicketModal";
import { PortalMobileView, MobileTabKey } from "../../components/portal/PortalMobileView";
import { Button } from "@/components/ui/button";
import { ClientPayment } from "../../types";

export const ClientPortal: React.FC = () => {
  const {
    clientUser,
    payInvoice,
    submitRating,
    createSupportTicket,
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

  if (!clientUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border border-blue-100 shadow-sm">
            OL
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Client Login Required</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Please log in with your client credentials to access your OOMA LABS enterprise workspace.
          </p>
          <Button
            onClick={() => navigate("/portal/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            Go to Client Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* =======================================================================
          UNIFIED CLIENT PORTAL WORKSPACE (MOBILE & DESKTOP PARITY)
          Identical 5 tabs (Home, Stages, Billing, Rewards, Hub), crisp tile borders,
          high-contrast card edges, zero lorry graphics, and seamless responsive layout.
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

      {/* Global Shared Modals */}
      <PortalPayModal
        payment={payModalPayment}
        isOpen={isPayModalOpen}
        initialMethod={payModalMethod}
        onClose={() => setIsPayModalOpen(false)}
        onConfirmPay={(id, appliedCoupon, discount) => payInvoice(id, appliedCoupon, discount)}
      />

      <PortalRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmitRating={submitRating}
      />

      <PortalTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSubmitTicket={createSupportTicket}
      />
    </div>
  );
};

export default ClientPortal;
