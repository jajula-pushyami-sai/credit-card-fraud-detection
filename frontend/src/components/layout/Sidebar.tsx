import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  Cpu,
  Settings,
  LogOut,
  Shield,
  UserCheck
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const role = user?.role || 'Customer';

  const visibleNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Risk Calculator', icon: Cpu, path: '/calculate' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ item }: { item: { name: string; path: string; icon: React.ComponentType<{className?: string}> } }) => {
    const isActive = location.pathname.startsWith(item.path);
    const Icon = item.icon;
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors mb-1.5",
          isActive 
            ? "bg-[#0F766E]/10 text-[#0F766E] dark:bg-emerald-950/40 dark:text-emerald-400 font-bold" 
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <Icon className={cn("h-4 w-4", isActive ? "text-[#0F766E] dark:text-emerald-400" : "")} />
        {item.name}
      </Link>
    );
  };

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="p-6 overflow-y-auto">
        <Link to="/dashboard" className="flex items-center gap-2 mb-8 select-none">
          <img src="/logo.svg" alt="FraudShield AI Logo" className="w-6 h-6" />
          <h1 className="text-lg font-bold leading-none tracking-tight text-[#0F766E] dark:text-emerald-400">FraudShield AI</h1>
        </Link>

        {/* User Role Card */}
        {user && (
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              {role === 'Administrator' ? (
                <Shield className="w-4 h-4 text-emerald-600" />
              ) : role === 'Fraud Analyst' ? (
                <UserCheck className="w-4 h-4 text-teal-600" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-400" />
              )}
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight truncate">
                {user.first_name} {user.last_name}
              </span>
            </div>
            <div className="text-[10px] font-bold text-[#0F766E] dark:text-emerald-400 uppercase tracking-wider">
              {role}
            </div>
          </div>
        )}
        
        <nav className="mb-8">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3 px-3">Main Navigation</p>
          {visibleNavItems.map((item) => <NavItem key={item.name} item={item} />)}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
