import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button, Card, Input } from '../components/ui/Base';
import { 
  Plus, 
  Dumbbell, 
  Play, 
  CheckCircle2, 
  Clock, 
  Flame,
  ChevronRight,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const PRESET_WORKOUTS = [
  { id: '1', name: 'Upper Body Blast', duration: 45, cal: 350, category: 'Strength' },
  { id: '2', name: 'HIIT Cardio', duration: 30, cal: 400, category: 'Cardio' },
  { id: '3', name: 'Leg Day', duration: 60, cal: 500, category: 'Strength' },
  { id: '4', name: 'Morning Yoga', duration: 20, cal: 100, category: 'Flexibility' },
];

export function Workouts() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'history'>('browse');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const workoutsRef = collection(db, 'users', user.uid, 'workouts');
      const q = query(workoutsRef, orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      setHistory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      console.error('Error fetching history:', e);
      setError('Failed to load workout history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Workouts</h2>
          <p className="text-slate-500 font-medium">Pick a plan or create your own session.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('browse')}
            className={cn(
              'px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all',
              activeTab === 'browse' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all',
              activeTab === 'history' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            History
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'browse' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:border-indigo-600/50 transition-all cursor-pointer group flex flex-col items-center justify-center p-8 border-dashed bg-slate-50 border-slate-200">
            <div className="w-12 h-12 rounded-[1.25rem] bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all shadow-sm">
              <Plus className="text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <p className="font-bold text-slate-900 text-sm">Custom Session</p>
          </Card>

          {PRESET_WORKOUTS.map((workout) => (
            <Card key={workout.id} className="group hover:border-indigo-200 transition-all border-slate-200 overflow-hidden">
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">{workout.category}</span>
                  <h4 className="font-bold text-lg text-white leading-tight">{workout.name}</h4>
                </div>
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl shadow-indigo-600/40">
                  <Play fill="white" size={24} className="ml-1 text-white" />
                </button>
              </div>
              <div className="p-4 flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-400" />
                  <span>{workout.duration}m</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame size={14} className="text-orange-500" />
                  <span>{workout.cal} kcal</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {loading ? (
             <div className="flex items-center justify-center py-20">
               <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
             </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <History className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-medium text-lg tracking-tight">Your workout history is empty.</p>
              <Button variant="outline" size="sm" className="mt-4 px-6 rounded-full" onClick={() => setActiveTab('browse')}>Start First Session</Button>
            </div>
          ) : (
            history.map((log) => (
              <Card key={log.id} className="p-5 flex items-center justify-between border-slate-200 hover:border-indigo-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                    <Dumbbell className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 leading-tight">{log.type || 'Workout'}</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {log.timestamp ? new Date(log.timestamp.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Duration</p>
                    <p className="font-black text-slate-900">{log.duration || 0} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Burned</p>
                    <p className="font-black text-indigo-600">{log.caloriesBurned || 0} kcal</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <section>
          <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Fitness Categories</h3>
          <div className="grid grid-cols-2 gap-4">
            {['Hardcore Gym', 'Home Workout', 'Yoga & Zen', 'Running'].map((cat) => (
              <div key={cat} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-600/30 hover:shadow-lg hover:shadow-indigo-600/5 transition-all cursor-pointer text-center group">
                <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600">{cat}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">AI Training Tips</h3>
          <Card className="p-8 bg-slate-900 border-none relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-8 h-8 rounded-full bg-emerald-400/10 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium text-sm italic">
              "Focus on progressive overload. Increasing your lifting volume by just 2% weekly can lead to massive gains over 6 months."
            </p>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] cursor-pointer hover:text-white transition-colors">
              Request Custom Tip <ChevronRight size={14} />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}


