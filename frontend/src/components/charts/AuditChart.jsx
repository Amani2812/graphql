import React from 'react';

const AuditChart = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No audit data available
      </div>
    );
  }

  // Calculate audit statistics
  const passedProjects = results.filter(result => result.grade > 0).length;
  const failedProjects = results.length - passedProjects;
  const total = results.length;

  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No projects to analyze
      </div>
    );
  }

  const passPercentage = (passedProjects / total) * 100;
  const failPercentage = (failedProjects / total) * 100;

  // SVG dimensions
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const strokeWidth = 20;

  // Calculate angles for the donut chart
  const passAngle = (passPercentage / 100) * 360;
  const failAngle = (failPercentage / 100) * 360;

  // Create path for pass arc
  const passArc = createArc(center, center, radius, 0, passAngle);
  const failArc = createArc(center, center, radius, passAngle, passAngle + failAngle);

  function createArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y, 
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  }

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  return (
    <div className="flex flex-col items-center space-y-6" data-testid="audit-chart">
      <svg width={size} height={size} className="drop-shadow-sm">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        
        {/* Pass arc */}
        {passPercentage > 0 && (
          <path
            d={passArc}
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-300 hover:stroke-opacity-80"
          />
        )}
        
        {/* Fail arc */}
        {failPercentage > 0 && (
          <path
            d={failArc}
            fill="none"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-300 hover:stroke-opacity-80"
          />
        )}

        {/* Center text */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          fontSize="24"
          fontWeight="600"
          fill="#1e293b"
        >
          {passPercentage.toFixed(1)}%
        </text>
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          fontSize="14"
          fill="#64748b"
        >
          Success Rate
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <div className="text-sm">
            <span className="font-semibold text-green-700">Passed</span>
            <span className="text-slate-600 ml-1">({passedProjects})</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <div className="text-sm">
            <span className="font-semibold text-red-700">Failed</span>
            <span className="text-slate-600 ml-1">({failedProjects})</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-md text-center">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-slate-900" data-testid="total-projects">
            {total}
          </p>
          <p className="text-sm text-slate-600">Total Projects</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-green-600" data-testid="passed-projects">
            {passedProjects}
          </p>
          <p className="text-sm text-slate-600">Passed</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-red-600" data-testid="failed-projects">
            {failedProjects}
          </p>
          <p className="text-sm text-slate-600">Failed</p>
        </div>
      </div>

      {/* Recent Performance */}
      <div className="w-full max-w-md">
        <h4 className="font-semibold text-slate-900 mb-3">Recent Performance</h4>
        <div className="space-y-2">
          {results.slice(0, 5).map((result, index) => (
            <div key={result.id} className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-700 truncate">
                {result.path?.split('/').pop() || `Project ${index + 1}`}
              </span>
              <span 
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  result.grade > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
                data-testid={`recent-result-${index}`}
              >
                {result.grade > 0 ? 'PASS' : 'FAIL'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditChart;