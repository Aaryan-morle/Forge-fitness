import { User as FirebaseUser } from 'firebase/auth';

export type FitnessGoal = 'lose_weight' | 'maintain' | 'gain_muscle';
export type SubscriptionTier = 'free' | 'premium';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  fitnessGoal?: FitnessGoal;
  dailyCalorieGoal?: number;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  updatedAt?: string;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  timestamp: Date;
}

export interface Workout {
  id: string;
  userId: string;
  type: string;
  duration: number; // minutes
  caloriesBurned: number;
  notes?: string;
  exercises?: Exercise[];
  timestamp: Date;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface DashboardStats {
  dailyCaloriesConsumed: number;
  dailyCaloriesBurned: number;
  weeklyProgress: { day: string; consumed: number; burned: number }[];
}
