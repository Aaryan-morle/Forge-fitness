import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button, Card, Input } from '../components/ui/Base';
import { User, Scale, Ruler, Target, Calendar, Save, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    age: profile?.age || '',
    weight: profile?.weight || '',
    height: profile?.height || '',
    fitnessGoal: profile?.fitnessGoal || 'maintain',
    dailyCalorieGoal: profile?.dailyCalorieGoal || 2000,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    
    try {
      const docRef = doc(db, 'users', profile.uid);
      await updateDoc(docRef, {
        ...formData,
        age: parseInt(formData.age as string) || 0,
        weight: parseFloat(formData.weight as string) || 0,
        height: parseFloat(formData.height as string) || 0,
        dailyCalorieGoal: parseInt(formData.dailyCalorieGoal as string) || 2000,
        updatedAt: new Date().toISOString()
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <header className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-xl shadow-slate-200">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-slate-300" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg border-2 border-white">
            <Check size={16} />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{profile?.displayName || 'User Profile'}</h2>
          <p className="text-slate-500 font-medium">{profile?.email}</p>
          <div className="mt-2 flex items-center gap-2">
             <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
               Tier: {profile?.subscriptionTier || 'Free'}
             </span>
          </div>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-8 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 text-indigo-600">
            <User size={18} /> Personal Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Display Name</label>
              <Input 
                value={formData.displayName}
                onChange={e => setFormData({...formData, displayName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Age</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  className="pl-10"
                  type="number"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 text-emerald-600">
            <Scale size={18} /> Physical Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weight (kg)</label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  className="pl-10"
                  type="number" 
                  step="0.1"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  className="pl-10"
                  type="number"
                  value={formData.height}
                  onChange={e => setFormData({...formData, height: e.target.value})}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 text-indigo-600">
            <Target size={18} /> Fitness Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Goal</label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all cursor-pointer"
                value={formData.fitnessGoal}
                onChange={e => setFormData({...formData, fitnessGoal: e.target.value as any})}
              >
                <option value="lose_weight">Lose Weight</option>
                <option value="maintain">Maintain Fitness</option>
                <option value="gain_muscle">Gain Muscle</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Calorie Goal</label>
              <Input 
                type="number"
                value={formData.dailyCalorieGoal}
                onChange={e => setFormData({...formData, dailyCalorieGoal: e.target.value})}
              />
            </div>
          </div>
        </Card>

        <Button 
          className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-indigo-600/20" 
          disabled={loading}
          isLoading={loading}
        >
          {saved ? (
             <div className="flex items-center gap-2">
                <Check size={20} /> Profiles Saved Successfully
             </div>
          ) : (
            <div className="flex items-center gap-2">
               <Save size={20} /> Save My Profile
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
