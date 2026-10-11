import React, { useState } from "react";
import { useClientPortal, formatINR } from "../../context/ClientPortalContext";
import { ClientPayment } from "../../types";
import { CreditCard, CheckCircle2, Download, ShieldCheck, Smartphone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PortalPayModal } from "./PortalPayModal";

export const PortalPayments: React.FC = () => {
  const { activeProject, payInvoice } = useClientPortal();
  const [selectedPayment, setSelectedPayment] = useState<ClientPayment | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const totalContract = activeProject.payments.reduce((acc, p) => acc + p.amount, 0);
  const totalPaid = activeProject.payments
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0);
  const totalPending = activeProject.payments
    .filter((p) => p.status !== "paid")
    .reduce((acc, p) => acc + p.amount, 0);

  const handleOpenPay = (payment: ClientPayment) => {
    setSelectedPayment(payment);
    setIsPayModalOpen(true);
  };

  const handleDownloadInvoice = (invoice: ClientPayment) => {
    toast.success(`Downloaded GST Tax Invoice PDF: ${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Header Banner - Solid */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            Milestone Billing & GST Tax Invoices
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
            Settlement ledger for Indian contracts in INR (₹). Supports UPI, NetBanking, NEFT/RTGS, and Corporate Cards.
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-300 bg-[#27272a] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-[#3f3f46] shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          <span>GSTIN: 36AAFCO7891K1Z8 (Telangana)</span>
        </div>
      </div>

      {/* Financial Overview Cards - Solid INR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-[#18181b] border border-[#27272a] p-3 sm:p-5 rounded-xl">
          <span className="text-[10px] sm:text-xs uppercase font-semibold text-zinc-400 block mb-0.5 sm:mb-1">
            Total Contract Value
          </span>
          <div className="text-xl sm:text-3xl font-bold text-white">
            {formatINR(totalContract)}
          </div>
          <span className="text-[10px] sm:text-xs text-zinc-400 block mt-0.5 sm:mt-1">Agreed total SOW budget</span>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] p-3 sm:p-5 rounded-xl">
          <span className="text-[10px] sm:text-xs uppercase font-semibold text-emerald-400 block mb-0.5 sm:mb-1">
            Paid & Settled
          </span>
          <div className="text-xl sm:text-3xl font-bold text-emerald-400">
            {formatINR(totalPaid)}
          </div>
          <span className="text-[10px] sm:text-xs text-zinc-400 block mt-0.5 sm:mt-1">
            {((totalPaid / (totalContract || 1)) * 100).toFixed(0)}% of milestone fees paid
          </span>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] p-3 sm:p-5 rounded-xl">
          <span className="text-[10px] sm:text-xs uppercase font-semibold text-amber-400 block mb-0.5 sm:mb-1">
            Pending Balance
          </span>
          <div className="text-xl sm:text-3xl font-bold text-amber-400">
            {formatINR(totalPending)}
          </div>
          <span className="text-[10px] sm:text-xs text-zinc-400 block mt-0.5 sm:mt-1">
            {activeProject.payments.filter((p) => p.status === "pending").length} milestone invoice(s) due
          </span>
        </div>
      </div>

      {/* Indian Payment Gateway Badges */}
      <div className="bg-[#121316] border border-[#27272a] p-2.5 sm:p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-xs text-zinc-400">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="font-semibold text-white">Accepted:</span>
          <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-zinc-200">UPI</span>
          <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-zinc-200">NetBanking</span>
          <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-zinc-200">NEFT/RTGS</span>
          <span className="px-1.5 py-0.5 rounded bg-[#27272a] text-zinc-200">Cards</span>
        </div>
        <span className="text-emerald-400 font-medium">Auto GST Tax Invoices</span>
      </div>

      {/* Invoices List - Solid Table */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="p-3 sm:p-5 border-b border-[#27272a] flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            GST Milestone Invoices Ledger
          </h3>
          <span className="text-[10px] sm:text-xs text-zinc-400">{activeProject.payments.length} Tax Invoices</span>
        </div>

        <div className="divide-y divide-[#27272a]">
          {activeProject.payments.map((invoice) => {
            const isPaid = invoice.status === "paid";

            return (
              <div
                key={invoice.id}
                className="p-3.5 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 hover:bg-[#202024] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isPaid
                        ? "bg-[#064e3b] text-emerald-300"
                        : "bg-[#78350f] text-amber-300"
                    }`}
                  >
                    {isPaid ? "✓" : "₹"}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-zinc-300">
                        {invoice.invoiceNumber}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          isPaid
                            ? "bg-[#064e3b] text-emerald-300"
                            : "bg-[#78350f] text-amber-300"
                        }`}
                      >
                        {isPaid ? "Paid in Full" : "Pending Settlement"}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      {invoice.milestoneTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                      <span>Issued: {invoice.issueDate}</span>
                      <span>•</span>
                      <span>
                        {isPaid ? `Paid: ${invoice.paidDate}` : `Due Date: ${invoice.dueDate}`}
                      </span>
                      <span>•</span>
                      <span className="text-zinc-500">SAC: 998314 (IT Consulting)</span>
                      {invoice.appliedCouponCode && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold bg-[#064e3b] px-2 py-0.5 rounded text-[11px]">
                            Coupon {invoice.appliedCouponCode} (-{formatINR(invoice.appliedDiscountINR || 0)})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-[#27272a]">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-zinc-400 block">
                      {invoice.appliedDiscountINR ? "Net Settled (INR)" : "Amount (INR)"}
                    </span>
                    <div className="flex items-baseline gap-1.5 md:justify-end">
                      <span className="text-base sm:text-lg font-bold text-white">
                        {formatINR(invoice.netPayableINR || invoice.amount)}
                      </span>
                      {invoice.appliedDiscountINR ? (
                        <span className="text-xs line-through text-zinc-500">
                          {formatINR(invoice.amount)}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="bg-[#27272a] hover:bg-[#3f3f46] border-[#3f3f46] text-white text-xs h-9 px-3 gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>GST PDF</span>
                    </Button>

                    {!isPaid && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenPay(invoice)}
                        className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs h-9 px-4 gap-1.5"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Pay via UPI / NetBanking</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indian Pay Modal */}
      <PortalPayModal
        payment={selectedPayment}
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        onConfirmPay={(id, coupon, discount) => payInvoice(id, coupon, discount)}
      />
    </div>
  );
};
