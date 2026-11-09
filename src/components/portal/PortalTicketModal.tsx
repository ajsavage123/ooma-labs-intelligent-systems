import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SupportTicket, TicketPriority, TicketAttachment } from "../../types";
import {
  Send,
  UploadCloud,
  X,
  Image as ImageIcon,
  AlertTriangle,
  Bug,
  Sparkles,
  GitPullRequest,
  CreditCard,
  ShieldAlert,
  HelpCircle,
  Eye,
  Monitor,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PortalImageLightbox } from "./PortalImageLightbox";

interface PortalTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTicket: (data: {
    title: string;
    description: string;
    category: SupportTicket["category"];
    priority: TicketPriority;
    attachments?: TicketAttachment[];
    deviceInfo?: SupportTicket["deviceInfo"];
  }) => void;
}

const CATEGORIES: {
  key: SupportTicket["category"];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  { key: "bug", label: "Bug / Defect", icon: Bug, description: "System error, broken flow, or visual defect" },
  { key: "change_request", label: "Change Request", icon: GitPullRequest, description: "Modification to agreed SOW or workflow" },
  { key: "feature", label: "New Feature", icon: Sparkles, description: "New functionality or capability request" },
  { key: "billing", label: "Billing & Invoicing", icon: CreditCard, description: "Milestone payment, invoice, or tax question" },
  { key: "security", label: "Security & Access", icon: ShieldAlert, description: "Credentials, permissions, or security inquiry" },
  { key: "general_inquiry", label: "General Inquiry", icon: HelpCircle, description: "Technical questions or architecture guidance" },
];

const PRIORITIES: {
  key: TicketPriority;
  label: string;
  sla: string;
  badgeClass: string;
  dotColor: string;
}[] = [
  { key: "urgent", label: "Critical Blocker", sla: "2-4h Response SLA", badgeClass: "border-red-300 bg-red-50 text-red-700", dotColor: "bg-red-500" },
  { key: "high", label: "High Priority", sla: "12h Response SLA", badgeClass: "border-amber-300 bg-amber-50 text-amber-800", dotColor: "bg-amber-500" },
  { key: "medium", label: "Standard / Medium", sla: "24h Response SLA", badgeClass: "border-blue-300 bg-blue-50 text-blue-700", dotColor: "bg-blue-500" },
  { key: "low", label: "Low / Cosmetic", sla: "48h Response SLA", badgeClass: "border-slate-300 bg-slate-50 text-slate-700", dotColor: "bg-slate-400" },
];

export const PortalTicketModal: React.FC<PortalTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmitTicket,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("bug");
  const [priority, setPriority] = useState<TicketPriority>("high");
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [includeDeviceInfo, setIncludeDeviceInfo] = useState(true);
  const [previewAttachment, setPreviewAttachment] = useState<TicketAttachment | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect client environment for faster bug reproduction
  const detectedDeviceInfo = {
    os: typeof navigator !== "undefined" ? (navigator.userAgent.includes("Windows") ? "Windows" : navigator.userAgent.includes("Mac") ? "macOS" : navigator.userAgent.includes("Linux") ? "Linux" : "Mobile / Other") : "Unknown",
    browser: typeof navigator !== "undefined" ? (navigator.userAgent.includes("Chrome") ? "Chrome" : navigator.userAgent.includes("Firefox") ? "Firefox" : navigator.userAgent.includes("Safari") ? "Safari" : "Browser") : "Unknown",
    screen: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "Unknown",
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
  };

  // Convert File to base64 Data URL and add to attachments
  const processFiles = (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (attachments.length + fileList.length > 6) {
      toast.error("You can upload a maximum of 6 screenshots per ticket.");
      return;
    }

    fileList.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image. Please attach PNG, JPG, or WEBP.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5 MB. Please select a smaller screenshot.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const newAttachment: TicketAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name || "screenshot.png",
          size: file.size,
          url: base64,
          type: file.type,
        };
        setAttachments((prev) => [...prev, newAttachment]);
        toast.success(`Attached ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  // Clipboard paste listener: paste screenshots directly!
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      processFiles(imageFiles);
      toast.success("Screenshot pasted from clipboard!");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both subject and description");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitTicket({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        attachments,
        deviceInfo: includeDeviceInfo ? detectedDeviceInfo : undefined,
      });
      setIsSubmitting(false);
      toast.success("Support ticket opened! An engineer will review it shortly.");
      setTitle("");
      setDescription("");
      setAttachments([]);
      onClose();
    }, 400);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          onPaste={handlePaste}
          className="max-w-xl max-h-[90vh] bg-white text-slate-900 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 overflow-y-auto"
        >
          <DialogHeader className="text-left space-y-1 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                <Bug className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Create Support Ticket
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Submit bugs, change requests, or technical assistance directly to OOMA LABS engineering.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-3">
            {/* Subject Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-bold text-slate-700">Subject</Label>
                <span className="text-[10px] text-slate-400 font-mono">{title.length}/100</span>
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                placeholder="e.g. Map pins fail to refresh after live GPS vehicle update"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
            </div>

            {/* Category Selector Grid */}
            <div>
              <Label className="text-xs font-bold text-slate-700 block mb-1.5">
                Category
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCategory(cat.key)}
                      className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-600 text-blue-900 ring-1 ring-blue-600 shadow-xs"
                          : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-blue-600" : "text-slate-500"}`} />
                        <span className="text-xs font-bold truncate">{cat.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        {cat.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Selector & Guaranteed SLA */}
            <div>
              <Label className="text-xs font-bold text-slate-700 block mb-1.5">
                Priority & Guaranteed SLA Response
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRIORITIES.map((pri) => {
                  const isSelected = priority === pri.key;
                  return (
                    <button
                      key={pri.key}
                      type="button"
                      onClick={() => setPriority(pri.key)}
                      className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                        isSelected
                          ? `${pri.badgeClass} ring-2 ring-current font-bold shadow-xs`
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${pri.dotColor}`} />
                        <span className="text-xs font-bold">{pri.label}</span>
                      </div>
                      <span className="text-[10px] opacity-80 mt-1 font-mono font-medium">
                        {pri.sla}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <Label className="text-xs font-bold text-slate-700 block mb-1">
                Detailed Description & Reproduction Steps
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="1. Navigate to Live GPS Tracking&#10;2. Click on vehicle AP-09-BK-9182&#10;3. Observe that coordinates do not refresh..."
                rows={4}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs rounded-xl focus:border-blue-500 focus:bg-white resize-none leading-relaxed"
                required
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Tip: You can paste screenshots directly into this form using <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[9px]">Ctrl+V</kbd>!
              </span>
            </div>

            {/* Photo / Screenshot Upload Zone */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Screenshots & Photos ({attachments.length}/6)</span>
                </Label>
                <span className="text-[10px] text-slate-400">PNG, JPG, WEBP (Max 5MB each)</span>
              </div>

              {/* Drag & Drop Box */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/80 scale-[1.01]"
                    : "border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) processFiles(e.target.files);
                  }}
                />
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    Click to browse or drag & drop screenshots here
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Or capture a screenshot with <kbd className="px-1 py-0.2 rounded bg-white border border-slate-200 font-mono text-[10px]">Win+Shift+S</kbd> and press <kbd className="px-1 py-0.2 rounded bg-white border border-slate-200 font-mono text-[10px]">Ctrl+V</kbd>
                  </p>
                </div>
              </div>

              {/* Attachments Preview Gallery */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2.5">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex flex-col shadow-xs"
                    >
                      <div className="relative h-20 w-full overflow-hidden bg-slate-900">
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewAttachment(att)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          title="Zoom image"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAttachment(att.id);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="p-1.5 bg-white flex items-center justify-between text-[10px] text-slate-500">
                        <span className="truncate font-medium max-w-[100px]">{att.name}</span>
                        <span className="font-mono text-slate-400">
                          {att.size < 1024 * 1024 ? `${(att.size / 1024).toFixed(0)} KB` : `${(att.size / (1024 * 1024)).toFixed(1)} MB`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Auto Device / Environment Capture Pill */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={includeDeviceInfo}
                  onChange={(e) => setIncludeDeviceInfo(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Attach client environment telemetry</span>
                </div>
              </label>

              {includeDeviceInfo && (
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                  {detectedDeviceInfo.os} • {detectedDeviceInfo.browser} • {detectedDeviceInfo.screen}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 text-xs h-11 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 rounded-xl gap-2 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Opening Ticket..." : "Submit Support Ticket"}</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lightbox Preview */}
      <PortalImageLightbox
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />
    </>
  );
};
