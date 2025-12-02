import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ fullName: 'Admin' });

  useEffect(() => {
    const storedData = localStorage.getItem("adminData");
    if (storedData) {
      try {
        setUser(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to parse admin data", e);
      }
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <Header toggleSidebar={toggleSidebar} user={user} />
        
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-7xl animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
