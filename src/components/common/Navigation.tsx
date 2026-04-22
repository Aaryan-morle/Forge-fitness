import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  Dumbbell, 
  LineChart, 
  User, 
  Crown,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../lib/firebase';
import { Button } from '../ui/Base';

export function Sidebar({ className }: { className?: string }) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Nutrition', icon: Utensils, path: '/nutrition' },
    { name: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { name: 'Progress', icon: LineChart, path: '/progress' },
    { name: 'Premium', icon: Crown, path: '/premium', highlight: true },
  ];

  return (
    <div className={cn('flex flex-col h-full bg-[#0F172A] border-r border-slate-200 w-64', className)}>
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <Dumbbell className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Forge
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium',
              isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
              item.highlight && !isActive && 'text-amber-400 hover:text-amber-300'
            )}
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800/50">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 mb-2"
        >
          <User size={18} />
          Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 w-full transition-all text-left"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export function MobileNav() {
  const navItems = [
    { icon: LayoutDashboard, path: '/' },
    { icon: Utensils, path: '/nutrition' },
    { icon: Dumbbell, path: '/workouts' },
    { icon: LineChart, path: '/progress' },
    { icon: User, path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-8 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            'transition-all',
            isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <item.icon size={22} />
        </NavLink>
      ))}
    </div>
  );
}
