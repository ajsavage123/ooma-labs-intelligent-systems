import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  CreditCard,
  Receipt,
  MessageSquare,
  Server,
  ShieldCheck,
  Search,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface FAQItem {
  id: string;
  category: "lifecycle" | "vip_card" | "billing" | "support" | "hosting";
  question: string;
  answer: string;
  highlights?: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "lifecycle",
    question: "How does the 6-Phase Engineering Lifecycle work?",
    answer:
      "Every project follows our structured 6-phase engineering lifecycle: 1. Client Discovery (asset & API audits), 2. Objective Requirements Gathering (formal SOW and ER diagrams), 3. UI/UX Development (Figma component sign-off), 4. Development (sprint coding and integrations), 5. Testing (cross-device QA & security audits), and 6. Hosting (production deployment on AWS Mumbai with monitoring). Each phase requires your review sign-off before subsequent phases commence.",
    highlights: ["Client Discovery", "Objective Requirements", "UI/UX Sign-off", "Development Sprints", "QA & UAT", "Production Hosting"],
  },
  {
    id: "faq-2",
    category: "vip_card",
    question: "How do I unlock the OOMA LABS VIP Partner Credit Card (₹4,000)?",
    answer:
      "Share your unique quotation link (/free-quotation?ref=...) with fellow enterprise founders. Each referred peer who submits their project requirements, undergoes architectural vetting, and deposits their project advance counts as 1 verified client. The card uncovers progressively by 25% with each verified peer (1/4, 2/4, 3/4). When you reach 4 verified clients, the card unlocks completely with ₹4,000 credit redeemable on milestone invoices and an exclusive 20% discount code.",
    highlights: ["Progressive 25% Reveal", "4 Verified Advance Payments", "₹4,000 Credit Limit", "20% Discount Code"],
  },
  {
    id: "faq-3",
    category: "billing",
    question: "How are milestone payments processed and are invoices GST compliant?",
    answer:
      "All invoices issued by OOMA LABS are 100% compliant with Indian Goods & Services Tax (GST) laws under SAC Code 998314 (IT Design & Development) or SAC 9965 (Logistics Technology). You can pay via UPI (Google Pay, PhonePe, BHIM), NetBanking, or NEFT/RTGS wire transfer. GST input tax credit (ITC) receipts with your registered GSTIN are available immediately for download in the Payments tab.",
    highlights: ["18% GST Compliant", "SAC Code 998314", "UPI / NEFT / NetBanking", "Instant Tax Invoice PDF"],
  },
  {
    id: "faq-4",
    category: "support",
    question: "How fast does OOMA LABS respond to WhatsApp support requests?",
    answer:
      "Enterprise clients have direct access to Lead Systems Architect Arjun Mehta via WhatsApp (+91 8006662364). For priority production issues or urgent deployment queries, our standard response time is under 15 minutes during operating hours (09:00 - 20:00 IST) and under 1 hour 24/7 for critical uptime alerts.",
    highlights: ["Under 15 Mins Response", "Direct WhatsApp Line", "Lead Architect Escalation", "24/7 Uptime Alerts"],
  },
  {
    id: "faq-5",
    category: "hosting",
    question: "Where will my application be hosted and what happens after launch?",
    answer:
      "By default, applications are deployed on secure AWS Mumbai (ap-south-1) multi-AZ infrastructure with automated CloudWatch monitoring, Sentry exception telemetry, and SSL/TLS certificates. Upon project completion and Phase 6 sign-off, we perform full Git repository access transfer, root cloud credential handover, and provide 30 days of complimentary hyper-care maintenance.",
    highlights: ["AWS Mumbai Region", "Multi-AZ High Availability", "Root Git & Cloud Handover", "30 Days Hyper-Care"],
  },
  {
    id: "faq-6",
    category: "lifecycle",
    question: "Can I request changes or new features while development is in progress?",
    answer:
      "Yes! Use the 'Project Comments' tab in your client portal to comment directly on specific sprint specifications, or create a formal ticket in the Support tab. Minor iterative adjustments are accommodated within existing sprint buffers, while major scope modifications receive a fast-turnaround Change Order (CR) proposal.",
    highlights: ["Specification Commenting", "Sprint Buffer Flexibility", "Formal Change Orders"],
  },
];

export const PortalFAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Solid Deep Slate */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#2563eb]" />
            Frequently Asked Questions & Client Guide
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Everything you need to know about the 6-phase lifecycle, VIP card rewards, billing, and WhatsApp support.
          </p>
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#121316] border-[#27272a] text-white text-xs placeholder:text-zinc-500 h-9"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "all", label: "All Questions" },
          { key: "lifecycle", label: "6-Phase Lifecycle", icon: Layers },
          { key: "vip_card", label: "VIP Credit Card (₹4,000)", icon: CreditCard },
          { key: "billing", label: "Billing & GST", icon: Receipt },
          { key: "support", label: "WhatsApp Support", icon: MessageSquare },
          { key: "hosting", label: "Hosting & Handover", icon: Server },
        ].map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                activeCategory === cat.key
                  ? "bg-[#2563eb] text-white border-blue-500"
                  : "bg-[#18181b] text-zinc-400 border-[#27272a] hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#18181b] border border-[#27272a] text-center text-xs text-zinc-400">
            No matching questions found. Try a different search term or message us on WhatsApp!
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedId === faq.id;

            return (
              <div
                key={faq.id}
                className={`bg-[#18181b] border rounded-xl overflow-hidden transition-colors ${
                  isExpanded ? "border-[#3f3f46]" : "border-[#27272a]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#202024] transition-colors"
                >
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <div className="w-7 h-7 rounded bg-[#27272a] flex items-center justify-center text-zinc-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#27272a] bg-[#121316] space-y-3">
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {faq.answer}
                    </p>

                    {faq.highlights && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {faq.highlights.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#18181b] text-zinc-400 border border-[#27272a]"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
