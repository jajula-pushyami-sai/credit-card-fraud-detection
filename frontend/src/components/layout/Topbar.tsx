import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Cpu, Settings } from "lucide-react";
import { useAuthStore } from '@/store/authStore';
import { cn } from "@/utils/cn";

export function Topbar() {
  const { user } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Risk Calculator', icon: Cpu, path: '/calculate' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'FS'
    : 'FS';

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-6 flex-1 min-w-max">
        <Link to="/dashboard" className="flex items-center gap-2 select-none mr-4">
          <img src="/logo.svg" alt="FraudShield AI Logo" className="w-6 h-6" />
          <h1 className="text-lg font-bold leading-none tracking-tight text-[#0F766E] hidden md:block">FraudShield AI</h1>
        </Link>
        
        {/* Navigation Pills */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
                  isActive
                    ? "bg-[#0F766E] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4 md:gap-6 pl-4">
        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="h-9 w-9 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs shadow-sm border border-emerald-700">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
