import React from "react";

type AppleSpinnerProps = {
  size?: number;
  className?: string;
  color?: string;
  label?: string;
};

/**
 * Apple-style iOS activity indicator (12 fading bars).
 */
export const AppleSpinner: React.FC<AppleSpinnerProps> = ({
  size = 20,
  className = "",
  color = "rgba(255,255,255,0.9)",
  label = "Loading",
}) => {
  const bars = Array.from({ length: 12 });
  const r = size / 2;
  const barW = Math.max(1.5, size * 0.085);
  const barH = Math.max(4, size * 0.28);
  const barR = Math.max(2, size * 0.06);

  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
        className="apple-spinner-svg"
      >
        {bars.map((_, i) => (
          <rect
            key={i}
            x={r - barW / 2}
            y={size * 0.06}
            width={barW}
            height={barH}
            rx={barR}
            fill={color}
            transform={`rotate(${i * 30} ${r} ${r})`}
            style={{
              opacity: 0.12,
              transformOrigin: `${r}px ${r}px`,
              animation: `apple-spinner-fade 1s linear infinite`,
              animationDelay: `${-(1 - i / 12)}s`,
            }}
          />
        ))}
      </svg>
      <style>{`
        @keyframes apple-spinner-fade {
          0% { opacity: 1; }
          100% { opacity: 0.12; }
        }
        @media (prefers-reduced-motion: reduce) {
          .apple-spinner-svg rect { animation: none !important; opacity: 0.55; }
        }
      `}</style>
    </span>
  );
};

export default AppleSpinner;
