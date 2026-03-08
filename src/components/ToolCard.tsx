import React from "react";
import { getToolIcon, getToolColor } from "@/lib/toolIcons";
import { ExternalLink } from "lucide-react";

interface ToolCardProps {
  name: string;
  url: string;
  size?: "sm" | "md" | "lg";
}

export const ToolCard: React.FC<ToolCardProps> = ({ name, url, size = "sm" }) => {
  const Icon = getToolIcon(name);
  const gradientColor = getToolColor(name);
  
  const sizeClasses = {
    sm: "w-16 h-16 p-2",
    md: "w-20 h-20 p-3",
    lg: "w-24 h-24 p-4",
  };

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 32,
  };

  const textSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`${sizeClasses[size]} group relative rounded-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-110 flex flex-col items-center justify-center text-center hover:-translate-y-1 cursor-pointer`}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-90 group-hover:opacity-100 transition-opacity`} />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1">
        <Icon size={iconSizes[size]} className="text-white flex-shrink-0" />
        <span className={`${textSizes[size]} font-semibold text-white line-clamp-2`}>
          {name}
        </span>
      </div>

      {/* External Link Icon on Hover */}
      <div className="absolute top-1 right-1 bg-white/20 group-hover:bg-white/40 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <ExternalLink size={size === "sm" ? 10 : size === "md" ? 12 : 14} className="text-white" />
      </div>
    </a>
  );
};

interface ToolGridProps {
  tools: Array<{ name: string; url: string }>;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ tools, size = "sm", className = "" }) => {
  if (!tools || tools.length === 0) {
    return null;
  }

  const gridColsMap = {
    sm: "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8",
    md: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6",
    lg: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  };

  return (
    <div className={`grid ${gridColsMap[size]} gap-2 sm:gap-3 ${className}`}>
      {tools.map((tool) => (
        <ToolCard key={tool.name} name={tool.name} url={tool.url} size={size} />
      ))}
    </div>
  );
};
