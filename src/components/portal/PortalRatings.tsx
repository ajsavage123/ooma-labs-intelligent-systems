import React, { useState } from "react";
import { useClientPortal } from "../../context/ClientPortalContext";
import { Star, ThumbsUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalRatingModal } from "./PortalRatingModal";

export const PortalRatings: React.FC = () => {
  const { activeProject, submitRating } = useClientPortal();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const avgOverall =
    activeProject.ratings.length > 0
      ? (
          activeProject.ratings.reduce((acc, r) => acc + r.overallScore, 0) /
          activeProject.ratings.length
        ).toFixed(1)
      : "5.0";

  const renderStars = (score: number) => (
    <div className="flex gap-1 text-amber-400">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${
            s <= score ? "fill-amber-400 text-amber-400" : "text-zinc-600"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Header Banner - Solid */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
            Project Ratings & Milestone Reviews
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
            Rate engineering quality, delivery pace, and communication for completed phases.
          </p>
        </div>

        <Button
          onClick={() => setIsRatingModalOpen(true)}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs h-8 sm:h-9 px-3.5 sm:px-4 gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Leave a Review</span>
        </Button>
      </div>

      {/* Aggregate Score & Performance Vectors - Solid High Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Big Overall Rating Box - Solid */}
        <div className="bg-[#18181b] border border-[#27272a] p-3.5 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-[10px] sm:text-xs uppercase font-semibold text-zinc-400 tracking-wider">
            Average Client Rating
          </span>
          <div className="text-3xl sm:text-4xl font-bold text-white mt-1 mb-1.5 sm:mb-2">
            {avgOverall}
          </div>
          {renderStars(Math.round(Number(avgOverall)))}
          <span className="text-[11px] sm:text-xs text-zinc-400 mt-2 sm:mt-3">
            {activeProject.ratings.length} verified review on file
          </span>
        </div>

        {/* Breakdown Bars - Solid */}
        <div className="md:col-span-2 bg-[#18181b] border border-[#27272a] p-3.5 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col justify-center space-y-2.5 sm:space-y-3">
          <h3 className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-0.5 sm:mb-1">
            Performance Breakdown
          </h3>

          {[
            { label: "Engineering Quality & Reliability", score: 98 },
            { label: "Communication & Response Time", score: 96 },
            { label: "Phase Deadlines & Delivery Velocity", score: 95 },
            { label: "UI Design & Ease of Use", score: 94 },
          ].map(({ label, score }, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">{label}</span>
                <span className="text-zinc-400 font-mono">{score}%</span>
              </div>
              <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2563eb] rounded-full"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Client Reviews</h3>

        {activeProject.ratings.map((rating) => (
          <div
            key={rating.id}
            className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#27272a] border border-[#3f3f46] flex items-center justify-center font-bold text-white text-xs">
                  {rating.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{rating.authorName}</h4>
                  <span className="text-xs text-zinc-400">{rating.submittedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {renderStars(rating.overallScore)}
                <span className="text-xs font-bold text-white bg-[#27272a] px-2 py-0.5 rounded">
                  {rating.overallScore}.0 / 5.0
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#121316] p-4 rounded-lg border border-[#27272a]">
              "{rating.feedbackText}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 pt-2 border-t border-[#27272a]">
              <div className="flex flex-wrap items-center gap-3">
                <span>Code Quality: <strong className="text-white">{rating.categories.engineeringQuality}/5</strong></span>
                <span>•</span>
                <span>Velocity: <strong className="text-white">{rating.categories.velocity}/5</strong></span>
                <span>•</span>
                <span>Communication: <strong className="text-white">{rating.categories.communication}/5</strong></span>
              </div>

              {rating.clientRecommendation && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Verified Recommendation</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <PortalRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmitRating={submitRating}
      />
    </div>
  );
};
