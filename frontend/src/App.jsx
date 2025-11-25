import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext";

// Layouts
import MainLayout from "./components/Layout/MainLayout";

// Public Pages
import LandingPage from "./Login/LandingPage";
import LoginModal from "./Login/Login";
import RegisterModal from "./Login/RegisterModal";
import ForgotPassword from "./Login/ForgotPassword";
import Join from "./Client/Pages/join";

// Protected Pages
import Dashboard from "./Client/Pages/Dashboard";
import Home from "./Client/Pages/Home";
import UserProfile from "./Client/Pages/UserProfile";
import ExerciseTracker from "./Client/Pages/ExerciseTracker";

// Features
import DietPlan from "./Client/features/Diet/Dietplan";
import GetDietPlan from "./Client/features/Diet/GetDietPlan";
import WorkoutPlan from "./Client/features/workout/Workoutplan";
import WorkoutPage from "./Client/features/workout/GetWorkoutPlan";
import ExerciseDetail from "./Client/features/workout/Exercise";
import PerformanceModal from "./Client/features/workout/Performance";
import UserPerformance from "./Client/features/workout/UserPerformance";
// import JoinWorkout from "./Client/features/workout/join";

// Admin
import AdminPortal from "./Admin/components/AdminPortal";

// Components
import Footer from "./components/Footer";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <div className="app-container flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginModal />} />
            <Route path="/register" element={<RegisterModal />} />
            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/dash" element={<Join />} />
            <Route path="/home" element={<Home />} /> {/* Assuming Home is public or landing-like? If not, move to protected */}

            {/* Admin Routes - Keep separate for now */}
            <Route path="/admin/*" element={<AdminPortal />} />

            {/* Protected Routes (Wrapped in MainLayout) */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/exerciseTracker" element={<ExerciseTracker />} />
              
              {/* Workout Features */}
              <Route path="/generateWorout" element={<WorkoutPlan />} />
              <Route path="/getWorkoutPlan" element={<WorkoutPage />} />
              <Route path="/getExercise" element={<ExerciseDetail />} />
              <Route path="/performance" element={<PerformanceModal />} />
              <Route path="/user-performance" element={<UserPerformance />} />
              
              {/* Diet Features */}
              <Route path="/dietplan" element={<DietPlan />} />
              <Route path="/getDiet" element={<GetDietPlan />} />
            </Route>
          </Routes>

          {/* Footer - Only show on public pages? Or globally? 
              The original design had it globally inside the flex container.
              With Sidebar, Footer might look weird next to it or below it.
              Let's keep it outside Routes so it shows everywhere, but we might need to adjust MainLayout to not overlap.
              Actually, MainLayout has its own structure. If we want Footer inside MainLayout, we should move it there.
              For now, let's leave it here but it might appear below the sidebar container which is weird.
              Better to hide it for authenticated routes or put it inside MainLayout.
              Let's conditionally render it or just leave it for now and see.
              The original code had it at the bottom of everything.
           */}
           {/* <Footer />  -- Commenting out global footer for now as Sidebar layout usually doesn't have a global footer like landing pages. 
               We can add it to LandingPage specifically if needed, or MainLayout. 
               Let's assume LandingPage has its own footer or we add it back to specific pages.
               Actually, let's keep it but maybe we need to check route to not show it on dashboard if it looks bad.
           */}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
