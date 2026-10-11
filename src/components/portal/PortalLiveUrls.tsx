import React from "react";
import { useClientPortal } from "../../context/ClientPortalContext";
import { Globe, ArrowUpRight, Copy, Check, ShieldCheck, Zap, Code2, Figma, Server, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const PortalLiveUrls: React.FC = () => {
  const { activeProject } = useClientPortal();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEnvBadge = (type: string) => {
    switch (type) {
      case "production":
        return <span className="bg-[#064e3b] text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded">Production</span>;
      case "staging":
        return <span className="bg-[#1e3a8a] text-blue-300 text-xs font-semibold px-2 py-0.5 rounded">Staging</span>;
      case "design":
        return <span className="bg-[#78350f] text-amber-300 text-xs font-semibold px-2 py-0.5 rounded">Figma</span>;
      default:
        return <span className="bg-[#27272a] text-zinc-300 text-xs font-semibold px-2 py-0.5 rounded">API Docs</span>;
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Header Banner - Solid */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            Live Project URLs & Environments
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
            Access your production web portal, staging preview server, design assets, and API specifications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-300 bg-[#27272a] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-[#3f3f46] shrink-0 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>All endpoints live & operational</span>
        </div>
      </div>

      {/* Environments Grid - Solid High Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {activeProject.liveUrls.map((env) => {
          const isCopied = copiedId === env.id;

          return (
            <div
              key={env.id}
              className="bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-col justify-between space-y-3 sm:space-y-4 transition-colors"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-1">{getEnvBadge(env.type)}</div>
                    <h3 className="text-sm sm:text-base font-bold text-white">{env.label}</h3>
                  </div>

                  <span className="bg-[#064e3b] text-emerald-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>

                {/* URL Input Box - Solid Dark */}
                <div className="p-2 sm:p-2.5 rounded-lg bg-[#121316] border border-[#27272a] flex items-center justify-between gap-2 text-[11px] sm:text-xs font-mono text-zinc-200">
                  <span className="truncate">{env.url}</span>
                  <button
                    onClick={() => handleCopy(env.id, env.url)}
                    className="shrink-0 p-1 rounded bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 transition-colors"
                    title="Copy URL"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {env.notes && (
                  <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">{env.notes}</p>
                )}
              </div>

              <div className="pt-3 sm:pt-4 border-t border-[#27272a] space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
                  <span>Uptime: {env.uptime}</span>
                  <span>{env.lastDeployed}</span>
                </div>

                <a
                  href={env.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 sm:py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Open URL in New Tab</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
