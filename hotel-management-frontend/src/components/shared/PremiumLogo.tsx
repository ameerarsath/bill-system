export const PremiumLogo = () => {
  return (
    <div className="inline-block mb-6 logo-glow">
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Elegant circular frame */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="url(#gradient1)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="url(#gradient2)"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Minimalist dining icon - Fork */}
        <path
          d="M 28 22 L 28 42"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 26 22 L 26 28"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 30 22 L 30 28"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Spoon */}
        <circle cx="36" cy="25" r="2.5" fill="white" opacity="0.9" />
        <path
          d="M 36 27.5 L 36 42"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Subtle accent line */}
        <path
          d="M 20 32 L 44 32"
          stroke="url(#gradient3)"
          strokeWidth="0.5"
          opacity="0.3"
        />

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#fdba74', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#ea580c', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
