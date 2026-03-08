import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Briefcase, Copy, Check } from "lucide-react";

const WORKSPACE_PASSWORD = "ooma2001";

const ApplicationsPage: React.FC = () => {
  const { state, dispatch } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateAccessLink = (appId: string) => {
    const baseUrl = window.location.origin;
    // Check if user already exists
    const app = state.applications.find((a) => a.id === appId);
    if (!app) return "";

    const existingUser = state.users.find((u) => u.email === app.email && u.role === "partner");
    const userId = existingUser?.id || appId;
    
    return `${baseUrl}/workspace-access?user=${userId}`;
  };

  const ensureUserExists = (appId: string) => {
    const app = state.applications.find((a) => a.id === appId);
    if (!app) return;

    const existing = state.users.find((u) => u.email === app.email && u.role === "partner");
    if (!existing) {
      dispatch({
        type: "REGISTER_USER",
        payload: {
          id: appId,
          name: app.name,
          email: app.email,
          role: "partner",
          workspace_access: true,
          organization: app.organization,
        },
      });
    }
  };

  const handleCopyLink = (appId: string) => {
    ensureUserExists(appId);
    const link = generateAccessLink(appId);
    navigator.clipboard.writeText(link);
    setCopiedId(appId);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Link copied!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">Partnership Applications</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          {state.applications.length} application{state.applications.length !== 1 ? "s" : ""} received
        </p>
      </div>

      {state.applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <Briefcase size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            No partnership applications yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {state.applications.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg p-5 sm:p-6 bg-white dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {app.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <Mail size={16} />
                        <span>{app.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <Briefcase size={16} />
                        <span className="font-semibold">{app.currentProfession}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Phone Number
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {app.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        City / Country
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {app.cityCountry}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Area of Expertise
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {app.areaOfExpertise}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Collaborate In
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {app.collaborateIn === "innovations_research" && "Innovations and Research"}
                        {app.collaborateIn === "developer_engineer" && "Developer or Engineer"}
                        {app.collaborateIn === "business_marketing" && "Business and Marketing"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      LinkedIn Profile
                    </p>
                    <a href={app.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all">
                      {app.linkedinProfile}
                    </a>
                  </div>
                </div>

                {/* Access Link Ready Section */}
                <div className="border-t border-green-200 dark:border-green-900/40 pt-4 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 -mx-5 sm:-mx-6 px-5 sm:px-6">
                  <p className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300 mb-4">
                    ✅ Ready to Send - Copy Credentials Below
                  </p>

                  {/* Email */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Partner Email (for login):</p>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded p-3 border border-green-200 dark:border-green-800">
                      <code className="flex-1 text-xs sm:text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                        {app.email}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(app.email);
                          setCopiedId(`email-${app.id}`);
                          setTimeout(() => setCopiedId(null), 2000);
                          toast.success("Email copied!");
                        }}
                        className="ml-2"
                      >
                        {copiedId === `email-${app.id}` ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Access Link */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Workspace Access Link:</p>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded p-3 border border-green-200 dark:border-green-800">
                      <code className="flex-1 text-xs sm:text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                        {generateAccessLink(app.id)}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyLink(app.id)}
                        className="ml-2"
                      >
                        {copiedId === app.id ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Workspace Password:</p>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded p-3 border border-green-200 dark:border-green-800">
                      <code className="flex-1 text-xs sm:text-sm font-mono text-gray-900 dark:text-gray-100">
                        {WORKSPACE_PASSWORD}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(WORKSPACE_PASSWORD);
                          setCopiedId(`pwd-${app.id}`);
                          setTimeout(() => setCopiedId(null), 2000);
                          toast.success("Password copied!");
                        }}
                        className="ml-2"
                      >
                        {copiedId === `pwd-${app.id}` ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-green-700 dark:text-green-400 text-center">
                    Copy email, link, and password. Send link with instructions to partner.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
