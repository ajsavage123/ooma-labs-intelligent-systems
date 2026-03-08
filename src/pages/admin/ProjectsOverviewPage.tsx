import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FolderOpen, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const ProjectsOverviewPage: React.FC = () => {
  const { state } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"><Clock size={14} /> In Progress</span>;
      case "completed":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"><CheckCircle2 size={14} /> Completed</span>;
      case "pending_approval":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"><AlertCircle size={14} /> Pending</span>;
      case "approved":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"><CheckCircle2 size={14} /> Approved</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"><AlertCircle size={14} /> Rejected</span>;
      default:
        return <span className="text-xs text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">All Projects</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          {state.projects.length} total project{state.projects.length !== 1 ? "s" : ""}
        </p>
      </div>

      {state.projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <FolderOpen size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            No projects found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="space-y-3 sm:space-y-4">
            {state.projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md p-4 sm:p-5 bg-white dark:bg-gray-900/50 backdrop-blur-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 items-center">
                  {/* Project Name */}
                  <div className="md:col-span-1">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Project
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1">
                      {proj.name}
                    </p>
                  </div>

                  {/* Owner */}
                  <div className="md:col-span-1">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Owner
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {proj.owner}
                    </p>
                  </div>

                  {/* Current Stage */}
                  <div className="md:col-span-1">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Stage
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                      {proj.stages[proj.currentStageIndex]?.name}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-1">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Status
                    </p>
                    {getStatusBadge(proj.status)}
                  </div>

                  {/* Last Updated */}
                  <div className="md:col-span-1 text-right">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Updated
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {new Date(proj.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsOverviewPage;
