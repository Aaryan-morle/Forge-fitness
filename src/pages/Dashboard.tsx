import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Card, Button } from '../components/ui/Base';
import { 
  Flame, 
  Utensils, 
  Timer, 
  TrendingUp, 
  Plus,
  ChevronRight,
  User,
  Crown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'motion/react';
import { cn, formatCalories } from '../lib/utils';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    consumed: 0,
    burned: 0,
    activeMinutes: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for demo if no real data yet
    setChartData([
      { day: 'Mon', consumed: 2100, burned: 400 },
      { day: 'Tue', consumed: 1900, burned: 600 },
      { day: 'Wed', consumed: 2400, burned: 350 },
      { day: 'Thu', consumed: 2200, burned: 500 },
      { day: 'Fri', consumed: 2000, burned: 450 },
      { day: 'Sat', consumed: 2500, burned: 200 },
      { day: 'Sun', consumed: 1800, burned: 800 },
    ]);
  }, []);

  const statCards = [
    { 
      label: 'Calories In', 
      value: stats.consumed, 
      goal: profile?.dailyCalorieGoal || 2000, 
      icon: Utensils, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      label: 'Workout Time', 
      value: stats.activeMinutes, 
      goal: 60, 
      unit: 'm', 
      icon: Timer, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Active Burn', 
      value: stats.burned, 
      goal: 500, 
      icon: Flame, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      label: 'Daily Steps', 
      value: 8432, 
      goal: 10000, 
      icon: TrendingUp, 
      color: 'text-slate-600', 
      bg: 'bg-slate-50' 
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Good Morning, {profile?.displayName?.split(' ')[0] || 'User'}</h2>
          <p className="text-slate-500 mt-1 font-medium">Tuesday, Oct 24 • You've burned 65% of your daily goal.</p>
        </div>
        <div className="flex gap-3">
          <Button size="sm" variant="outline">
            Sync Devices
          </Button>
          <Link to="/nutrition">
            <Button size="sm">
              <Plus size={16} /> Log Activity
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-5 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-900">
                {formatCalories(stat.value)}
                <span className="text-slate-400 text-sm font-normal ml-1.5">/ {stat.goal}{stat.unit || ' kcal'}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stat.value / stat.goal) * 100, 100)}%` }}
                  className={cn('h-full transition-all duration-1000', stat.color.replace('text', 'bg'))}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Activity Trends</h3>
            <div className="flex gap-2">
              <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">Week</span>
              <span className="text-[11px] font-bold text-slate-400 px-2 py-1 rounded-md">Month</span>
            </div>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="consumed" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Macro Breakdown</h3>
          <div className="space-y-5">
            {[
              { label: 'Protein', value: 142, goal: 180, color: 'bg-amber-500' },
              { label: 'Carbs', value: 210, goal: 250, color: 'bg-blue-500' },
              { label: 'Fats', value: 58, goal: 70, color: 'bg-emerald-500' },
            ].map((macro) => (
              <div key={macro.label}>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-500">{macro.label}</span>
                  <span className="text-slate-900 font-bold">{macro.value}g / {macro.goal}g</span>
                </div>
                <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div 
                    className={cn('h-full', macro.color)}
                    style={{ width: `${Math.min((macro.value / macro.goal) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4 text-center">
             <Link to="/premium" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
               Premium: AI Meal Suggestion ↗
             </Link>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 mb-6">Recent Workouts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { name: 'HIIT Circuit', sub: '45 min • 320 kcal • High Intensity', initial: 'H', bg: 'bg-indigo-50', text: 'text-indigo-600' },
             { name: 'Power Yoga', sub: '30 min • 140 kcal • Recovery', initial: 'P', bg: 'bg-emerald-50', text: 'text-emerald-600' },
             { name: 'Strength Training', sub: '60 min • 480 kcal • Upper Body', initial: 'S', bg: 'bg-amber-50', text: 'text-amber-600' }
           ].map((workout) => (
             <div key={workout.name} className="flex items-center gap-4">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg', workout.bg, workout.text)}>
                  {workout.initial}
                </div>
                <div>
                   <div className="text-sm font-bold text-slate-900">{workout.name}</div>
                   <div className="text-xs text-slate-500 mt-0.5 font-medium">{workout.sub}</div>
                </div>
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
}


