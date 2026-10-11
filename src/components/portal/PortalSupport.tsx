import React, { useState } from "react";
import { useClientPortal } from "../../context/ClientPortalContext";
import { SupportTicket, TicketPriority } from "../../types";
import {
  Headphones,
  Plus,
  Send,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  User,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PortalTicketModal } from "./PortalTicketModal";

export const PortalSupport: React.FC = () => {
  const { activeProject, createSupportTicket, addTicketReply } = useClientPortal();
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(
    activeProject.supportTickets[0]?.id || null
  );
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const handleSendReply = (ticketId: string) => {
    const text = replyText[ticketId];
    if (!text || !text.trim()) return;
    addTicketReply(ticketId, text);
    setReplyText((prev) => ({ ...prev, [ticketId]: "" }));
    toast.success("Reply submitted to engineering support!");
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case "urgent":
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#991b1b] text-red-200">Urgent</span>;
      case "high":
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#78350f] text-amber-200">High</span>;
      case "medium":
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#1e3a8a] text-blue-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#27272a] text-zinc-300">Low</span>;
    }
  };

  const whatsappPrefilledUrl = `https://wa.me/918006662364?text=${encodeURIComponent(
    `Namaste OOMA LABS Support! Project: ${activeProject.id} (${activeProject.company}) - `
  )}`;

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Header Banner - Solid */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
            <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563eb]" />
            Engineering Support & Direct WhatsApp Desk
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
            Need urgent architecture assistance? Chat directly on WhatsApp or submit a formal ticket below.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 shrink-0 w-full sm:w-auto">
          <a
            href={whatsappPrefilledUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 sm:h-9 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors text-center"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <Button
            onClick={() => setIsTicketModalOpen(true)}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs h-8 sm:h-9 px-3 sm:px-4 gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Ticket</span>
          </Button>
        </div>
      </div>

      {/* Emergency Contact Banner - Solid Emerald/Zinc */}
      <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#18181b] border border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-950 border border-emerald-700/50 text-emerald-400 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Direct WhatsApp Hotline (+91 8006662364)</h4>
            <span className="text-[11px] sm:text-xs text-zinc-400">
              Direct connection to Lead Architect Arjun Mehta. Prefilled with Project ID <strong>{activeProject.id}</strong>.
            </span>
          </div>
        </div>

        <a
          href={whatsappPrefilledUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto shadow-md"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Launch WhatsApp Chat</span>
        </a>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Tickets</h3>

        {activeProject.supportTickets.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#18181b] border border-[#27272a] text-center text-xs text-zinc-400">
            No active support tickets. Everything is running smoothly!
          </div>
        ) : (
          activeProject.supportTickets.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;

            return (
              <div
                key={ticket.id}
                className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden"
              >
                {/* Summary Row */}
                <div
                  onClick={() =>
                    setExpandedTicketId((prev) => (prev === ticket.id ? null : ticket.id))
                  }
                  className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#202024] transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#27272a] text-zinc-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      #
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-zinc-300">
                          {ticket.ticketNumber}
                        </span>
                        {getPriorityBadge(ticket.priority)}
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            ticket.status === "resolved"
                              ? "bg-[#064e3b] text-emerald-300"
                              : "bg-[#1e3a8a] text-blue-300"
                          }`}
                        >
                          {ticket.status === "resolved" ? "Resolved" : "In Progress"}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{ticket.title}</h4>
                      <div className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-3">
                        <span>Opened: {ticket.createdAt}</span>
                        <span>•</span>
                        <span>Assigned to: {ticket.assignedEngineer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#27272a]">
                    <span className="text-xs text-zinc-400">Updated {ticket.updatedAt}</span>
                    <div className="w-7 h-7 rounded bg-[#27272a] flex items-center justify-center text-zinc-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Thread */}
                {isExpanded && (
                  <div className="p-5 bg-[#121316] border-t border-[#27272a] space-y-4">
                    <p className="text-xs sm:text-sm text-zinc-300 p-3.5 rounded-lg bg-[#18181b] border border-[#27272a]">
                      {ticket.description}
                    </p>

                    {/* Updates */}
                    <div className="space-y-2 pt-1">
                      <h5 className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                        Thread History ({ticket.updates.length})
                      </h5>

                      {ticket.updates.map((update) => (
                        <div
                          key={update.id}
                          className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-white">{update.sender}</strong>
                            <span className="text-zinc-500">{update.time}</span>
                          </div>
                          <p className="text-zinc-300 pl-2">{update.message}</p>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input */}
                    <div className="pt-2 flex gap-2">
                      <Input
                        value={replyText[ticket.id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                        }
                        placeholder="Type a reply to the engineering team..."
                        className="bg-[#18181b] border-[#27272a] text-white text-xs h-9"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendReply(ticket.id);
                        }}
                      />
                      <Button
                        onClick={() => handleSendReply(ticket.id)}
                        className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs px-3 h-9"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Ticket Modal */}
      <PortalTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSubmitTicket={createSupportTicket}
      />
    </div>
  );
};
