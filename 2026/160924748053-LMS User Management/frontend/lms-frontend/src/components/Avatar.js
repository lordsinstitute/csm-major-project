import React from "react";

// Keep this in sync with AppConstants.AVATAR_IDS on the backend.
// These are the ONLY avatars a user can pick - drawn inline as SVG so
// nothing is ever uploaded from the user's device and nothing is fetched
// from the network.
export const AVATAR_OPTIONS = [
  { id: "avatar1", label: "Comet", gradient: ["#6366f1", "#8b5cf6"], glyph: "star" },
  { id: "avatar2", label: "Sunrise", gradient: ["#f59e0b", "#f97316"], glyph: "sun" },
  { id: "avatar3", label: "Leaf", gradient: ["#10b981", "#059669"], glyph: "leaf" },
  { id: "avatar4", label: "Wave", gradient: ["#0ea5e9", "#2563eb"], glyph: "wave" },
  { id: "avatar5", label: "Bloom", gradient: ["#ec4899", "#db2777"], glyph: "bloom" },
];

const glyphPaths = {
  star: "M32 14l4.6 9.6 10.6 1.5-7.7 7.4 1.8 10.5L32 37.9l-9.3 5.1 1.8-10.5-7.7-7.4 10.6-1.5z",
  sun: null, // rendered as circle + rays below
  leaf: "M20 44c0-14 8-24 22-26-2 16-6 24-22 26z M20 44c4-6 10-11 18-14",
  wave: "M14 30c4-6 10-6 14 0s10 6 14 0s10-6 14 0 M14 38c4-6 10-6 14 0s10 6 14 0s10-6 14 0",
  bloom: null, // rendered as petal circles below
};

const Avatar = ({ avatarId, size = 64, className = "" }) => {
  const option = AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];
  const gradId = `grad-${option.id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`avatar-svg ${className}`}
      role="img"
      aria-label={option.label}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={option.gradient[0]} />
          <stop offset="100%" stopColor={option.gradient[1]} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill={`url(#${gradId})`} />

      {option.glyph === "sun" && (
        <g stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="32" cy="32" r="9" fill="#fff" fillOpacity="0.95" stroke="none" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="32"
              y1="32"
              x2="32"
              y2="14"
              transform={`rotate(${deg} 32 32)`}
              opacity="0.9"
            />
          ))}
        </g>
      )}

      {option.glyph === "bloom" && (
        <g fill="#fff" fillOpacity="0.95">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="32"
              cy="20"
              rx="6"
              ry="10"
              transform={`rotate(${deg} 32 32)`}
            />
          ))}
          <circle cx="32" cy="32" r="5" fill={option.gradient[1]} />
        </g>
      )}

      {glyphPaths[option.glyph] && (
        <path
          d={glyphPaths[option.glyph]}
          fill={option.glyph === "star" ? "#fff" : "none"}
          fillOpacity="0.95"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

export default Avatar;
