import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupportTicket, TicketPriority } from "../../types";
import { Headphones, Send } from "lucide-react";
import { toast } from "sonner";

interface PortalTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTicket: (data: {
    title: string;
    description: string;
    category: SupportTicket["category"];
    priority: TicketPriority;
  }) => void;
}

export const PortalTicketModal: React.FC<PortalTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmitTicket,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("feature");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both subject and description");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitTicket({
        title,
        description,
        category,
        priority,
      });
      setIsSubmitting(false);
      toast.success("Support ticket opened! An engineer will review it shortly.");
      setTitle("");
      setDescription("");
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#18181b] border border-[#27272a] text-white rounded-xl p-6 sm:p-7 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Create Support Ticket
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            Directly submit bug reports or change requests to the engineering team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <Label className="text-xs text-zinc-300">Subject</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need additional filter on dispatch report table"
              className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1 focus:border-[#2563eb]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-zinc-300">Category</Label>
              <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                <SelectTrigger className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#18181b] border-[#27272a] text-white">
                  <SelectItem value="bug">Bug / Issue</SelectItem>
                  <SelectItem value="change_request">Change Request</SelectItem>
                  <SelectItem value="feature">New Feature</SelectItem>
                  <SelectItem value="billing">Invoicing Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Priority</Label>
              <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                <SelectTrigger className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#18181b] border-[#27272a] text-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs text-zinc-300">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, reproduction steps, or details..."
              rows={4}
              className="bg-[#121316] border-[#27272a] text-white text-xs mt-1 focus:border-[#2563eb] resize-none"
              required
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] border-[#3f3f46] text-white text-xs h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs h-10 gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit Ticket"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
