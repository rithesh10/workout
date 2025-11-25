import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavigation from './TopNavigation';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      
      {/* Main Content Area */}
      {/* Add padding-top to account for fixed header (h-16 = 4rem) */}
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
