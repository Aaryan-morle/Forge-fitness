import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button, Card, Input } from '../components/ui/Base';
import { Plus, Search, Utensils, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCalories, getTodayRange, cn } from '../lib/utils';

interface MealLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: any;
}

export function Nutrition() {
  const { user, profile } = useAuth();
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Meal Form
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  const fetchMeals = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { start } = getTodayRange();
    try {
      const mealsRef = collection(db, 'users', user.uid, 'meals');
      const q = query(
        mealsRef, 
        where('timestamp', '>=', Timestamp.fromDate(start)),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const mealsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MealLog[];
      setMeals(mealsData);
    } catch (e: any) {
      console.error('Error fetching meals:', e);
      setError('Failed to load meals. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [user]);

  const totalConsumed = meals.reduce((acc, current) => acc + (current.calories || 0), 0);
  const calorieGoal = profile?.dailyCalorieGoal || 2000;
  const remaining = calorieGoal - totalConsumed;

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMeal.name || !newMeal.calories) return;

    setSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, 'users', user.uid, 'meals'), {
        userId: user.uid,
        name: newMeal.name,
        calories: Math.max(0, parseInt(newMeal.calories) || 0),
        protein: Math.max(0, parseInt(newMeal.protein) || 0),
        carbs: Math.max(0, parseInt(newMeal.carbs) || 0),
        fats: Math.max(0, parseInt(newMeal.fats) || 0),
        timestamp: Timestamp.now()
      });
      
      setIsModalOpen(false);
      setNewMeal({ name: '', calories: '', protein: '', carbs: '', fats: '' });
      await fetchMeals();
    } catch (e: any) {
      console.error('Error adding meal:', e);
      setError('Failed to add meal. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to remove this meal?')) return;

    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'users', user.uid, 'meals', mealId));
      await fetchMeals();
    } catch (e: any) {
      console.error('Error deleting meal:', e);
      setError('Failed to delete meal.');
    }
  };

  if (loading && meals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Nutrition</h2>
          <p className="text-slate-500 font-medium">Track your daily intake and stay on target.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-full h-11 px-6 shadow-lg shadow-indigo-600/20">
          <Plus size={20} className="mr-1" /> Log Meal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 p-6 flex flex-col items-center justify-center text-center space-y-4 border-slate-200">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-100"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={364.4}
                initial={{ strokeDashoffset: 364.4 }}
                animate={{ strokeDashoffset: 364.4 - (Math.min(totalConsumed / calorieGoal, 1) * 364.4) }}
                className="text-indigo-600"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 leading-none">{remaining > 0 ? remaining : 0}</span>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Left</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Consumed</p>
            <p className="text-xl font-black text-slate-900">{formatCalories(totalConsumed)} kcal</p>
          </div>
        </Card>

        <Card className="md:col-span-3 p-8 border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6">Today's Macros</h3>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Protein', value: meals.reduce((a, b) => a + (b.protein || 0), 0), goal: 150, color: 'bg-amber-500' },
              { label: 'Carbs', value: meals.reduce((a, b) => a + (b.carbs || 0), 0), goal: 250, color: 'bg-blue-500' },
              { label: 'Fats', value: meals.reduce((a, b) => a + (b.fats || 0), 0), goal: 70, color: 'bg-emerald-500' },
            ].map((macro) => (
              <div key={macro.label} className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                  <span className="text-slate-400">{macro.label}</span>
                  <span className="text-slate-900 font-black">{macro.value}g</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div 
                    className={cn('h-full', macro.color)}
                    style={{ width: `${Math.min((macro.value / macro.goal) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Meal History</h3>

        <div className="space-y-3">
          {meals.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
              <Utensils className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-medium">No meals logged yet today.</p>
            </div>
          ) : (
            meals.map((meal) => (
              <Card key={meal.id} className="p-5 flex items-center justify-between hover:border-indigo-200 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Utensils size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{meal.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-black text-slate-900">{meal.calories} kcal</span>
                  <button 
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900">Log New Meal</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <X />
                </button>
              </div>

              <form onSubmit={handleAddMeal} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Meal Name</label>
                  <Input 
                    placeholder="e.g. Chicken Salad" 
                    value={newMeal.name}
                    onChange={e => setNewMeal({...newMeal, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Calories</label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={newMeal.calories}
                    onChange={e => setNewMeal({...newMeal, calories: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Protein (g)</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={newMeal.protein}
                      onChange={e => setNewMeal({...newMeal, protein: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Carbs (g)</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={newMeal.carbs}
                      onChange={e => setNewMeal({...newMeal, carbs: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Fats (g)</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={newMeal.fats}
                      onChange={e => setNewMeal({...newMeal, fats: e.target.value})}
                    />
                  </div>
                </div>
                <Button className="w-full mt-4 h-12 shadow-lg shadow-indigo-600/10" isLoading={submitting}>Save Meal</Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


