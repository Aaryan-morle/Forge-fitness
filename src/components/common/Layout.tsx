import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar, MobileNav } from './Navigation';
import { useAuth } from '../../hooks/useAuth';

export function Layout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      <Sidebar className="hidden md:flex" />
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 pb-32 md:pb-8">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
