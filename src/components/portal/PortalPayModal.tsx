import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientPayment } from "../../types";
import { useClientPortal, formatINR } from "../../context/ClientPortalContext";
import {
  CheckCircle2,
  CreditCard,
  Building,
  QrCode,
  Smartphone,
  ShieldCheck,
  Copy,
  Check,
  Tag,
  Lock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

export type PaymentGatewayMethod = "upi" | "netbanking" | "neft" | "card";

interface PortalPayModalProps {
  payment: ClientPayment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPay: (paymentId: string, appliedCoupon?: string, discountAmount?: number) => void;
  initialMethod?: PaymentGatewayMethod;
}

export const PortalPayModal: React.FC<PortalPayModalProps> = ({
  payment,
  isOpen,
  onClose,
  onConfirmPay,
  initialMethod = "upi",
}) => {
  const { activeProject } = useClientPortal();
  const [method, setMethod] = useState<PaymentGatewayMethod>(initialMethod);
  const [upiId, setUpiId] = useState("rajesh.sharma@okhdfcbank");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("gpay");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);

  // Card details state
  const [cardHolder, setCardHolder] = useState("Rajesh Sharma");
  const [cardNumber, setCardNumber] = useState("4532 8920 1934 5042");
  const [cardExpiry, setCardExpiry] = useState("09/28");
  const [cardCvv, setCardCvv] = useState("771");
  const [saveCardRbi, setSaveCardRbi] = useState(true);

  // Coupon / Discount State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Sync initial method when modal opens
  useEffect(() => {
    if (isOpen && initialMethod) {
      setMethod(initialMethod);
    }
  }, [isOpen, initialMethod]);

  if (!payment) return null;

  const { referrals } = activeProject;
  const isReferralUnlocked =
    referrals?.isCouponUnlocked || (referrals?.verifiedClientsCount || 0) >= (referrals?.requiredForUnlock || 4);
  const unlockedCode = referrals?.unlockedCouponCode || "OOMA-VERIFIED-4X";

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (code === unlockedCode || code === "OOMA-VERIFIED-4X") {
      if (!isReferralUnlocked) {
        toast.error("Coupon is locked! You must have 4 verified clients who have paid their project advance.");
        return;
      }

      const discount = Math.round(payment.amount * 0.2); // 20% discount
      setAppliedCoupon(code);
      setDiscountAmount(discount);
      toast.success(`Coupon ${code} applied! 20% discount (${formatINR(discount)}) deducted.`);
    } else {
      toast.error(`Invalid coupon code "${code}". Only verified referral codes are accepted.`);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput("");
    toast.info("Coupon removed.");
  };

  const netPayable = Math.max(0, payment.amount - discountAmount);

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankField(field);
    toast.success(`${field} copied to clipboard!`);
    setTimeout(() => setCopiedBankField(null), 2000);
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onConfirmPay(payment.id, appliedCoupon || undefined, discountAmount || undefined);
      toast.success(`Payment of ${formatINR(netPayable)} processed successfully!`);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponInput("");
      }, 1400);
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-white border border-slate-200 text-slate-900 rounded-3xl p-0 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* =======================================================================
            HIGH-TRUST HEADER: RAZORPAY & NPCI OFFICIAL VERIFIED SCHEME
           ======================================================================= */}
        <div className="bg-[#0c2340] text-white p-5 sm:p-6 rounded-t-3xl relative overflow-hidden">
          {/* Subtle Trust Pattern / Watermark */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
              <path d="M50 0 L90 20 L90 60 L50 100 L10 60 L10 20 Z" />
            </svg>
          </div>

          <div className="flex items-center justify-between">
            {/* Razorpay Trust Badge */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#00BAF2] flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#0c2340]">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-black tracking-wider uppercase block text-white">
                  Razorpay Secure
                </span>
                <span className="text-[10px] text-sky-200 font-medium">
                  RBI Licensed Gateway · PCI-DSS Level 1
                </span>
              </div>
            </div>

            {/* NPCI Verified Pill */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>NPCI Verified</span>
            </div>
          </div>

          {/* Invoice Milestone Overview */}
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-200 tracking-wider block">
                Invoice #{payment.invoiceNumber}
              </span>
              <h2 className="text-sm font-bold text-white line-clamp-1">
                {payment.milestoneTitle}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-sky-200 tracking-wider block">
                Net Payable
              </span>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {formatINR(netPayable)}
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================================
            SUCCESS CONFIRMATION VIEW
           ======================================================================= */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center space-y-3 bg-white">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Payment Confirmed!</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Transaction ID:{" "}
              <span className="font-mono font-bold text-slate-800">
                RZP_PAY_{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </p>
            {appliedCoupon && (
              <p className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
                VIP Referral Discount: -{formatINR(discountAmount)} ({appliedCoupon})
              </p>
            )}
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm pt-1">
              Net Settled:{" "}
              <strong className="text-slate-900 font-bold">{formatINR(netPayable)}</strong>.
              GST Tax invoice with ITC credentials sent to your registered company email.
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-4 bg-white">
            {/* ONLINE GATEWAY COMING SOON ALERT BANNER */}
            <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300/60 shadow-xs">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span>Online Payment Gateway — Coming Soon</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-black uppercase">
                    Staging
                  </span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-tight mt-0.5">
                  Direct online gateway processing is currently activating. You can review all milestone pricings, GST, and invoice breakdowns below.
                </p>
              </div>
            </div>

            {/* Amount Breakdown Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Agreed Milestone Fee
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-slate-900">
                    {formatINR(netPayable)}
                  </span>
                  {appliedCoupon && (
                    <span className="text-xs line-through text-slate-400">
                      {formatINR(payment.amount)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">
                  Includes 18% GST (SAC: 998314)
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Due Date
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {payment.dueDate}
                </span>
              </div>
            </div>

            {/* VIP Referral Coupon Accordion */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  Have a VIP Referral Coupon?
                </span>
                {isReferralUnlocked ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    4/4 Verified Clients ✓
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-medium">
                    {referrals?.verifiedClientsCount || 0}/4 Verified
                  </span>
                )}
              </div>

              {/* 1-Click Apply */}
              {isReferralUnlocked && !appliedCoupon && (
                <div className="p-2.5 rounded-xl bg-white border border-emerald-300 flex items-center justify-between gap-2 shadow-xs">
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">
                      VIP Coupon: {unlockedCode}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      20% Instant Invoice Deduction (-{formatINR(Math.round(payment.amount * 0.2))})
                    </span>
                  </div>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => handleApplyCoupon(unlockedCode)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-3 rounded-lg font-bold shadow-xs"
                  >
                    Apply
                  </Button>
                </div>
              )}

              {/* Coupon Form */}
              {!appliedCoupon && !isReferralUnlocked && (
                <div className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter referral code (e.g. OOMA-VERIFIED-4X)"
                    className="bg-white border-emerald-200 text-slate-900 text-xs h-8 font-mono placeholder:font-sans uppercase"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleApplyCoupon()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3 shrink-0 font-bold"
                  >
                    Apply
                  </Button>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-emerald-700 font-bold">
                    Coupon {appliedCoupon} applied (-{formatINR(discountAmount)})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 text-[11px] font-semibold underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* =======================================================================
                PAYMENT METHOD SELECTOR TABS (AUTHENTIC NATIVE LOOK)
               ======================================================================= */}
            <div>
              <Label className="text-xs font-bold text-slate-800 mb-2 block">
                Select Payment Mode
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {/* Mode 1: UPI */}
                <button
                  type="button"
                  onClick={() => setMethod("upi")}
                  className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    method === "upi"
                      ? "bg-blue-50/80 border-blue-600 text-blue-700 shadow-xs font-bold ring-2 ring-blue-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  {/* Official NPCI Dual-Arrow Icon */}
                  <svg viewBox="0 0 32 32" className="w-5 h-5 my-0.5">
                    <path d="M12 3 L20 14 L4 28 Z" fill="#00A859" />
                    <path d="M20 3 L28 14 L12 28 Z" fill="#F37021" />
                  </svg>
                  <span className="text-[11px] mt-1">UPI / QR</span>
                </button>

                {/* Mode 2: NetBanking */}
                <button
                  type="button"
                  onClick={() => setMethod("netbanking")}
                  className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    method === "netbanking"
                      ? "bg-blue-50/80 border-blue-600 text-blue-700 shadow-xs font-bold ring-2 ring-blue-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <Building className="w-5 h-5 text-blue-600 my-0.5" />
                  <span className="text-[11px] mt-1">NetBanking</span>
                </button>

                {/* Mode 3: Cards */}
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    method === "card"
                      ? "bg-blue-50/80 border-blue-600 text-blue-700 shadow-xs font-bold ring-2 ring-blue-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-600 my-0.5" />
                  <span className="text-[11px] mt-1">Cards / RuPay</span>
                </button>

                {/* Mode 4: NEFT / RTGS */}
                <button
                  type="button"
                  onClick={() => setMethod("neft")}
                  className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    method === "neft"
                      ? "bg-blue-50/80 border-blue-600 text-blue-700 shadow-xs font-bold ring-2 ring-blue-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-none stroke-emerald-600 stroke-2 stroke-linecap-round stroke-linejoin-round my-0.5"
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 21h5v-5" />
                  </svg>
                  <span className="text-[11px] mt-1">NEFT / RTGS</span>
                </button>
              </div>
            </div>

            {/* =======================================================================
                METHOD 1: UPI & NATIVE APPS (GPay, PhonePe, Paytm, BHIM, CRED)
               ======================================================================= */}
            {method === "upi" && (
              <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Dynamic UPI QR Box */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center shrink-0">
                    <div className="w-28 h-28 bg-white border border-slate-200 p-1.5 rounded-xl flex items-center justify-center relative">
                      <QrCode className="w-24 h-24 text-slate-900" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                          <svg viewBox="0 0 32 32" className="w-4 h-4">
                            <path d="M12 3 L20 14 L4 28 Z" fill="#00A859" />
                            <path d="M20 3 L28 14 L12 28 Z" fill="#F37021" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold mt-1.5 flex items-center gap-1">
                      <span>Scan via any UPI App</span>
                    </span>
                  </div>

                  {/* Native App Badges */}
                  <div className="space-y-2.5 w-full text-xs">
                    <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                      Or Open Installed UPI App:
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Google Pay */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUpiApp("gpay");
                          toast.success("Opening Google Pay deep-link...");
                        }}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                          selectedUpiApp === "gpay"
                            ? "bg-white border-blue-600 shadow-xs ring-1 ring-blue-500"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* 4-Color Google 'G' Icon */}
                        <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-4 h-4">
                            <path
                              fill="#4285F4"
                              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                            />
                          </svg>
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">
                          Google Pay
                        </span>
                      </button>

                      {/* PhonePe */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUpiApp("phonepe");
                          toast.success("Opening PhonePe deep-link...");
                        }}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                          selectedUpiApp === "phonepe"
                            ? "bg-white border-[#5f259f] shadow-xs ring-1 ring-[#5f259f]"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* PhonePe Purple Icon */}
                        <div className="w-5 h-5 rounded-md bg-[#5f259f] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                          पे
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">
                          PhonePe
                        </span>
                      </button>

                      {/* Paytm */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUpiApp("paytm");
                          toast.success("Opening Paytm UPI deep-link...");
                        }}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                          selectedUpiApp === "paytm"
                            ? "bg-white border-[#002970] shadow-xs ring-1 ring-[#002970]"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* Paytm Cyan & Blue Badge */}
                        <div className="w-5 h-5 rounded-md bg-[#002970] flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-black text-[#00b9f5]">
                            PAY
                          </span>
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">
                          Paytm UPI
                        </span>
                      </button>

                      {/* BHIM / CRED */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUpiApp("cred");
                          toast.success("Opening CRED UPI deep-link...");
                        }}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                          selectedUpiApp === "cred"
                            ? "bg-white border-slate-900 shadow-xs ring-1 ring-slate-900"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* CRED Sleek Black Badge */}
                        <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-[9px] font-black shrink-0">
                          C
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">
                          CRED UPI
                        </span>
                      </button>
                    </div>

                    {/* Manual VPA Entry */}
                    <div className="pt-2">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Or Enter UPI ID / Virtual Payment Address
                      </Label>
                      <div className="flex gap-1.5 mt-1">
                        <Input
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@bank"
                          className="bg-white border-slate-300 text-slate-900 text-xs h-8 focus:border-blue-600 rounded-lg"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => toast.success(`UPI ID verified for ${upiId}`)}
                          className="bg-slate-800 hover:bg-slate-900 text-white text-xs h-8 px-2.5 rounded-lg shrink-0 font-bold"
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =======================================================================
                METHOD 2: NETBANKING (HDFC, ICICI, SBI, AXIS, KOTAK, PNB)
               ======================================================================= */}
            {method === "netbanking" && (
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                <Label className="text-xs font-bold text-slate-800 block">
                  Select Popular Bank
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: "HDFC Bank", code: "HDFC", bg: "bg-[#004c8f]", text: "text-white" },
                    { name: "ICICI Bank", code: "ICICI", bg: "bg-[#b83a1b]", text: "text-white" },
                    { name: "State Bank of India", code: "SBI", bg: "bg-[#280071]", text: "text-white" },
                    { name: "Axis Bank", code: "AXIS", bg: "bg-[#97144d]", text: "text-white" },
                    { name: "Kotak Mahindra", code: "KOTAK", bg: "bg-[#ed1c24]", text: "text-white" },
                    { name: "Punjab National Bank", code: "PNB", bg: "bg-[#a20032]", text: "text-white" },
                  ].map((bank) => (
                    <button
                      key={bank.name}
                      type="button"
                      onClick={() => setSelectedBank(bank.name)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                        selectedBank === bank.name
                          ? "bg-white border-blue-600 shadow-sm ring-2 ring-blue-500/20"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md ${bank.bg} ${bank.text} flex items-center justify-center text-[8px] font-black shrink-0 shadow-2xs`}
                      >
                        {bank.code}
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 truncate">
                        {bank.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Or Choose From All Other Banks
                  </Label>
                  <select
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSelectedBank(e.target.value)}
                    value={selectedBank}
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="Canara Bank">Canara Bank</option>
                    <option value="IndusInd Bank">IndusInd Bank</option>
                    <option value="Federal Bank">Federal Bank</option>
                    <option value="IDBI Bank">IDBI Bank</option>
                    <option value="Yes Bank">Yes Bank</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    You will be securely redirected to {selectedBank}&apos;s encrypted corporate login.
                  </span>
                </div>
              </div>
            )}

            {/* =======================================================================
                METHOD 3: CARDS (VISA, MASTERCARD, RUPAY, AMEX)
               ======================================================================= */}
            {method === "card" && (
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Corporate & Personal Cards
                  </span>

                  {/* Authentic Network Logos */}
                  <div className="flex items-center gap-1.5">
                    {/* Visa */}
                    <span className="px-1.5 py-0.5 rounded bg-[#1a1f71] text-white text-[9px] font-black italic">
                      VISA
                    </span>
                    {/* Mastercard */}
                    <div className="flex -space-x-1 items-center px-1 py-0.5 rounded bg-slate-100">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B]" />
                    </div>
                    {/* RuPay */}
                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold">
                      RuPay
                    </span>
                    {/* Amex */}
                    <span className="px-1.5 py-0.5 rounded bg-[#006fcf] text-white text-[9px] font-black">
                      AMEX
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-[11px] font-bold text-slate-700">Cardholder Name</Label>
                  <Input
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900 text-xs h-8 mt-1 rounded-lg focus:border-blue-600"
                  />
                </div>

                <div>
                  <Label className="text-[11px] font-bold text-slate-700">Card Number</Label>
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900 text-xs h-8 mt-1 rounded-lg font-mono tracking-wider focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] font-bold text-slate-700">Valid Thru (MM/YY)</Label>
                    <Input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="bg-white border-slate-300 text-slate-900 text-xs h-8 mt-1 rounded-lg font-mono focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-slate-700">CVV / CVC</Label>
                    <Input
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      type="password"
                      maxLength={4}
                      className="bg-white border-slate-300 text-slate-900 text-xs h-8 mt-1 rounded-lg font-mono focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    id="saveCardRbi"
                    checked={saveCardRbi}
                    onChange={(e) => setSaveCardRbi(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="saveCardRbi" className="cursor-pointer">
                    Save securely as per RBI Tokenization Framework (Zero CVV storage)
                  </label>
                </div>
              </div>
            )}

            {/* =======================================================================
                METHOD 4: NEFT / RTGS (CORPORATE ESCROW CURRENT ACCOUNT)
               ======================================================================= */}
            {method === "neft" && (
              <div className="space-y-2.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-900">
                    OOMA LABS Escrow Virtual Beneficiary:
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Direct IMPS / NEFT / RTGS
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans text-xs">Beneficiary:</span>
                    <span className="text-slate-900 font-bold font-sans">
                      OOMA LABS INTELLIGENT SYSTEMS PVT LTD
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans text-xs">Virtual Account:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-700 font-bold">50200088914201</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("Account", "50200088914201")}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        {copiedBankField === "Account" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans text-xs">IFSC Code:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-700 font-bold">HDFC0004218</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("IFSC", "HDFC0004218")}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        {copiedBankField === "IFSC" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans text-xs">Bank & Branch:</span>
                    <span className="text-slate-800 font-sans text-[11px]">
                      HDFC Bank, Cyber City, Hyderabad
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans text-xs">Company GSTIN:</span>
                    <span className="text-slate-700 font-sans text-[11px]">
                      36AAFCO7891K1Z8 (Telangana)
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                  Virtual account is linked to your SOW project. Funds transfer is auto-reconciled within 30 seconds.
                </p>
              </div>
            )}

            {/* Trust Footer Bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Escrow</span>
              </span>
              <span>Instant Tax Invoice (ITC Available)</span>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex gap-2.5">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-white hover:bg-slate-100 border-slate-300 text-slate-700 text-xs h-11 rounded-xl font-bold"
                >
                  Close Breakdown
                </Button>
                <Button
                  disabled
                  className="flex-1 bg-slate-100 text-slate-400 border border-slate-200 font-bold text-xs h-11 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 shadow-none"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Gateway Coming Soon</span>
                </Button>
              </div>
              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                Online gateway transactions are currently paused. For milestone disbursements, please use corporate direct transfer (details under NEFT / RTGS) or contact your account manager.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PortalPayModal;
