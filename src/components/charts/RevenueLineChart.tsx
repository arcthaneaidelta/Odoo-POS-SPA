import React, { useState } from 'react';

interface RevenueLineChartProps {
  className?: string;
}

export const RevenueLineChart: React.FC<RevenueLineChartProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState<'This Year' | 'Last Year' | 'Last 30 Days'>('This Year');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(2); // Default to March (index 2)

  // Monthly values for This Year (in thousands)
  const monthlyData = [
    { month: 'Jan', value: 95 },
    { month: 'Feb', value: 120 },
    { month: 'Mar', value: 145.45 }, // Peak $145,450
    { month: 'Apr', value: 138 },
    { month: 'May', value: 115 },
    { month: 'Jun', value: 108 },
    { month: 'Jul', value: 112 },
    { month: 'Aug', value: 110 },
    { month: 'Sept', value: 122 },
    { month: 'Oct', value: 135 },
    { month: 'Nov', value: 158 },
    { month: 'Dec', value: 172 },
  ];

  // SVG dimensions
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  const maxValue = 200;

  // Compute points
  const points = monthlyData.map((d, index) => {
    const x = paddingX + (index / (monthlyData.length - 1)) * chartWidth;
    const y = height - paddingY - (d.value / maxValue) * chartHeight;
    return { x, y, ...d };
  });

  // Generate smooth cubic bezier SVG path
  const generatePath = () => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = generatePath();
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const peakPoint = points[hoveredMonth !== null ? hoveredMonth : 2];

  return (
    <div
      className={className}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* Chart Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
            Total Revenue
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.1rem' }}>
            Gross reservation yield & ADR trends
          </p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#334155',
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            padding: '0.3rem 0.65rem',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="This Year">This Year ⌵</option>
          <option value="Last Year">Last Year</option>
          <option value="Last 30 Days">Last 30 Days</option>
        </select>
      </div>

      {/* SVG Canvas */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D4E43" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#0D4E43" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Y Axis Guide Lines */}
          {[0, 100, 150, 200].map((val) => {
            const y = height - paddingY - (val / maxValue) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94A3B8"
                  fontFamily="var(--font-sans)"
                >
                  {val === 0 ? '0' : `$${val}K`}
                </text>
              </g>
            );
          })}

          {/* Shaded Area */}
          <path d={areaPath} fill="url(#revenueGradient)" />

          {/* Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#0D4E43"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Vertical guideline for hovered point */}
          {peakPoint && (
            <line
              x1={peakPoint.x}
              y1={peakPoint.y}
              x2={peakPoint.x}
              y2={height - paddingY}
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Hover interactive circle */}
          {peakPoint && (
            <circle
              cx={peakPoint.x}
              cy={peakPoint.y}
              r="5"
              fill="#FFFFFF"
              stroke="#0D4E43"
              strokeWidth="3"
            />
          )}

          {/* Month Points for Interaction */}
          {points.map((p, index) => (
            <g
              key={p.month}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredMonth(index)}
            >
              {/* Invisible larger hover target */}
              <circle cx={p.x} cy={p.y} r="16" fill="transparent" />

              {/* X Axis Labels */}
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="10.5"
                fill={hoveredMonth === index ? '#0D4E43' : '#64748B'}
                fontWeight={hoveredMonth === index ? 700 : 500}
                fontFamily="var(--font-sans)"
              >
                {p.month}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip matching Reference Image 1 CheckinOs */}
        {peakPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(peakPoint.x / width) * 100}%`,
              top: `${(peakPoint.y / height) * 100}%`,
              transform: 'translate(-50%, -125%)',
              backgroundColor: '#0D4E43',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              boxShadow: '0 4px 10px rgba(13, 78, 67, 0.3)',
              pointerEvents: 'none',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: '0.65rem', color: '#6EE7B7', fontWeight: 500 }}>
              Total Revenue
            </div>
            ${peakPoint.value.toLocaleString(undefined, { minimumFractionDigits: 0 })}K
          </div>
        )}
      </div>
    </div>
  );
};
