import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, trend }) => {
  const isPositive = trend === 'up';

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isPositive ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`flex items-center font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
            {change}
          </span>
          <span className="ml-2 text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
