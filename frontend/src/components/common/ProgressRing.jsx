/**
 * Circular progress ring used for the Placement Readiness score gauge.
 * @param {number} value - 0-100
 * @param {number} size - px
 * @param {number} strokeWidth - px
 * @param {string} label - text under the number (e.g. "SCORE")
 */
const ProgressRing = ({ value = 0, size = 160, strokeWidth = 12, label = 'SCORE', color = 'var(--color-primary)' }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-3)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease', filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: size * 0.28, fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
          {Math.round(clamped)}
        </span>
        <span style={{ fontSize: 11, color: 'var(--color-text-faint)', letterSpacing: '0.08em', marginTop: 4 }}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
