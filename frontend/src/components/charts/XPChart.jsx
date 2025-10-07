import React from 'react';

const XPChart = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No XP data available
      </div>
    );
  }

  // Process data for cumulative XP over time
  const processedData = transactions
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .reduce((acc, transaction, index) => {
      const cumulativeXP = (acc[index - 1]?.cumulativeXP || 0) + transaction.amount;
      acc.push({
        date: new Date(transaction.createdAt),
        xp: transaction.amount,
        cumulativeXP,
        project: transaction.path?.split('/').pop() || 'Project'
      });
      return acc;
    }, []);

  // Chart dimensions
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 60, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Scales
  const maxXP = Math.max(...processedData.map(d => d.cumulativeXP));
  const minDate = Math.min(...processedData.map(d => d.date));
  const maxDate = Math.max(...processedData.map(d => d.date));
  const dateRange = maxDate - minDate || 1;

  const getX = (date) => ((date - minDate) / dateRange) * chartWidth;
  const getY = (xp) => chartHeight - (xp / maxXP) * chartHeight;

  // Create path for the line
  const pathData = processedData.map((point, index) => {
    const x = getX(point.date);
    const y = getY(point.cumulativeXP);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create area path
  const areaData = `M 0 ${chartHeight} L ${pathData.substring(2)} L ${getX(processedData[processedData.length - 1].date)} ${chartHeight} Z`;

  return (
    <div className="w-full overflow-x-auto" data-testid="xp-chart">
      <svg width={width} height={height} className="border border-slate-200 rounded-lg bg-white">
        {/* Chart area */}
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <g key={ratio}>
              <line
                x1={0}
                y1={chartHeight * ratio}
                x2={chartWidth}
                y2={chartHeight * ratio}
                stroke="#e2e8f0"
                strokeDasharray="3,3"
              />
              <text
                x={-10}
                y={chartHeight * ratio + 5}
                textAnchor="end"
                fontSize="12"
                fill="#64748b"
              >
                {Math.round(maxXP * (1 - ratio)).toLocaleString()}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path
            d={areaData}
            fill="url(#xpGradient)"
            opacity="0.3"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {processedData.map((point, index) => (
            <g key={index}>
              <circle
                cx={getX(point.date)}
                cy={getY(point.cumulativeXP)}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all cursor-pointer"
              >
                <title>
                  {`${point.project}: +${point.xp} XP (Total: ${point.cumulativeXP.toLocaleString()})`}
                </title>
              </circle>
            </g>
          ))}

          {/* X-axis labels */}
          {processedData
            .filter((_, index) => index % Math.ceil(processedData.length / 6) === 0)
            .map((point, index) => (
              <text
                key={index}
                x={getX(point.date)}
                y={chartHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#64748b"
              >
                {point.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </text>
            ))}
        </g>

        {/* Gradient definition */}
        <defs>
          <linearGradient id="xpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
          </linearGradient>
        </defs>

        {/* Chart title */}
        <text
          x={width / 2}
          y={15}
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fill="#1e293b"
        >
          Cumulative XP Progress
        </text>

        {/* Y-axis label */}
        <text
          x={15}
          y={height / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#64748b"
          transform={`rotate(-90, 15, ${height / 2})`}
        >
          XP Points
        </text>
      </svg>
    </div>
  );
};

export default XPChart;