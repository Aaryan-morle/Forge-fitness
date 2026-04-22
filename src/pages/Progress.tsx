import React, { useState } from 'react';
import { Card, Button } from '../components/ui/Base';
import { 
  LineChart, 
  TrendingUp, 
  Calendar, 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  LineChart as RechartsLineChart
} from 'recharts';
import { cn } from '../lib/utils';

const PROGRESS_DATA = [
  { date: 'Apr 1', weight: 80.5, calories: 2100 },
  { date: 'Apr 5', weight: 79.8, calories: 1950 },
  { date: 'Apr 10', weight: 79.2, calories: 2050 },
  { date: 'Apr 15', weight: 78.9, calories: 2200 },
  { date: 'Apr 18', weight: 78.5, calories: 2100 },
  { date: 'Apr 22', weight: 78.2, calories: 2000 },
];

export function Progress() {
  const [range, setRange] = useState('30d');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Progress Analytics</h2>
          <p className="text-slate-500 mt-1 font-medium italic underline decoration-indigo-200 decoration-2">Visualizing your journey to success.</p>
        </div>
        <div className="flex items-center gap-3">
           <select 
             className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
             value={range}
             onChange={e => setRange(e.target.value)}
           >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 months</option>
           </select>
           <Button variant="outline" size="sm">
              <Download size={14} className="mr-1" /> Export
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Weight Change', value: '-2.3 kg', sub: 'Total loss', trend: 'down', color: 'text-indigo-600' },
          { label: 'Avg Calories', value: '2,040', sub: 'Per day', trend: 'up', color: 'text-indigo-600' },
          { label: 'Best Streak', value: '12 Days', sub: 'Logged daily', icon: Trophy, color: 'text-amber-500' },
          { label: 'Fitness Score', value: '84/100', sub: 'Based on activity', trend: 'up', color: 'text-emerald-500' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5 border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              {stat.trend === 'up' && <ArrowUpRight className="text-emerald-500" size={14} />}
              {stat.trend === 'down' && <ArrowDownRight className="text-red-400" size={14} />}
            </div>
            <div className="flex items-baseline gap-2">
              <span className={cn('text-2xl font-bold', stat.color)}>{stat.value}</span>
              <span className="text-[10px] font-medium text-slate-400">{stat.sub}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Weight Trend</h3>
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={PROGRESS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#6366F1" 
                  strokeWidth={3} 
                  dot={{ fill: '#6366F1', strokeWidth: 2, r: 4, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Calorie Consistency</h3>
            <div className="w-3 h-3 rounded-full bg-slate-200" />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROGRESS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Bar dataKey="calories" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <section className="mt-4">
        <h3 className="text-base font-bold text-slate-900 mb-6">Upcoming Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="p-6 bg-indigo-600 border-none flex items-center gap-6 shadow-lg shadow-indigo-600/20">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-400 border-t-white flex items-center justify-center font-bold text-xs text-white">
                85%
              </div>
              <div className="text-white">
                <h4 className="font-bold tracking-tight">Target Weight</h4>
                <p className="text-indigo-100 text-[11px] font-medium opacity-80">0.8 kg to go</p>
              </div>
           </Card>
           <Card className="p-6 border-slate-100 flex items-center gap-4 opacity-60">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                 <Trophy className="text-slate-400" size={20} />
              </div>
              <div>
                 <h4 className="font-bold text-slate-700 text-sm">100k Calories</h4>
                 <p className="text-slate-400 text-xs font-medium">Locked Milestone</p>
              </div>
           </Card>
           <Card className="p-6 border-slate-100 flex items-center gap-4 opacity-60">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                 <LineChart className="text-slate-400" size={20} />
              </div>
              <div>
                 <h4 className="font-bold text-slate-700 text-sm">Elite Metabolism</h4>
                 <p className="text-slate-400 text-xs font-medium">Locked Milestone</p>
              </div>
           </Card>
        </div>
      </section>
    </div>
  );
}


