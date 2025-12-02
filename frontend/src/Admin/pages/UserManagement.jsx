import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MoreVertical, Dumbbell, Utensils, Activity } from "lucide-react";
import UserWorkout from "./UserWorkout";
import UserDiet from "./UserDiet";
import config from "../../config/config";
import UserPerformance from "./UserPerformance";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [performanceModalVisible, setPerformanceModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/get-all-users`);
      if (response.data && response.data.data) {
        setUsers(
          response.data.data.map((user) => ({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
          }))
        );
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
      setLoading(false);
    }
  };

  const fetchWorkouts = async (userId) => {
    try {
      setFetchError(null);
      const response = await axios.get(`${config.backendUrl}/get-workout/${userId}`);
      if (response.data && response.data.data) {
        setSelectedWorkout(response.data.data);
      } else {
        setSelectedWorkout(null);
      }
    } catch (err) {
      setFetchError(err.message || "Failed to fetch workout plans.");
      setSelectedWorkout(null);
    }
  };

  const fetchDiet = async (userId) => {
    try {
      setFetchError(null);
      const response = await axios.get(`${config.backendUrl}/get-diet/${userId}`);
      if (response.data && response.data.data) {
        setSelectedDiet(response.data.data);
      } else {
        setSelectedDiet(null);
      }
    } catch (err) {
      setFetchError(err.message || "Failed to fetch diet plans.");
      setSelectedDiet(null);
    }
  };

  const fetchPerformance = async (userId) => {
    try {
      setFetchError(null);
      const response = await axios.get(`${config.backendUrl}/performace/${userId}`);
      if (response.data && response.data.data) {
        setSelectedPerformance(response.data.data);
      } else {
        setSelectedPerformance(null);
      }
    } catch (err) {
      setFetchError(err.message || "Failed to fetch user performance.");
      setSelectedPerformance(null);
    }
  };

  const handleViewPerformance = async (user) => {
    setSelectedUser(user);
    setPerformanceModalVisible(true);
    await fetchPerformance(user.id);
  };

  const closePerformanceModal = () => {
    setPerformanceModalVisible(false);
    setSelectedPerformance(null);
  };

  const handleViewWorkoutPlans = async (user) => {
    setSelectedUser(user);
    setWorkoutModalVisible(true);
    await fetchWorkouts(user.id);
  };

  const handleViewDietPlans = async (user) => {
    setSelectedUser(user);
    setDietModalVisible(true);
    await fetchDiet(user.id);
  };

  const closeWorkoutModal = () => {
    setWorkoutModalVisible(false);
    setSelectedWorkout(null);
  };

  const closeDietModal = () => {
    setDietModalVisible(false);
    setSelectedDiet(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="h-10 rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Full Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Gender</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      {user.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 text-slate-600">{user.phone}</td>
                  <td className="px-6 py-4 text-slate-600">{user.gender}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewWorkoutPlans(user)}
                        className="flex items-center gap-1 rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                        title="Workout Plan"
                      >
                        <Dumbbell size={14} />
                        <span className="hidden sm:inline">Workout</span>
                      </button>
                      <button
                        onClick={() => handleViewDietPlans(user)}
                        className="flex items-center gap-1 rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="Diet Plan"
                      >
                        <Utensils size={14} />
                        <span className="hidden sm:inline">Diet</span>
                      </button>
                      <button
                        onClick={() => handleViewPerformance(user)}
                        className="flex items-center gap-1 rounded-md bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                        title="Performance"
                      >
                        <Activity size={14} />
                        <span className="hidden sm:inline">Stats</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {workoutModalVisible && (
        <UserWorkout
          selectedWorkout={selectedWorkout}
          selectedUser={selectedUser}
          fetchError={fetchError}
          onClose={closeWorkoutModal}
        />
      )}
      {dietModalVisible && (
        <UserDiet
          selectedDiet={selectedDiet}
          selectedUser={selectedUser}
          fetchError={fetchError}
          onClose={closeDietModal}
        />
      )}
      {performanceModalVisible && (
        <UserPerformance
          selectedPerformance={selectedPerformance}
          selectedUser={selectedUser}
          fetchError={fetchError}
          onClose={closePerformanceModal}
        />
      )}
    </div>
  );
};

export default UserManagement;

