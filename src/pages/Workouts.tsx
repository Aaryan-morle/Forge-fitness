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
  History,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Workout, Exercise } from '../types/index';

const PRESET_WORKOUTS = [
  { id: '1', name: 'Upper Body Blast', duration: 45, cal: 350, category: 'Strength' },
  { id: '2', name: 'HIIT Cardio', duration: 30, cal: 400, category: 'Cardio' },
  { id: '3', name: 'Leg Day', duration: 60, cal: 500, category: 'Strength' },
  { id: '4', name: 'Morning Yoga', duration: 20, cal: 100, category: 'Flexibility' },
];

export function Workouts() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Workout[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'history'>('browse');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const workoutsRef = collection(db, 'users', user.uid, 'workouts');
      const q = query(workoutsRef, orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      setHistory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout)));
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

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, weight: 0 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleSaveWorkout = async () => {
    if (!user) return;
    if (!workoutType || !duration) {
      setError('Please provide workout type and duration.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const workoutData = {
        userId: user.uid,
        type: workoutType,
        duration: parseInt(duration),
        caloriesBurned: parseInt(calories) || 0,
        notes,
        exercises,
        timestamp: Timestamp.now()
      };

      await addDoc(collection(db, 'users', user.uid, 'workouts'), workoutData);
      setIsLogging(false);
      resetForm();
      fetchHistory();
      setActiveTab('history');
    } catch (e: any) {
      console.error('Error saving workout:', e);
      setError('Failed to save workout log.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setWorkoutType('');
    setDuration('');
    setCalories('');
    setNotes('');
    setExercises([]);
    setError(null);
  };

  const startPreset = (preset: typeof PRESET_WORKOUTS[0]) => {
    setWorkoutType(preset.name);
    setDuration(preset.duration.toString());
    setCalories(preset.cal.toString());
    setIsLogging(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Workouts</h2>
          <p className="text-slate-500 font-medium">Pick a plan or create your own session.</p>
        </div>
        {!isLogging && (
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
        )}
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <X size={16} className="cursor-pointer" onClick={() => setError(null)} />
        </div>
      )}

      {isLogging ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-8 border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Log Personal Session</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsLogging(false)}>Cancel</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Workout Type</label>
                <Input 
                  placeholder="e.g. Back & Biceps" 
                  value={workoutType}
                  onChange={e => setWorkoutType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration (min)</label>
                <Input 
                  type="number" 
                  placeholder="45" 
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Calories Burned (est)</label>
                <Input 
                  type="number" 
                  placeholder="300" 
                  value={calories}
                  onChange={e => setCalories(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Dumbbell size={18} className="text-indigo-600" />
                  Exercises
                </h4>
                <Button variant="outline" size="sm" onClick={addExercise} className="rounded-full">
                  <Plus size={14} className="mr-1" /> Add Exercise
                </Button>
              </div>

              {exercises.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm font-medium">No exercises added yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exercises.map((ex, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-200"
                    >
                      <div className="md:col-span-5 space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Exercise Name</label>
                        <Input 
                          placeholder="Bench Press" 
                          value={ex.name}
                          onChange={e => updateExercise(idx, 'name', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Sets</label>
                        <Input 
                          type="number" 
                          placeholder="4" 
                          value={ex.sets || ''}
                          onChange={e => updateExercise(idx, 'sets', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Reps</label>
                        <Input 
                          type="number" 
                          placeholder="10" 
                          value={ex.reps || ''}
                          onChange={e => updateExercise(idx, 'reps', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Weight (kg)</label>
                        <Input 
                          type="number" 
                          placeholder="60" 
                          value={ex.weight || ''}
                          onChange={e => updateExercise(idx, 'weight', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => removeExercise(idx)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notes (Optional)</label>
              <textarea 
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm min-h-[100px]"
                placeholder="How did you feel during the session?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div className="mt-10 flex justify-end gap-4">
               <Button variant="ghost" onClick={() => { resetForm(); setIsLogging(false); }}>Discard</Button>
               <Button variant="primary" className="px-8" isLoading={saving} onClick={handleSaveWorkout}>
                 <Save size={18} className="mr-2" />
                 Save Session
               </Button>
            </div>
          </Card>
        </motion.div>
      ) : activeTab === 'browse' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            onClick={() => setIsLogging(true)}
            className="hover:border-indigo-600/50 transition-all cursor-pointer group flex flex-col items-center justify-center p-8 border-dashed bg-slate-50 border-slate-200"
          >
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
                <button 
                  onClick={() => startPreset(workout)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl shadow-indigo-600/40"
                >
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
              <Card key={log.id} className="overflow-hidden border-slate-200 hover:border-indigo-100 transition-all group">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                      <Dumbbell className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 leading-tight">{log.type || 'Workout'}</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {log.timestamp ? new Date((log.timestamp as any).toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
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
                </div>
                
                {log.exercises && log.exercises.length > 0 && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-50 bg-slate-50/30">
                    <div className="flex flex-wrap gap-2">
                      {log.exercises.map((ex, i) => (
                        <div key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full flex items-center gap-2 text-[10px] font-bold">
                          <span className="text-slate-900">{ex.name}</span>
                          <span className="w-px h-2 bg-slate-200" />
                          <span className="text-indigo-600">{ex.sets}x{ex.reps}</span>
                          {ex.weight ? <span className="text-slate-400">{ex.weight}kg</span> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {log.notes && (
                  <div className="px-5 pb-4">
                    <p className="text-[11px] text-slate-500 italic">"{log.notes}"</p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {!isLogging && (
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
      )}
    </div>
  );
}


