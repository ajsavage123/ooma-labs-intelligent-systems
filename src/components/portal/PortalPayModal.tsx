import React, { useState } from "react";
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
  Sparkles,
  Percent,
} from "lucide-react";
import { toast } from "sonner";

interface PortalPayModalProps {
  payment: ClientPayment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPay: (paymentId: string, appliedCoupon?: string, discountAmount?: number) => void;
}

export const PortalPayModal: React.FC<PortalPayModalProps> = ({
  payment,
  isOpen,
  onClose,
  onConfirmPay,
}) => {
  const { activeProject } = useClientPortal();
  const [method, setMethod] = useState<"upi" | "netbanking" | "neft" | "card">("upi");
  const [upiId, setUpiId] = useState("rajesh.sharma@okhdfcbank");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);

  // Coupon / Discount State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  if (!payment) return null;

  const { referrals } = activeProject;
  const isReferralUnlocked = referrals.isCouponUnlocked || (referrals.verifiedClientsCount || 0) >= (referrals.requiredForUnlock || 4);
  const unlockedCode = referrals.unlockedCouponCode || "OOMA-VERIFIED-4X";

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

      const discount = Math.round(payment.amount * 0.20); // 20% discount
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
        // Reset discount for next time
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponInput("");
      }, 1400);
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-[#18181b] border border-[#27272a] text-white rounded-xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#064e3b] text-emerald-300">
              Razorpay & NPCI Verified
            </span>
            <span className="text-xs text-zinc-400 font-mono">Invoice #{payment.invoiceNumber}</span>
          </div>
          <DialogTitle className="text-xl font-bold text-white mt-1">
            Pay Milestone Invoice (INR)
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            {payment.milestoneTitle}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#064e3b] text-emerald-300 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Payment Confirmed!</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Transaction ID: <span className="font-mono text-zinc-200">RZP_PAY_{Math.floor(100000 + Math.random() * 900000)}</span>
            </p>
            {appliedCoupon && (
              <p className="text-xs text-emerald-400 font-semibold">
                VIP Referral Discount Applied: -{formatINR(discountAmount)} ({appliedCoupon})
              </p>
            )}
            <p className="text-xs text-zinc-400">
              Net Settled: <span className="text-white font-bold">{formatINR(netPayable)}</span>. GST Tax invoice and settlement receipt sent to your registered company email.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {/* Amount Box - Solid INR with Discount breakdown */}
            <div className="p-4 rounded-lg bg-[#121316] border border-[#27272a] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase text-zinc-400 block font-semibold">
                    {appliedCoupon ? "Net Payable (After Discount)" : "Total Payable"}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white tracking-tight">
                      {formatINR(netPayable)}
                    </span>
                    {appliedCoupon && (
                      <span className="text-xs line-through text-zinc-500">
                        {formatINR(payment.amount)}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-500 block">Inclusive of 18% GST (SAC: 998314)</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400 block">Due Date</span>
                  <span className="text-xs font-semibold text-zinc-300">{payment.dueDate}</span>
                </div>
              </div>

              {appliedCoupon && (
                <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Coupon {appliedCoupon} (20% OFF)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400">-{formatINR(discountAmount)}</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-zinc-500 hover:text-red-400 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Referral Coupon Redemption Accordion / Box */}
            <div className="p-3 bg-[#121316] rounded-lg border border-[#27272a] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  Have a Verified Referral Coupon?
                </span>
                {isReferralUnlocked ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-[#064e3b] px-2 py-0.5 rounded">
                    4/4 Verified Clients Achieved
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400">
                    {referrals.verifiedClientsCount || 0}/4 Verified Clients
                  </span>
                )}
              </div>

              {/* One-Click Apply if Unlocked */}
              {isReferralUnlocked && !appliedCoupon && (
                <div className="p-2.5 rounded bg-[#064e3b]/30 border border-emerald-700/60 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="font-bold text-emerald-300 block">VIP Coupon Ready: {unlockedCode}</span>
                    <span className="text-[11px] text-zinc-400">Unlock 20% off ({formatINR(Math.round(payment.amount * 0.2))})</span>
                  </div>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => handleApplyCoupon(unlockedCode)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-2.5"
                  >
                    Apply Discount
                  </Button>
                </div>
              )}

              {/* Coupon Input Form */}
              {!appliedCoupon && (
                <div className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code (e.g. OOMA-VERIFIED-4X)"
                    className="bg-[#18181b] border-[#27272a] text-white text-xs h-8 font-mono placeholder:font-sans uppercase"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleApplyCoupon()}
                    className="bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs h-8 px-3 shrink-0"
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Indian Payment Method Tabs */}
            <div className="grid grid-cols-4 gap-1.5 bg-[#121316] p-1 rounded-lg border border-[#27272a]">
              {[
                { id: "upi", label: "UPI / QR", icon: Smartphone },
                { id: "netbanking", label: "NetBanking", icon: Building },
                { id: "card", label: "Card / RuPay", icon: CreditCard },
                { id: "neft", label: "NEFT / RTGS", icon: Building },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id as any)}
                  className={`py-2 px-1 rounded text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                    method === id
                      ? "bg-[#2563eb] text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] truncate w-full text-center">{label}</span>
                </button>
              ))}
            </div>

            {/* Method 1: UPI / QR Code */}
            {method === "upi" && (
              <div className="space-y-3 bg-[#121316] p-4 rounded-lg border border-[#27272a]">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Simulated Dynamic UPI QR */}
                  <div className="bg-white p-2.5 rounded-lg shrink-0 flex flex-col items-center">
                    <div className="w-28 h-28 bg-[#18181b] p-2 rounded flex items-center justify-center text-center">
                      <QrCode className="w-24 h-24 text-white" />
                    </div>
                    <span className="text-[10px] text-zinc-800 font-bold mt-1">BHIM UPI QR</span>
                  </div>

                  <div className="space-y-2 text-xs w-full">
                    <span className="font-semibold text-zinc-200 block">Scan using any UPI App:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Google Pay", "PhonePe", "Paytm", "BHIM", "CRED"].map((app) => (
                        <span key={app} className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-300 text-[11px]">
                          {app}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Label className="text-[11px] text-zinc-400">Or Enter Your UPI ID / VPA</Label>
                      <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="bg-[#18181b] border-[#27272a] text-white text-xs h-9 mt-1 focus:border-[#2563eb]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Method 2: NetBanking */}
            {method === "netbanking" && (
              <div className="space-y-3 bg-[#121316] p-4 rounded-lg border border-[#27272a]">
                <Label className="text-xs text-zinc-300 font-semibold block">Select Your Bank</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "HDFC Bank",
                    "ICICI Bank",
                    "State Bank of India",
                    "Axis Bank",
                    "Kotak Mahindra",
                    "Punjab National Bank",
                  ].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-colors ${
                        selectedBank === bank
                          ? "bg-[#2563eb] border-[#2563eb] text-white"
                          : "bg-[#18181b] border-[#27272a] text-zinc-300 hover:text-white"
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-400">
                  You will be securely redirected to {selectedBank} retail or corporate banking portal.
                </p>
              </div>
            )}

            {/* Method 3: Cards (RuPay, Visa, Mastercard) */}
            {method === "card" && (
              <div className="space-y-3 bg-[#121316] p-4 rounded-lg border border-[#27272a]">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Corporate / Personal Cards</span>
                  <div className="flex gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-zinc-300 text-[10px]">RuPay</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-zinc-300 text-[10px]">Visa</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-zinc-300 text-[10px]">Mastercard</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-zinc-300">Cardholder Name</Label>
                  <Input
                    defaultValue="Rajesh Sharma"
                    className="bg-[#18181b] border-[#27272a] text-white text-xs h-9 mt-1 focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-300">Card Number</Label>
                  <Input
                    defaultValue="•••• •••• •••• 5042"
                    className="bg-[#18181b] border-[#27272a] text-white text-xs h-9 mt-1 focus:border-[#2563eb]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-zinc-300">Expiry (MM/YY)</Label>
                    <Input
                      defaultValue="09/28"
                      className="bg-[#18181b] border-[#27272a] text-white text-xs h-9 mt-1 focus:border-[#2563eb]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-zinc-300">CVV</Label>
                    <Input
                      defaultValue="771"
                      className="bg-[#18181b] border-[#27272a] text-white text-xs h-9 mt-1 focus:border-[#2563eb]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Method 4: NEFT / RTGS Corporate Bank Transfer */}
            {method === "neft" && (
              <div className="space-y-2 bg-[#121316] p-4 rounded-lg border border-[#27272a] text-xs">
                <span className="font-semibold text-zinc-200 block mb-1">
                  Official Corporate Current Account Details:
                </span>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center bg-[#18181b] p-2 rounded border border-[#27272a]">
                    <span className="text-zinc-400 font-sans">Beneficiary Name:</span>
                    <span className="text-white font-bold">OOMA LABS TECHNOLOGIES PVT LTD</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#18181b] p-2 rounded border border-[#27272a]">
                    <span className="text-zinc-400 font-sans">Current Account:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">50200088914201</span>
                      <button onClick={() => handleCopy("Account", "50200088914201")} className="text-zinc-400 hover:text-white">
                        {copiedBankField === "Account" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-[#18181b] p-2 rounded border border-[#27272a]">
                    <span className="text-zinc-400 font-sans">IFSC Code:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">HDFC0004218</span>
                      <button onClick={() => handleCopy("IFSC", "HDFC0004218")} className="text-zinc-400 hover:text-white">
                        {copiedBankField === "IFSC" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-[#18181b] p-2 rounded border border-[#27272a]">
                    <span className="text-zinc-400 font-sans">Bank & Branch:</span>
                    <span className="text-white">HDFC Bank, Gachibowli, Hyderabad</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#18181b] p-2 rounded border border-[#27272a]">
                    <span className="text-zinc-400 font-sans">Company GSTIN:</span>
                    <span className="text-zinc-300">36AAFCO7891K1Z8 (Telangana)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                RBI & NPCI Compliant 256-bit Encryption
              </span>
              <span>Instant GST Input Tax Credit (ITC)</span>
            </div>

            <div className="flex gap-2.5 pt-1">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] border-[#3f3f46] text-white text-xs h-10"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs h-10"
              >
                {isProcessing
                  ? "Processing via Gateway..."
                  : `Confirm Payment • ${formatINR(netPayable)}`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
