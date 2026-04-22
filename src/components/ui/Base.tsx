import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm font-semibold',
      secondary: 'bg-slate-900 text-white hover:bg-slate-800',
      outline: 'border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-sm',
      ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-semibold',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

export const Card = ({ className, children, ...props }: { className?: string; children: React.ReactNode; [key: string]: any }) => (
  <div className={cn('bg-white border border-slate-200 rounded-2xl shadow-sm', className)} {...props}>
    {children}
  </div>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm',
        className
      )}
      {...props}
    />
  )
);
