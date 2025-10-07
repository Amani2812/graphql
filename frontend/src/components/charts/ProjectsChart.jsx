import React from 'react';

const ProjectsChart = ({ progress }) => {
  if (!progress || progress.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No project data available
      </div>
    );
  }

  // Process data for bar chart
  const projectStats = progress.reduce((acc, project) => {
    const projectName = project.path?.split('/').pop() || 'Unknown';
    if (!acc[projectName]) {
      acc[projectName] = { name: projectName, pass: 0, fail: 0, total: 0 };
    }
    
    if (project.grade > 0) {
      acc[projectName].pass += 1;
    } else {
      acc[projectName].fail += 1;
    }
    acc[projectName].total += 1;
    
    return acc;
  }, {});

  const chartData = Object.values(projectStats)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8); // Show top 8 projects

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No project statistics available
      </div>
    );
  }

  // Chart dimensions
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 100, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const maxValue = Math.max(...chartData.map(d => d.total));
  const barWidth = chartWidth / chartData.length * 0.8;
  const barSpacing = chartWidth / chartData.length * 0.2;

  return (
    <div className="w-full overflow-x-auto" data-testid="projects-chart">
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
                {Math.round(maxValue * (1 - ratio))}
              </text>
            </g>
          ))}

          {/* Bars */}
          {chartData.map((project, index) => {
            const x = (index + 0.1) * (chartWidth / chartData.length);
            const passHeight = (project.pass / maxValue) * chartHeight;
            const failHeight = (project.fail / maxValue) * chartHeight;
            const totalHeight = passHeight + failHeight;

            return (
              <g key={project.name}>
                {/* Pass bar */}
                <rect
                  x={x}
                  y={chartHeight - passHeight}
                  width={barWidth}
                  height={passHeight}
                  fill="#10b981"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  rx="2"
                >
                  <title>{`${project.name}: ${project.pass} passed`}</title>
                </rect>

                {/* Fail bar */}
                <rect
                  x={x}
                  y={chartHeight - totalHeight}
                  width={barWidth}
                  height={failHeight}
                  fill="#ef4444"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  rx="2"
                >
                  <title>{`${project.name}: ${project.fail} failed`}</title>
                </rect>

                {/* Value labels */}
                {totalHeight > 20 && (
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight - totalHeight / 2 + 5}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="white"
                  >
                    {project.total}
                  </text>
                )}

                {/* Project name */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 15}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748b"
                  transform={`rotate(-45, ${x + barWidth / 2}, ${chartHeight + 15})`}
                >
                  {project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Chart title */}
        <text
          x={width / 2}
          y={15}
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fill="#1e293b"
        >
          Project Attempts (Pass/Fail)
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
          Attempts
        </text>

        {/* Legend */}
        <g transform={`translate(${width - 200}, ${margin.top + 20})`}>
          <rect x={0} y={0} width={12} height={12} fill="#10b981" rx="2" />
          <text x={18} y={10} fontSize="12" fill="#64748b">Passed</text>
          
          <rect x={0} y={20} width={12} height={12} fill="#ef4444" rx="2" />
          <text x={18} y={30} fontSize="12" fill="#64748b">Failed</text>
        </g>
      </svg>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-slate-900" data-testid="unique-projects">
            {chartData.length}
          </p>
          <p className="text-sm text-slate-600">Unique Projects</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-600" data-testid="total-passes">
            {chartData.reduce((sum, project) => sum + project.pass, 0)}
          </p>
          <p className="text-sm text-slate-600">Total Passes</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-600" data-testid="total-failures">
            {chartData.reduce((sum, project) => sum + project.fail, 0)}
          </p>
          <p className="text-sm text-slate-600">Total Failures</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-600" data-testid="avg-attempts">
            {(chartData.reduce((sum, project) => sum + project.total, 0) / chartData.length).toFixed(1)}
          </p>
          <p className="text-sm text-slate-600">Avg Attempts</p>
        </div>
      </div>

      {/* Top Performing Projects */}
      <div className="mt-6">
        <h4 className="font-semibold text-slate-900 mb-3">Top Performing Projects</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chartData
            .sort((a, b) => (b.pass / b.total) - (a.pass / a.total))
            .slice(0, 6)
            .map((project, index) => {
              const successRate = project.total > 0 ? (project.pass / project.total * 100).toFixed(1) : 0;
              return (
                <div key={project.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 truncate">{project.name}</p>
                    <p className="text-sm text-slate-600">
                      {project.pass}/{project.total} attempts
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${successRate >= 70 ? 'text-green-600' : successRate >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {successRate}%
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsChart;