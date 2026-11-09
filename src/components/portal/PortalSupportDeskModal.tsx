import React, { useState, useMemo, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SupportTicket, TicketPriority, TicketStatus, TicketAttachment } from "../../types";
import { useClientPortal } from "../../context/ClientPortalContext";
import {
  Headphones,
  Plus,
  Send,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Paperclip,
  X,
  Eye,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  Bug,
  Sparkles,
  GitPullRequest,
  CreditCard,
  ShieldAlert,
  HelpCircle,
  Monitor,
  PhoneCall,
  FileImage,
} from "lucide-react";
import { toast } from "sonner";
import { PortalTicketModal } from "./PortalTicketModal";
import { PortalImageLightbox } from "./PortalImageLightbox";

interface PortalSupportDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateTicket?: () => void;
}

export const PortalSupportDeskModal: React.FC<PortalSupportDeskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeProject, createSupportTicket, addTicketReply, clientUser } = useClientPortal();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TicketStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TicketPriority>("all");
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  // New Ticket Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Lightbox preview state
  const [previewAttachment, setPreviewAttachment] = useState<TicketAttachment | null>(null);

  // Reply state per ticket
  const [replyTextMap, setReplyTextMap] = useState<{ [ticketId: string]: string }>({});
  const [replyAttachmentsMap, setReplyAttachmentsMap] = useState<{ [ticketId: string]: TicketAttachment[] }>({});
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

  const replyFileInputRef = useRef<HTMLInputElement>(null);
  const [activeReplyTicketId, setActiveReplyTicketId] = useState<string | null>(null);

  const tickets = useMemo(() => {
    return activeProject?.supportTickets || [];
  }, [activeProject]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = t.ticketNumber?.toLowerCase().includes(q);
        const matchesTitle = t.title?.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesCategory = t.category?.toLowerCase().includes(q);
        return matchesNumber || matchesTitle || matchesDesc || matchesCategory;
      }
      return true;
    });
  }, [tickets, statusFilter, priorityFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      in_progress: tickets.filter((t) => t.status === "in_progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
    };
  }, [tickets]);

  const handleCopyTicketNumber = (ticketNumber: string, ticketId: string) => {
    navigator.clipboard.writeText(ticketNumber);
    setCopiedTicketId(ticketId);
    toast.success(`Copied ${ticketNumber} to clipboard`);
    setTimeout(() => setCopiedTicketId(null), 2000);
  };

  // Reply screenshot upload handling
  const handleReplyFileUpload = (ticketId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const currentAtts = replyAttachmentsMap[ticketId] || [];
    if (currentAtts.length + files.length > 4) {
      toast.error("You can attach up to 4 screenshots per reply.");
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5 MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const newAttachment: TicketAttachment = {
          id: `att-reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: file.size,
          url: base64,
          type: file.type,
        };
        setReplyAttachmentsMap((prev) => ({
          ...prev,
          [ticketId]: [...(prev[ticketId] || []), newAttachment],
        }));
        toast.success(`Attached ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveReplyAttachment = (ticketId: string, attachmentId: string) => {
    setReplyAttachmentsMap((prev) => ({
      ...prev,
      [ticketId]: (prev[ticketId] || []).filter((a) => a.id !== attachmentId),
    }));
  };

  const handleSendReply = (ticketId: string) => {
    const text = replyTextMap[ticketId]?.trim() || "";
    const atts = replyAttachmentsMap[ticketId] || [];

    if (!text && atts.length === 0) {
      toast.error("Please enter a reply or attach a screenshot.");
      return;
    }

    addTicketReply(ticketId, text || "Attached additional screenshot.", atts);
    setReplyTextMap((prev) => ({ ...prev, [ticketId]: "" }));
    setReplyAttachmentsMap((prev) => ({ ...prev, [ticketId]: [] }));
    toast.success("Reply submitted to engineering team!");
  };

  const getCategoryDetails = (category: SupportTicket["category"]) => {
    switch (category) {
      case "bug":
        return { label: "Bug / Defect", icon: Bug, color: "text-red-700 bg-red-50 border-red-200" };
      case "change_request":
        return { label: "Change Request", icon: GitPullRequest, color: "text-purple-700 bg-purple-50 border-purple-200" };
      case "feature":
        return { label: "New Feature", icon: Sparkles, color: "text-blue-700 bg-blue-50 border-blue-200" };
      case "billing":
        return { label: "Billing", icon: CreditCard, color: "text-amber-700 bg-amber-50 border-amber-200" };
      case "security":
        return { label: "Security", icon: ShieldAlert, color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      default:
        return { label: "General", icon: HelpCircle, color: "text-slate-700 bg-slate-50 border-slate-200" };
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            Critical (2-4h SLA)
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            High (12h SLA)
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Medium (24h SLA)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Low (48h SLA)
          </span>
        );
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolved
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Open
          </span>
        );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 flex flex-col">
          {/* Header */}
          <DialogHeader className="text-left space-y-1 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      Engineering Support Desk
                    </DialogTitle>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {counts.all} Tickets
                    </span>
                  </div>
                  <DialogDescription className="text-xs text-slate-500">
                    Direct communication, issue resolution, and bug tracking with OOMA LABS development team.
                  </DialogDescription>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <a
                  href={`https://wa.me/919849021345?text=${encodeURIComponent(
                    `Hi Arjun, checking in on OOMA LABS support for project ${activeProject.id} (${activeProject.company}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
                  title="Direct WhatsApp Hotline with Lead Architect"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Desk</span>
                </a>

                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-3.5 rounded-xl gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Ticket</span>
                </Button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Status tabs */}
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl overflow-x-auto">
                {(
                  [
                    { key: "all", label: "All", count: counts.all },
                    { key: "open", label: "Open", count: counts.open },
                    { key: "in_progress", label: "In Progress", count: counts.in_progress },
                    { key: "resolved", label: "Resolved", count: counts.resolved },
                  ] as const
                ).map((tab) => {
                  const isActive = statusFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setStatusFilter(tab.key)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        isActive
                          ? "bg-white text-blue-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive ? "bg-blue-100 text-blue-800" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ticket #, title, or issue..."
                  className="pl-8 pr-3 h-8 bg-slate-50 border-slate-200 text-xs rounded-xl focus:bg-white"
                />
              </div>
            </div>
          </DialogHeader>

          {/* Ticket Feed List */}
          <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
            {filteredTickets.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Headphones className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {searchQuery ? "No matching tickets found" : "No Support Tickets Yet"}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                    {searchQuery
                      ? "Try searching with a different keyword or reset the filter."
                      : "Everything is running smoothly! If you encounter a bug or need architecture adjustments, open a ticket below."}
                  </p>
                </div>
                {!searchQuery && (
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 rounded-xl gap-1.5 mt-2 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Your First Ticket</span>
                  </Button>
                )}
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isExpanded = expandedTicketId === ticket.id;
                const categoryInfo = getCategoryDetails(ticket.category);
                const CategoryIcon = categoryInfo.icon;
                const attachmentsList = ticket.attachments || [];
                const replyAttachments = replyAttachmentsMap[ticket.id] || [];

                return (
                  <div
                    key={ticket.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? "bg-white border-blue-300 shadow-md ring-1 ring-blue-200"
                        : "bg-slate-50/70 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    {/* Ticket Summary Row */}
                    <div
                      onClick={() => setExpandedTicketId((prev) => (prev === ticket.id ? null : ticket.id))}
                      className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Category Icon Glyphs */}
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          <CategoryIcon className="w-4 h-4 text-blue-600" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            {/* Ticket Number */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyTicketNumber(ticket.ticketNumber, ticket.id);
                              }}
                              className="font-mono text-[11px] font-black text-slate-800 bg-slate-200/80 hover:bg-slate-300 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors"
                              title="Click to copy ticket number"
                            >
                              <span>{ticket.ticketNumber}</span>
                              {copiedTicketId === ticket.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 text-slate-400" />
                              )}
                            </button>

                            {/* Category badge */}
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryInfo.color}`}
                            >
                              {categoryInfo.label}
                            </span>

                            {/* Priority badge with SLA */}
                            {getPriorityBadge(ticket.priority)}

                            {/* Status badge */}
                            {getStatusBadge(ticket.status)}

                            {/* Attachments pill */}
                            {attachmentsList.length > 0 && (
                              <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                                <FileImage className="w-3 h-3 text-blue-500" />
                                <span>{attachmentsList.length}</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {ticket.title}
                          </h3>

                          <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                            <span>Opened {ticket.createdAt}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                              {ticket.assignedEngineer || "Arjun Mehta (Lead Systems Architect)"}
                            </span>
                            {ticket.updates?.length > 1 && (
                              <>
                                <span>•</span>
                                <span className="text-blue-600 font-bold">
                                  {ticket.updates.length} updates
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {ticket.updatedAt || "Active"}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-2xs">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 bg-white border-t border-slate-200/90 space-y-4 animate-in fade-in duration-150">
                        {/* Initial Description */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Issue Description
                          </span>
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {ticket.description}
                          </div>
                        </div>

                        {/* Screenshots & Photos Gallery */}
                        {attachmentsList.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                              Attached Screenshots ({attachmentsList.length})
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              {attachmentsList.map((att) => (
                                <div
                                  key={att.id}
                                  onClick={() => setPreviewAttachment(att)}
                                  className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer shadow-xs hover:border-blue-400 transition-all"
                                >
                                  <div className="h-24 w-full overflow-hidden bg-slate-900">
                                    <img
                                      src={att.url}
                                      alt={att.name}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                      <Eye className="w-5 h-5" />
                                    </div>
                                  </div>
                                  <div className="p-1.5 bg-white flex items-center justify-between text-[10px] text-slate-600">
                                    <span className="truncate max-w-[110px] font-medium">{att.name}</span>
                                    <span className="text-slate-400 font-mono">
                                      {att.size < 1024 * 1024
                                        ? `${(att.size / 1024).toFixed(0)} KB`
                                        : `${(att.size / (1024 * 1024)).toFixed(1)} MB`}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Client Telemetry Pill */}
                        {ticket.deviceInfo && (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                            <Monitor className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>Client Telemetry:</span>
                            <strong className="text-slate-700">
                              {ticket.deviceInfo.os} • {ticket.deviceInfo.browser} • {ticket.deviceInfo.screen}
                            </strong>
                          </div>
                        )}

                        {/* Updates / Conversation History */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Engineering Activity & Discussion ({ticket.updates?.length || 0})
                          </span>

                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {ticket.updates?.map((up, idx) => {
                              const isClient = up.senderRole === "client" || up.sender === clientUser?.name;
                              return (
                                <div
                                  key={up.id || idx}
                                  className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                                    isClient
                                      ? "bg-blue-50/50 border-blue-200/80 text-slate-900 ml-4"
                                      : "bg-slate-50 border-slate-200 text-slate-900 mr-4"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <strong className="font-bold text-slate-900">{up.sender}</strong>
                                      <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-white border border-slate-200 text-slate-600">
                                        {isClient ? "Client" : "Engineering Team"}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">{up.time}</span>
                                  </div>
                                  <p className="text-slate-700 pl-1">{up.message}</p>

                                  {/* Reply attachments if present */}
                                  {up.attachments && up.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1 pl-1">
                                      {up.attachments.map((att) => (
                                        <button
                                          key={att.id}
                                          type="button"
                                          onClick={() => setPreviewAttachment(att)}
                                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-blue-600 hover:underline shadow-2xs"
                                        >
                                          <FileImage className="w-3 h-3" />
                                          <span className="max-w-[120px] truncate">{att.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Reply Composer with Screenshot Attachment */}
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          {/* Attached files preview before sending reply */}
                          {replyAttachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                              {replyAttachments.map((att) => (
                                <div
                                  key={att.id}
                                  className="relative group rounded-lg border border-slate-200 bg-white p-1 pr-6 flex items-center gap-1.5 text-[10px]"
                                >
                                  <FileImage className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                  <span className="truncate max-w-[120px] font-medium">{att.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveReplyAttachment(ticket.id, att.id)}
                                    className="absolute right-1 text-slate-400 hover:text-red-600"
                                    title="Remove"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {/* Hidden file input for reply screenshots */}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              id={`reply-file-${ticket.id}`}
                              onChange={(e) => handleReplyFileUpload(ticket.id, e.target.files)}
                            />

                            <label
                              htmlFor={`reply-file-${ticket.id}`}
                              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                              title="Attach screenshot to reply"
                            >
                              <Paperclip className="w-4 h-4" />
                            </label>

                            <Input
                              value={replyTextMap[ticket.id] || ""}
                              onChange={(e) =>
                                setReplyTextMap((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                              }
                              placeholder="Type a response to the engineering team..."
                              className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl flex-1 focus:bg-white"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendReply(ticket.id);
                                }
                              }}
                            />

                            <Button
                              onClick={() => handleSendReply(ticket.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-4 rounded-xl gap-1.5 shadow-sm active:scale-95"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Send Reply</span>
                            </Button>
                          </div>

                          {/* WhatsApp Direct Action for this Ticket */}
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                            <span>Press Enter to send. Screenshots can also be attached.</span>
                            <a
                              href={`https://wa.me/919849021345?text=${encodeURIComponent(
                                `Hi Arjun, regarding Ticket ${ticket.ticketNumber} [${ticket.title}] for ${activeProject.title}: `
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Discuss {ticket.ticketNumber} on WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Ticket Modal */}
      <PortalTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitTicket={createSupportTicket}
      />

      {/* Image Lightbox */}
      <PortalImageLightbox
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />
    </>
  );
};

