import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, Button } from '../components/ui/Base';
import { 
  Crown, 
  Check, 
  ShieldCheck, 
  Zap, 
  Brain, 
  BarChart3,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Premium() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const isPremium = profile?.subscriptionTier === 'premium';

  const handleUpgrade = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      // Mock payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const docRef = doc(db, 'users', profile.uid);
      await updateDoc(docRef, { subscriptionTier: 'premium' });
      await refreshProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { title: 'AI Meal Suggestions', desc: 'Personalized recipes based on your dietary preferences and goals.', icon: Brain },
    { title: 'Custom Workout Plans', desc: 'AI-generated training programs that evolve with your performance.', icon: Sparkles },
    { title: 'Advanced Analytics', desc: 'Detailed insights into your metabolism, macro trends, and growth.', icon: BarChart3 },
    { title: 'Priority Coaching', desc: 'Direct access to expert training tips and priority support.', icon: Zap },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="inline-flex items-center justify-center p-3 bg-amber-400 rounded-2xl text-black shadow-[0_0_50px_rgba(251,191,36,0.2)]"
        >
          <Crown size={32} />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase italic">Unlock Your Potential</h2>
        <p className="text-zinc-500 max-w-xl mx-auto">Elevate your fitness journey with AI-powered insights and professional tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 group hover:border-amber-400/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-amber-400" size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="relative overflow-hidden p-8 md:p-12 border-amber-400/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-900/10">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Crown size={200} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-6 flex-1">
            <h3 className="text-3xl font-bold">Elite Membership</h3>
            <ul className="space-y-4">
              {['No advertisements', 'Real-time syncing', 'Cloud backups', 'Early access features'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-lime-400/20 flex items-center justify-center">
                    <Check className="text-lime-400" size={12} strokeWidth={4} />
                  </div>
                  <span className="text-zinc-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
               <p className="text-sm text-zinc-500">Only $9.99 / month after 7-day trial</p>
            </div>
          </div>

          <div className="w-full md:w-auto h-full flex flex-col justify-center gap-4 min-w-[280px]">
            {isPremium ? (
               <Card className="p-8 border-lime-400/30 bg-lime-400/5 text-center space-y-3">
                  <ShieldCheck className="mx-auto text-lime-400" size={48} />
                  <p className="text-lg font-bold text-lime-400 uppercase tracking-widest">Active Plan</p>
                  <p className="text-sm text-zinc-500">Your Forge Elite subscription is active until May 22, 2026.</p>
               </Card>
            ) : (
              <>
                <Button 
                  onClick={handleUpgrade}
                  className="w-full h-16 bg-amber-400 hover:bg-amber-500 text-black text-xl font-black rounded-2xl shadow-[0_10px_30px_rgba(251,191,36,0.3)] shadow-inner"
                  isLoading={loading}
                >
                  START FREE TRIAL
                </Button>
                <p className="text-center text-xs text-zinc-500">Cancel anytime. Safe & secure payment.</p>
              </>
            )}
          </div>
        </div>
      </Card>

      <section className="text-center space-y-6 py-12">
         <h4 className="font-bold text-zinc-600 uppercase tracking-widest">Trusted by 10,000+ Athletes</h4>
         <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale contrast-125">
            <div className="text-2xl font-black italic">HUSTLE</div>
            <div className="text-2xl font-black italic">PULSE</div>
            <div className="text-2xl font-black italic">GRIND</div>
            <div className="text-2xl font-black italic">ZENITH</div>
         </div>
      </section>
    </div>
  );
}
