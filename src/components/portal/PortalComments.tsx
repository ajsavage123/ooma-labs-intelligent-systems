import React, { useState } from "react";
import { useClientPortal } from "../../context/ClientPortalContext";
import { MessageSquare, Send, Paperclip, Pin, User, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const PortalComments: React.FC = () => {
  const { activeProject, clientUser, addComment } = useClientPortal();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      addComment(newComment);
      setNewComment("");
      setIsSubmitting(false);
      toast.success("Message sent to the project team!");
    }, 300);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "lead_architect":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#1e3a8a] text-blue-300">Lead Engineer</span>;
      case "client":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#27272a] text-zinc-300">Client</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#27272a] text-zinc-400">Team</span>;
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Header Banner - Solid */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563eb]" />
            Project Discussion & Team Messages
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
            Direct communication thread with your dedicated OOMA LABS development team.
          </p>
        </div>

        <div className="text-[11px] sm:text-xs text-zinc-300 bg-[#27272a] px-3 py-1.5 rounded-lg border border-[#3f3f46] self-start sm:self-auto">
          {activeProject.comments.length} Messages in this project
        </div>
      </div>

      {/* Composer Card - Solid */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 space-y-2.5 sm:space-y-3">
        <form onSubmit={handlePost} className="space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300">From:</span>
            <span className="text-white font-medium">{clientUser?.name} ({clientUser?.company})</span>
          </div>

          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a message, request changes, or ask a question about project phases..."
            rows={3}
            className="bg-[#121316] border-[#27272a] text-white text-xs sm:text-sm focus:border-[#2563eb] resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => toast.info("Drag and drop files or screenshots to attach")}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attach File</span>
            </button>

            <Button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold gap-1.5 px-3.5 h-8 sm:h-9"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Messages Feed */}
      <div className="space-y-2.5 sm:space-y-3">
        {activeProject.comments.map((comment) => (
          <div
            key={comment.id}
            className={`rounded-xl sm:rounded-2xl border p-3.5 sm:p-5 space-y-2 sm:space-y-2.5 ${
              comment.isPinned
                ? "bg-[#18181b] border-[#d97706]"
                : "bg-[#18181b] border-[#27272a]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-[#27272a] border border-[#3f3f46] shrink-0">
                  {comment.authorAvatar ? (
                    <img src={comment.authorAvatar} alt={comment.authorName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                      {comment.authorName.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white">{comment.authorName}</h3>
                    {getRoleBadge(comment.authorRole)}
                  </div>
                  <span className="text-[10px] sm:text-xs text-zinc-400">{comment.timestamp}</span>
                </div>
              </div>

              {comment.isPinned && (
                <span className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold bg-[#78350f] text-amber-300 px-2 py-0.5 rounded">
                  <Pin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Pinned Note</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-0 sm:pl-11">
              {comment.message}
            </p>

            <div className="flex items-center justify-between pl-0 sm:pl-11 pt-2 border-t border-[#27272a] text-[11px] sm:text-xs text-zinc-400">
              <button
                onClick={() => toast.success("Marked as helpful")}
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful</span>
              </button>
              <span>OOMA Client Workspace</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
