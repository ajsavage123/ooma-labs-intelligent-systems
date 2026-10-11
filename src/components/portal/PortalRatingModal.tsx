import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface PortalRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRating: (data: {
    overallScore: number;
    categories: {
      engineeringQuality: number;
      communication: number;
      velocity: number;
      uiUxDesign: number;
    };
    feedbackText: string;
    clientRecommendation: boolean;
  }) => void;
}

export const PortalRatingModal: React.FC<PortalRatingModalProps> = ({
  isOpen,
  onClose,
  onSubmitRating,
}) => {
  const [overallScore, setOverallScore] = useState(5);
  const [engineeringQuality, setEngineeringQuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [velocity, setVelocity] = useState(5);
  const [uiUxDesign, setUiUxDesign] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [clientRecommendation, setClientRecommendation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error("Please add a short note describing your experience");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitRating({
        overallScore,
        categories: {
          engineeringQuality,
          communication,
          velocity,
          uiUxDesign,
        },
        feedbackText,
        clientRecommendation,
      });
      setIsSubmitting(false);
      toast.success("Thank you for your feedback!");
      setFeedbackText("");
      onClose();
    }, 400);
  };

  const renderStars = (value: number, onChange: (val: number) => void) => (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-4 h-4 ${
              star <= value ? "text-amber-400 fill-amber-400" : "text-zinc-600"
            }`}
          />
        </button>
      ))}
      <span className="text-xs font-semibold text-zinc-300 ml-1.5">{value}/5</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#18181b] border border-[#27272a] text-white rounded-xl p-6 sm:p-7 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Write a Project Review
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            Your feedback helps us refine our engineering lifecycle phases and maintain quality.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Overall Stars */}
          <div className="p-3 rounded-lg bg-[#121316] border border-[#27272a] flex items-center justify-between">
            <Label className="text-xs font-semibold text-zinc-300">Overall Satisfaction</Label>
            {renderStars(overallScore, setOverallScore)}
          </div>

          {/* Sub-criteria */}
          <div className="space-y-2.5 p-3.5 rounded-lg bg-[#121316] border border-[#27272a] text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Engineering Quality</span>
              {renderStars(engineeringQuality, setEngineeringQuality)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Communication & Updates</span>
              {renderStars(communication, setCommunication)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Delivery Velocity</span>
              {renderStars(velocity, setVelocity)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">UI/UX Design</span>
              {renderStars(uiUxDesign, setUiUxDesign)}
            </div>
          </div>

          <div>
            <Label className="text-xs text-zinc-300">Review Comments</Label>
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What did the engineering team do well? Any suggestions for upcoming phases?"
              rows={3}
              className="bg-[#121316] border-[#27272a] text-white text-xs mt-1 focus:border-[#2563eb] resize-none"
              required
            />
          </div>

          <div
            onClick={() => setClientRecommendation(!clientRecommendation)}
            className="flex items-center gap-3 p-3 rounded-lg border border-[#27272a] bg-[#121316] cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                clientRecommendation ? "bg-[#064e3b] text-emerald-300" : "border border-zinc-500"
              }`}
            >
              {clientRecommendation && "✓"}
            </div>
            <span className="text-xs text-zinc-300">
              I would recommend OOMA LABS to other engineering teams.
            </span>
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
              className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs h-10"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
