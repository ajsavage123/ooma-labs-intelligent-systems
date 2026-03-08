import React from "react";
import { useAuth, makeProduct } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, Package } from "lucide-react";

const ProductsApprovalPage: React.FC = () => {
  const { state, dispatch } = useAuth();

  const pending = state.projects.filter((p) => p.status === "pending_approval");

  const handleDecision = (projId: string, decision: "approve" | "reject" | "changes") => {
    if (decision === "approve") {
      const proj = state.projects.find((p) => p.id === projId);
      if (proj) {
        dispatch({ type: "UPDATE_PROJECT", payload: { id: projId, status: "approved" } });
        const product = makeProduct({
          projectId: proj.id,
          name: proj.name,
          description: proj.description,
          launchStatus: "Launched",
          team: proj.teamMembers,
        });
        dispatch({ type: "ADD_PRODUCT", payload: product });
        toast.success("Product approved and published");
      }
    } else if (decision === "reject") {
      dispatch({ type: "UPDATE_PROJECT", payload: { id: projId, status: "rejected" } });
      toast.error("Product rejected");
    } else {
      // request changes just leave status in pending but maybe add note (not implemented)
      toast('Changes requested');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">Product Approvals</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          {pending.length} project{pending.length !== 1 ? "s" : ""} awaiting approval
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <Package size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            No projects currently awaiting product approval.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {pending.map((proj) => (
            <div
              key={proj.id}
              className="rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-lg p-5 sm:p-6 bg-white dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {proj.name}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Owner</span>
                        <span className="text-gray-900 dark:text-gray-100">{proj.owner}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Current Stage</span>
                        <span className="text-gray-900 dark:text-gray-100 line-clamp-1">{proj.stages[proj.currentStageIndex]?.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Updated</span>
                        <span className="text-gray-900 dark:text-gray-100">{new Date(proj.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="self-start">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                      <AlertCircle size={14} />
                      Pending Review
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Completion</span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {Math.round(((proj.currentStageIndex + 1) / proj.stages.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                      style={{ width: `${((proj.currentStageIndex + 1) / proj.stages.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-4 border-t border-gray-200 dark:border-gray-700 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDecision(proj.id, "changes")}
                    className="gap-2"
                  >
                    <AlertCircle size={16} />
                    <span className="hidden sm:inline">Changes</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDecision(proj.id, "reject")}
                    className="gap-2"
                  >
                    <XCircle size={16} />
                    <span className="hidden sm:inline">Reject</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDecision(proj.id, "approve")}
                    className="gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span className="hidden sm:inline">Approve</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsApprovalPage;