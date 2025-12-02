import React from 'react';
import { Menu, Search, Bell, User, ChevronDown } from 'lucide-react';

const Header = ({ toggleSidebar, user }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-100 px-3 py-2 rounded-lg w-64 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:text-blue-600 transition-all">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-3 pl-1 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-2 ring-white shadow-sm">
            <User size={18} />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-700">{user?.fullName || 'Admin User'}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <ChevronDown size={16} className="text-slate-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
};

export default Header;
