import React from 'react';

const RevenueChart = () => {
  // Mock data points for the chart
  const data = [10, 25, 18, 30, 22, 40, 35, 50, 45, 60, 55, 70];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const height = 200;
  const width = 600;
  
  // Calculate points for SVG path
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Revenue Overview</h3>
          <p className="text-sm text-slate-500">Monthly revenue performance</p>
        </div>
        <select className="rounded-lg border-slate-200 text-sm text-slate-600 focus:border-blue-500 focus:ring-blue-500">
          <option>Last 12 Months</option>
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
        </select>
      </div>
      
      <div className="relative h-64 w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={`M0,${height} ${points} L${width},${height} Z`}
            fill="url(#gradient)"
            className="transition-all duration-1000 ease-in-out"
          />
          
          {/* Line */}
          <path
            d={`M${points}`}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-1000 ease-in-out"
          />
          
          {/* Points */}
          {data.map((val, index) => {
             const x = (index / (data.length - 1)) * width;
             const y = height - ((val - min) / (max - min)) * height;
             return (
               <circle 
                 key={index} 
                 cx={x} 
                 cy={y} 
                 r="4" 
                 fill="#fff" 
                 stroke="#3B82F6" 
                 strokeWidth="2"
                 className="hover:r-6 transition-all cursor-pointer"
               />
             );
          })}
        </svg>
        
        {/* Y-axis labels (mock) */}
        <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-slate-400 pointer-events-none">
          <span>$50k</span>
          <span>$25k</span>
          <span>$0</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
