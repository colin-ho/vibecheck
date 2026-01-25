import { motion } from 'framer-motion';

interface Segment {
  value: number;
  color: string;
  label?: string;
}

interface RadialChartProps {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  highlightIndex?: number;
  animate?: boolean;
  delay?: number;
  centerContent?: React.ReactNode;
  glowColor?: string;
}

export function RadialChart({
  segments,
  size = 200,
  strokeWidth = 24,
  highlightIndex,
  animate = true,
  delay = 0,
  centerContent,
  glowColor,
}: RadialChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  const segmentData = segments.map((segment, index) => {
    const percentage = segment.value / total;
    const segmentLength = percentage * circumference;
    const offset = cumulativeOffset;
    cumulativeOffset += segmentLength;

    return {
      ...segment,
      percentage,
      segmentLength,
      offset,
      isHighlighted: index === highlightIndex,
    };
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(59, 17, 12, 0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Segments */}
        {segmentData.map((segment, index) => (
          <motion.circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={segment.isHighlighted ? strokeWidth + 4 : strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${segment.segmentLength} ${circumference}`}
            strokeDashoffset={animate ? circumference : -segment.offset}
            initial={animate ? { strokeDashoffset: circumference } : undefined}
            animate={{ strokeDashoffset: -segment.offset }}
            transition={{
              delay: delay + index * 0.15,
              duration: 1,
              ease: 'easeOut',
            }}
            style={{
              filter: segment.isHighlighted && glowColor
                ? `drop-shadow(0 0 8px ${glowColor})`
                : undefined,
            }}
          />
        ))}
      </svg>

      {/* Center content */}
      {centerContent && (
        <div className="absolute inset-0 flex items-center justify-center rotate-0">
          {centerContent}
        </div>
      )}
    </div>
  );
}

// Radial bar chart - segments as bars extending from center
interface RadialBarSegment {
  value: number;
  maxValue: number;
  color: string;
  label: string;
}

interface RadialBarChartProps {
  segments: RadialBarSegment[];
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
  animate?: boolean;
  delay?: number;
  highlightIndex?: number;
}

export function RadialBarChart({
  segments,
  size = 280,
  innerRadius = 40,
  outerRadius = 120,
  animate = true,
  delay = 0,
  highlightIndex,
}: RadialBarChartProps) {
  const center = size / 2;
  const angleStep = (2 * Math.PI) / segments.length;
  const gapAngle = 0.04; // Small gap between segments

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {segments.map((segment, index) => {
          const startAngle = index * angleStep - Math.PI / 2 + gapAngle / 2;
          const endAngle = (index + 1) * angleStep - Math.PI / 2 - gapAngle / 2;
          const segmentRadius = innerRadius + (outerRadius - innerRadius) * (segment.value / segment.maxValue);

          const x1Inner = center + innerRadius * Math.cos(startAngle);
          const y1Inner = center + innerRadius * Math.sin(startAngle);
          const x2Inner = center + innerRadius * Math.cos(endAngle);
          const y2Inner = center + innerRadius * Math.sin(endAngle);
          const x1Outer = center + segmentRadius * Math.cos(startAngle);
          const y1Outer = center + segmentRadius * Math.sin(startAngle);
          const x2Outer = center + segmentRadius * Math.cos(endAngle);
          const y2Outer = center + segmentRadius * Math.sin(endAngle);

          const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

          const path = `
            M ${x1Inner} ${y1Inner}
            L ${x1Outer} ${y1Outer}
            A ${segmentRadius} ${segmentRadius} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}
            L ${x2Inner} ${y2Inner}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1Inner} ${y1Inner}
          `;

          const isHighlighted = index === highlightIndex;

          return (
            <motion.path
              key={index}
              d={path}
              fill={segment.color}
              opacity={isHighlighted ? 1 : 0.8}
              initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
              animate={{ opacity: isHighlighted ? 1 : 0.8, scale: 1 }}
              transition={{
                delay: delay + index * 0.1,
                duration: 0.5,
              }}
              style={{
                transformOrigin: `${center}px ${center}px`,
                filter: isHighlighted ? `drop-shadow(0 0 10px ${segment.color})` : undefined,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
