import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Button, Card } from '../components/ui/Base';
import { Dumbbell, Github, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Login success:', result.user.email);
      navigate('/');
    } catch (error: any) {
      console.error('Login failed details:', error);
      // Clean up common firebase error messages for users
      let userFriendlyMessage = 'Authentication failed. Please try again.';
      
      if (error.code === 'auth/popup-blocked') {
        userFriendlyMessage = 'Login popup was blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        userFriendlyMessage = 'Login was cancelled. Please try again.';
      } else if (error.code === 'auth/unauthorized-domain') {
        userFriendlyMessage = 'Current domain is not authorized in Firebase Console.';
      } else if (error.code === 'auth/operation-not-allowed') {
        userFriendlyMessage = 'Google login is not enabled in Firebase project settings.';
      } else if (error.message) {
        userFriendlyMessage = error.message;
      }
      
      setError(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-[#0F172A] [clip-path:polygon(0_0,100%_0,100%_40%,0_60%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-xl shadow-indigo-600/20">
            <Dumbbell className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">FORGE</h1>
          <p className="text-slate-400 text-sm mt-1">Professional Fitness Analytics</p>
        </div>

        <Card className="p-10 border-slate-100 shadow-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-slate-500 text-xs mt-1">Access your performance metrics</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-center border border-red-100">
                {error}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full h-11 text-xs font-bold border-slate-200"
              onClick={handleGoogleLogin}
              isLoading={isLoading}
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-2" alt="Google" />
              CONTINUE WITH GOOGLE
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="bg-white px-3 text-slate-300">Protected Entry</span>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full h-11 text-xs font-bold bg-[#0F172A]"
              onClick={() => {}} 
              disabled
            >
              <Mail className="w-4 h-4 mr-2" />
              LOGIN VIA CREDENTIALS
            </Button>

            <p className="text-center text-[10px] text-slate-400 leading-relaxed px-4">
              Tip: Ensure popups are allowed and you aren't in private mode if login fails.
            </p>
            <p className="text-center text-[10px] text-slate-400 leading-relaxed px-4">
              By proceeding, you agree to our <span className="text-indigo-600 underline">Terms</span> and <span className="text-indigo-600 underline">Privacy Policy</span>.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
