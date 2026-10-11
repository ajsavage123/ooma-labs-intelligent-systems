import React from "react";
import { useClientPortal, CANONICAL_6_STAGES } from "../../context/ClientPortalContext";
import { Calendar, Layers, FileText, CheckCircle2, Clock } from "lucide-react";

export const PortalMilestones: React.FC = () => {
  const { activeProject } = useClientPortal();

  return (
    <div className="space-y-3 sm:space-y-6 w-full max-w-7xl mx-auto">
      {/* Header Banner - Responsive Desktop & Mobile */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-lg">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563eb]" />
            6-Stage Project Timeline & Engineering Logs
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
            Real-time status tracking across all 6 phases. Engineering log notes are updated live by the OOMA LABS pod team.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#121316] border border-[#27272a] text-[11px] sm:text-xs">
            <span className="text-zinc-400 mr-1.5">Overall:</span>
            <strong className="text-white font-bold">{activeProject.overallProgress}%</strong>
          </div>
          <div className="bg-[#2563eb]/20 text-[#60a5fa] border border-[#2563eb]/40 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs">
            {activeProject.milestones.filter((m) => m.status === "completed").length} of 6 Done
          </div>
        </div>
      </div>

      {/* 6 Canonical Stages List */}
      <div className="space-y-2.5 sm:space-y-4">
        {activeProject.milestones.map((rawMilestone, index) => {
          const fallback = CANONICAL_6_STAGES[index] || CANONICAL_6_STAGES[0];
          const rawTitle = rawMilestone.title || "";
          const stageName = rawTitle.toLowerCase().includes("sprint") || rawTitle.toLowerCase().startsWith("phase")
            ? fallback.title.replace(/^\d+\.\s*/, "")
            : rawTitle.replace(/^\d+\.\s*/, "");
          const stageTitle = `Stage ${index + 1}: ${stageName}`;

          const isCompleted = rawMilestone.status === "completed";
          const isInProgress = rawMilestone.status === "in_progress";
          const logNote = rawMilestone.notes || rawMilestone.description || fallback.defaultNotes;

          return (
            <div
              key={rawMilestone.id}
              className={`rounded-xl sm:rounded-2xl border transition-all ${
                isInProgress
                  ? "bg-[#18181b] border-[#2563eb] shadow-lg shadow-blue-950/40"
                  : isCompleted
                  ? "bg-[#18181b] border-[#27272a]"
                  : "bg-[#141416] border-[#27272a] opacity-90"
              }`}
            >
              {/* Stage Header */}
              <div className="p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3.5">
                  <div
                    className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 text-xs sm:text-sm font-bold ${
                      isCompleted
                        ? "bg-[#064e3b] text-emerald-300"
                        : isInProgress
                        ? "bg-[#1e3a8a] text-blue-300 ring-2 ring-blue-500/30"
                        : "bg-[#27272a] text-zinc-400"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded ${
                          isCompleted
                            ? "bg-[#064e3b] text-emerald-300"
                            : isInProgress
                            ? "bg-[#1e3a8a] text-blue-300"
                            : "bg-[#27272a] text-zinc-400"
                        }`}
                      >
                        {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Pending"}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-base font-bold text-white">
                      {stageTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-[#27272a]/60">
                  <div className="text-left sm:text-right text-[11px] sm:text-xs">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{isCompleted ? `Completed: ${rawMilestone.completedDate || "Done"}` : `Target: ${rawMilestone.dueDate}`}</span>
                    </div>
                    <div className="font-semibold text-white mt-0.5">
                      {rawMilestone.progress}% Complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#27272a] h-1.5 overflow-hidden">
                <div
                  className="h-full transition-all duration-300 bg-emerald-500"
                  style={{ width: `${rawMilestone.progress}%` }}
                />
              </div>

              {/* Read-Only Stage Engineering Log Note */}
              {logNote && (
                <div className="p-2.5 sm:p-5 bg-[#121316] border-t border-[#27272a] rounded-b-xl sm:rounded-b-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-zinc-300">
                    <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2563eb]" />
                    <span>Engineering Log & Stage Notes:</span>
                  </div>
                  <p className="text-[11px] sm:text-sm text-zinc-300 leading-relaxed font-normal pl-4 sm:pl-5">
                    {logNote}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
