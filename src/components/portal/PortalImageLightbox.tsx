import React, { useEffect } from "react";
import { X, Download, ZoomIn, FileImage } from "lucide-react";
import { TicketAttachment } from "../../types";

interface PortalImageLightboxProps {
  attachment: TicketAttachment | null;
  onClose: () => void;
}

export const PortalImageLightbox: React.FC<PortalImageLightboxProps> = ({
  attachment,
  onClose,
}) => {
  useEffect(() => {
    if (!attachment) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [attachment, onClose]);

  if (!attachment) return null;

  const formatSize = (bytes: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = attachment.url;
    a.download = attachment.name || "screenshot.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top action bar */}
      <div
        className="w-full max-w-4xl flex items-center justify-between text-white pb-3 sm:pb-4 border-b border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-4">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <FileImage className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold truncate text-white">
              {attachment.name}
            </h4>
            <span className="text-[10px] text-zinc-400 font-mono">
              {formatSize(attachment.size)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Download image"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Close viewer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main image container */}
      <div
        className="flex-1 w-full max-w-4xl flex items-center justify-center p-2 sm:p-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl border border-white/10 bg-zinc-950"
        />
      </div>

      <div className="text-[11px] text-zinc-400 pt-2">
        Click anywhere outside or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px]">Esc</kbd> to exit
      </div>
    </div>
  );
};

