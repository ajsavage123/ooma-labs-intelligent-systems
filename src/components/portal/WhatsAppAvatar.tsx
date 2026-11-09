/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { cn } from "@/lib/utils";

/**
 * Authentic WhatsApp "No Profile Picture" (No DP) SVG Data URI.
 * Uses WhatsApp's exact vector geometry:
 * - Circle background (#DFE5E7 light slate/gray)
 * - Head circle (#FFFFFF)
 * - Contoured shoulder/torso silhouette (#FFFFFF)
 */
export const WHATSAPP_DEFAULT_AVATAR =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 212 212'%3E%3Ccircle cx='106' cy='106' r='106' fill='%23DFE5E7'/%3E%3Cpath d='M106 106a46 46 0 1 0 0-92 46 46 0 0 0 0 92z' fill='%23FFFFFF'/%3E%3Cpath d='M106 122c-38.6 0-71.8 21.6-88.7 53.6 22 22 53.8 35.8 88.7 35.8s66.7-13.8 88.7-35.8c-16.9-32-50.1-53.6-88.7-53.6z' fill='%23FFFFFF'/%3E%3C/svg%3E";

export const WHATSAPP_DARK_AVATAR =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 212 212'%3E%3Ccircle cx='106' cy='106' r='106' fill='%2327272A'/%3E%3Cpath d='M106 106a46 46 0 1 0 0-92 46 46 0 0 0 0 92z' fill='%238696A0'/%3E%3Cpath d='M106 122c-38.6 0-71.8 21.6-88.7 53.6 22 22 53.8 35.8 88.7 35.8s66.7-13.8 88.7-35.8c-16.9-32-50.1-53.6-88.7-53.6z' fill='%238696A0'/%3E%3C/svg%3E";

/**
 * Checks if a given avatar URL is empty, null, or a fake stock photo (e.g., Unsplash).
 */
export function isDefaultOrFakeAvatar(url?: string | null): boolean {
  if (!url || typeof url !== "string") return true;
  const lower = url.trim().toLowerCase();
  if (
    lower === "" ||
    lower === "null" ||
    lower === "undefined" ||
    lower.includes("unsplash.com") ||
    lower.includes("placeholder") ||
    lower.includes("dicebear.com")
  ) {
    return true;
  }
  return false;
}

/**
 * Returns a sanitized avatar URL. If the URL is empty or a fake photo,
 * returns the authentic WhatsApp default avatar.
 */
export function sanitizeAvatarUrl(url?: string | null, dark = false): string {
  if (isDefaultOrFakeAvatar(url)) {
    return dark ? WHATSAPP_DARK_AVATAR : WHATSAPP_DEFAULT_AVATAR;
  }
  return (url || "").trim();
}

interface WhatsAppAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  sizeClassName?: string;
  variant?: "whatsapp" | "whatsapp-dark" | "whatsapp-zinc";
}

/**
 * WhatsApp-style "No Profile Pic" (No DP) Avatar Component.
 * - If `src` is missing or a fake photo, renders the traditional WhatsApp neutral silhouette.
 * - If a genuine custom image is supplied, renders the image with a fallback to the WhatsApp silhouette.
 */
export const WhatsAppAvatar: React.FC<WhatsAppAvatarProps> = ({
  src,
  alt = "Profile",
  className,
  sizeClassName = "w-8 h-8",
  variant = "whatsapp",
}) => {
  const [hasError, setHasError] = React.useState(false);
  const isFake = isDefaultOrFakeAvatar(src);

  const getBgAndFill = () => {
    switch (variant) {
      case "whatsapp-dark":
        return { bg: "#202C33", figure: "#8696A0" };
      case "whatsapp-zinc":
        return { bg: "#27272A", figure: "#A1A1AA" };
      case "whatsapp":
      default:
        // Traditional WhatsApp light-mode contact avatar: soft cool gray (#DFE5E7) with white silhouette (#FFFFFF)
        return { bg: "#DFE5E7", figure: "#FFFFFF" };
    }
  };

  const { bg, figure } = getBgAndFill();

  // If fake, missing, or errored out, render the traditional WhatsApp No-DP SVG
  if (isFake || hasError || !src) {
    return (
      <div
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none",
          sizeClassName,
          className
        )}
        style={{ backgroundColor: bg }}
        title={alt}
        role="img"
        aria-label={alt}
      >
        <svg
          viewBox="0 0 212 212"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="106" cy="106" r="106" fill={bg} />
          {/* Head */}
          <path
            d="M106 106a46 46 0 1 0 0-92 46 46 0 0 0 0 92z"
            fill={figure}
          />
          {/* Shoulders */}
          <path
            d="M106 122c-38.6 0-71.8 21.6-88.7 53.6 22 22 53.8 35.8 88.7 35.8s66.7-13.8 88.7-35.8c-16.9-32-50.1-53.6-88.7-53.6z"
            fill={figure}
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn(
        "rounded-full object-cover shrink-0 select-none",
        sizeClassName,
        className
      )}
    />
  );
};

