import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import UserManagement from "../pages/UserManagement";
import WorkoutPlans from "../pages/WorkoutPlans";
import ClassSchedule from "../pages/UserProfile";
import AdminProfile from "./AdminProfile";
import Exercises from "../pages/Exercises";
import UpdateYTLink from "../pages/Exercises";

const AdminPortal = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="workouts" element={<WorkoutPlans />} />
        <Route path="classes" element={<ClassSchedule />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="exercise" element={<UpdateYTLink />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPortal;

