import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Dumbbell, Calendar, TrendingUp, Plus, Download } from "lucide-react";
import config from "../../config/config";
import StatCard from "../components/Dashboard/StatCard";
import RecentActivityTable from "../components/Dashboard/RecentActivityTable";
import RevenueChart from "../components/Dashboard/RevenueChart";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestStats, setLatestStats] = useState(null);
  const [statsFor30DaysAgo, setStatsFor30DaysAgo] = useState(null);

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${config.backendUrl}/get-all-users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
      setLoading(false);
    }
  };

  const getDate30DaysAgo = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 30);
    return currentDate.toISOString().split('T')[0];
  };

  const fetchLatestStats = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/latest`);
      setLatestStats(response.data.data);
    } catch (err) {
      console.error("Error fetching latest stats:", err);
    }
  };

  const fetchStatsFor30DaysAgo = async () => {
    try {
      const date30DaysAgo = getDate30DaysAgo();
      const response = await axios.get(`${config.backendUrl}/date/${date30DaysAgo}`);
      setStatsFor30DaysAgo(response.data.data);
    } catch (err) {
      console.error("Error fetching stats for 30 days ago:", err);
    }
  };

  useEffect(() => {
    fetchLatestStats();
    fetchStatsFor30DaysAgo();
    fetchUsers();
  }, []);

  const calculateChangePercentage = (current, past) => {
    if (!past || past === 0) return 0;
    return ((current - past) / past) * 100;
  };

  const getChange = (key) => {
    if (latestStats && statsFor30DaysAgo) {
      const change = calculateChangePercentage(latestStats[key], statsFor30DaysAgo[key]);
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    }
    return "+0%";
  };

  const getTrend = (key) => {
    if (latestStats && statsFor30DaysAgo) {
      return latestStats[key] >= statsFor30DaysAgo[key] ? 'up' : 'down';
    }
    return 'up';
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      change: getChange('totalUsers'),
      trend: getTrend('totalUsers'),
    },
    {
      title: "Active Workouts",
      value: latestStats ? latestStats.activeWorkouts : 0,
      icon: Dumbbell,
      change: getChange('activeWorkouts'),
      trend: getTrend('activeWorkouts'),
    },
    {
      title: "Total Classes",
      value: latestStats ? latestStats.activeWorkouts : 0, // Assuming same metric for now
      icon: Calendar,
      change: getChange('activeWorkouts'),
      trend: getTrend('activeWorkouts'),
    },
    {
      title: "Monthly Revenue",
      value: `$${latestStats ? latestStats.revenue : 0}`,
      icon: TrendingUp,
      change: getChange('revenue'),
      trend: getTrend('revenue'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download size={16} />
            Export Report
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors">
            <Plus size={16} />
            New User
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts & Activity Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart takes up 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        
        {/* Recent Activity takes up 1 column */}
        <div className="lg:col-span-1">
          <div className="h-full rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
            <h3 className="mb-4 font-semibold text-slate-900">Upcoming Classes</h3>
            <div className="space-y-4">
              {[{ name: "Yoga Flow", time: "10:00 AM", instructor: "Sarah" }, 
                { name: "HIIT Blast", time: "2:00 PM", instructor: "Mike" },
                { name: "Pilates", time: "4:30 PM", instructor: "Emma" }
              ].map((cls, idx) => (
                <div key={idx} className="flex items-center gap-4 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{cls.name}</p>
                    <p className="text-xs text-slate-500">{cls.time} • {cls.instructor}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              View Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <RecentActivityTable users={users.slice(0, 5)} />
    </div>
  );
};

export default Dashboard;
